---
title: "Dev Log: Building the Orcheo Plugin System"
summary: "An inside look at the architecture decisions, implementation choices, and lessons learned while building Orcheo's managed plugin system — covering the loader, lifecycle CLI, stack-aware runtime targeting, the PluginAPI contract, and the WeCom and Lark listener plugins that validated the design."
pubDate: 2026-03-20
author: Shaojie Jiang
category: Dev Log
tags:
  - orcheo
  - plugins
  - architecture
  - developer-experience
  - cli
  - listeners
  - ai-agents
---

We shipped the Orcheo plugin system this week. The
[announcement post](/news/orcheo-plugin-ecosystem-launch) covers what it
means for users. This post is the inside look: what we built, the decisions we
made, and what we learned along the way.

## What we were replacing

Before this release, extending Orcheo meant one of two things:

1. Edit core and submit a pull request.
2. Add your package to `sitecustomize` and rely on `PYTHONPATH` import order.

Option 1 creates a contribution bottleneck. Option 2 is operationally
fragile — it breaks silently on upgrades and there is no story for operators
who want to manage extensions through their normal deployment tooling.

Orcheo already had registries for nodes, edges, and agent tools. The missing
pieces were a managed lifecycle, a compatibility contract, and operator
support. Those are what we built.

## The architecture

### Plugin state files

The system centers on two files under `~/.orcheo/plugins/` (relocatable with
`ORCHEO_PLUGIN_DIR`):

- **`plugins.toml`** — desired state: what plugins the operator wants and
  whether each is enabled.
- **`plugin-lock.toml`** — resolved state: exact versions, checksums, entry
  points, and exports for every installed plugin.

This mirrors the `pyproject.toml` / lockfile pattern that operators already
understand. Desired state is what you commit; lock state is what you deploy.

### The plugin manager

The manager owns the install/update/uninstall/enable/disable flow. Its main
job is to keep desired state and lock state synchronized and to run
compatibility checks before any change takes effect.

Compatibility is validated against two axes:

- **`plugin_api_version`** — a single positive integer in the plugin manifest.
  If the manifest version does not match the running Orcheo version, the plugin
  is refused. We kept this simple: one number is easier to reason about than a
  semver range negotiation.
- **`orcheo_version`** — a PEP 440 specifier in the manifest. The manager
  checks this against the installed `orcheo` package version.

### The plugin loader

The loader runs at Orcheo startup. It reads lock state, skips disabled plugins,
checks compatibility, imports each enabled plugin's entry point, and calls
`register(api)` with a `PluginAPI` instance. The `PluginAPI` wraps every
registration call with bookkeeping so the loader knows exactly which nodes,
edges, agent tools, triggers, and listeners belong to which plugin.

This bookkeeping enables impact classification: when an additive change comes
in (new component, nothing removed), the loader can apply it to new workflow
runs without restarting. If the change replaces an existing exported
identifier, it shows an impact summary and asks for confirmation. If the change
touches a trigger or listener, it recommends restart.

### The PluginAPI

The `PluginAPI` is the only stable surface plugins are allowed to touch:

```python
api.register_node(metadata, cls)
api.register_edge(metadata, cls, aliases=())
api.register_agent_tool(metadata, tool)
api.register_trigger(metadata, factory)
api.register_listener(metadata, compiler, adapter_factory, aliases=())
```

Plugins that call anything outside this surface are not supported. This lets us
evolve Orcheo internals without worrying about what plugins might be doing to
them.

### The CLI

Every lifecycle operation has a dedicated command:

```bash
orcheo plugin list [--runtime auto|local|stack]
orcheo plugin show <name> [--runtime auto|local|stack]
orcheo plugin install <ref> [--runtime auto|local|stack]
orcheo plugin update <name> [--runtime auto|local|stack]
orcheo plugin update --all [--runtime auto|local|stack]
orcheo plugin enable <name> [--runtime auto|local|stack]
orcheo plugin disable <name> [--runtime auto|local|stack]
orcheo plugin uninstall <name> [--runtime auto|local|stack]
orcheo plugin doctor [--runtime auto|local|stack]
```

`orcheo plugin doctor` deserves a mention. It checks venv integrity, manifest
hash consistency, API and Orcheo version compatibility, importability of every
enabled plugin, and lockfile consistency — all non-destructively. Debugging
plugin failures in production without this would have been painful.

We also designed the CLI around runtime targeting. In managed stack
deployments, the host CLI can target the backend runtime directly with
`--runtime stack` for package and Git-based plugin operations, instead of
making operators exec into containers by hand. Local path and wheel installs
stay local unless you run them from inside the stack environment, which keeps
host development flows predictable.

## Validating with real plugins

We built the WeCom and Lark plugins to validate the contract against real
messaging integrations, not toy examples. Supporting both end-to-end was a
release requirement for the plugin system.

Both plugins are standalone Python packages installable through
`orcheo plugin install`. Each registers a listener node and a runtime adapter.
The WeCom plugin also ships its own reply node. The Lark reply path uses core
Orcheo nodes (`LarkTenantAccessTokenNode` and `LarkSendMessageNode`) because
those nodes are independent of the listener runtime and useful beyond
plugin-backed listener workflows. A user who just needs to push a Lark message
from a scheduled job, approval flow, or agent action should not have to install
listener infrastructure to do it. The contract flow looks like this:

```
orcheo plugin install "git+https://github.com/AI-Colleagues/orcheo-plugin-wecom-listener.git"
→ WeComListenerPluginNode and WeComWsReplyNode visible in node catalog
→ wecom listener platform registered in listener_registry
→ backend creates adapters and manages long-lived WebSocket connections
→ events normalized to ListenerDispatchPayload and dispatched to workflows
```

The Canvas template `template-wecom-lark-shared-listener` then validated that
both listeners could feed into one shared downstream workflow — the practical
case operators face when consolidating multiple messaging channels. That
template declares its required plugins explicitly, and Canvas/backend refuse
to ingest it until both listener plugins are installed, enabled, and loaded in
the runtime that will execute it.

On the core-node side, the Lark reply path uses
`LarkTenantAccessTokenNode` alongside `LarkSendMessageNode`, so the shared
template expresses Lark-specific workflow logic directly instead of embedding a
raw OpenAPI call in the graph, while still keeping those nodes available for
non-listener workflows.

## What we learned

**Manifest placement matters.** `orcheo_plugin.toml` lives inside the Python
package alongside `__init__.py`, not at the repository root. This means it
gets bundled into the distribution wheel and is available without the source
tree. Getting `package-data` right in `pyproject.toml` is the most common
first-time mistake. The
[plugin template repository](https://github.com/AI-Colleagues/orcheo-plugin-template)
gets this right from the start.

**Setuptools is the documented default.** We chose `setuptools` as the build
backend for the reference plugins because it handles the `package-data` /
`package-dir` combination cleanly. The template and reference plugins use it
as the default, though any PEP 517 backend works.

**Impact classification must be visible before applying.** Early iterations
applied changes silently. We added the impact summary as a required output of
every lifecycle command before shipping. Operators need to know what a plugin
change will do before it does it.

**Listener and trigger plugins always require restart.** Long-lived connections
own async state that cannot be cleanly migrated mid-flight. The right answer
for v1 is still restart, not transparent hot-reload. In stack deployments,
stack-targeted CLI flows can apply the mutation in the backend runtime
directly and handle the restart step for running services, while non-stack
deployments still need explicit operator restarts.

**The fixture/test-event pattern in listener adapters is worth the complexity.**
Both the WeCom and Lark adapters run in "fixture mode" when the subscription
config includes `test_events`. This lets integration tests exercise the full
dispatch path without a live connection, keeping the acceptance suite fast and
deterministic.

## What comes next

- **`orcheo plugin init` scaffolding** — generate a package skeleton from the
  CLI so authors do not have to copy the template manually.
- **Plugin search** — `orcheo plugin search <query>` against a curated index.
- **Atomic registration** — all-or-nothing semantics when a plugin load fails
  partway through.
- **Deeper Canvas integration** — plugin-provided metadata driving catalog
  grouping, documentation, and the component picker UI.

The plugin system is the foundation. Everything above it is about making it
progressively easier to build and operate Orcheo extensions at scale.
