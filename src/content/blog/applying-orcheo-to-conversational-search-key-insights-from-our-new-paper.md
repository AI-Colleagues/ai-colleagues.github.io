---
title: "Applying Orcheo to Conversational Search: Key Insights from Our New Paper"
summary: "Key takeaways from our new paper on building conversational search systems with Orcheo: modular workflows, reproducible experimentation, and a smoother path from prototype to production."
pubDate: 2026-02-16
author: Shaojie Jiang and collaborators
category: Research
tags:
  - orcheo
  - conversational-search
  - architecture
  - reproducibility
  - research-paper
---

You've built a conversational search prototype that works in a notebook. Now you need to swap the retriever for a hybrid approach, add reranking for certain query types, wire in safety checks before the final response, and deploy the whole thing — without breaking what already works. In most projects, these pieces live across separate scripts and services, which makes iteration slow and reproducibility fragile.

In our new paper, we use conversational search as a stress test for **Orcheo**, the open-source workflow orchestration platform built by AI Colleagues (AIC). Orcheo reduces that complexity by treating the full system as a modular, versioned graph. Instead of coupling everything into one brittle code path, teams compose workflows from reusable nodes with explicit interfaces and state transitions.

If you’re a researcher, this means cleaner experiments and easier ablations. If you’re shipping a product, this means safer iteration, better observability, and a shorter path to a maintainable deployment.

We built Orcheo to help teams design, run, and operate these workflows reliably — this paper captures the core patterns in a high-variance setting where those patterns matter most.

This post distills the paper’s key insights and translates them into practical takeaways for anyone building (or maintaining) an LLM-powered conversational search system.

The work was co-authored by [Shaojie Jiang](https://nl.linkedin.com/in/shaojie-jiang-1a69b3122) (AI Colleagues (AIC) and University of Amsterdam), [Svitlana Vakulenko](https://www.linkedin.com/in/svakulenko) (WU Vienna University of Economics and Business), and [Maarten de Rijke](https://www.linkedin.com/in/maartenderijke) (University of Amsterdam). If you want the full technical details first, [read the paper here](/docs/orcheo-conversational-search-resource-paper.pdf).

## TL;DR (what you can take away)

- **Move faster without breaking reproducibility** by treating your system as a versioned workflow graph (not a tangle of scripts).
- **Compare variants cleanly** (retrievers, rerankers, prompts, policies, tools) by swapping nodes instead of rewriting pipelines. In our case studies, evaluation workflows took 85–150 lines instead of the typical 500–1,000+.
- **Close the prototype → production gap** by running the same Docker Compose stack locally and in production, with secrets handling and runtime telemetry as first-class concerns.
- **Adopt incrementally**: start from a baseline graph, then harden it with observability and guardrails as it proves value.

## Why modular workflow design matters in conversational search

Conversational search systems evolve by swapping individual pieces without rewriting everything else: you might replace a retriever while keeping the same generation logic, add reranking only for certain intents, insert safety checks right before the final response, or compare two prompt policies side by side. With a node-based graph, those changes stay local to the relevant nodes and edges, which improves iteration speed and makes experiments easier to reason about.

## Core architectural insights

Orcheo’s design is intentionally simple at the unit level and flexible at the system level. Nodes are single-responsibility components (e.g., intent classification, retrieval, reranking, response formatting). Inputs and outputs are explicit, so interfaces are visible and accidental coupling is harder to introduce. Graphs are composed from reusable building blocks, and node logic stays separate from the orchestration wiring so you can rearrange the workflow topology without rewriting the core component code.

For example, upgrading from keyword-based BM25 retrieval to a hybrid dense + sparse approach with reciprocal rank fusion is a single-node swap: you replace `SparseSearchNode` with `HybridFusionNode`, adjust a few config parameters, and the rest of the workflow — query understanding, reranking, generation, conversation state — stays untouched. No pipeline rewrite, no broken imports, no side effects in unrelated components. Adopters swap a node into an existing workflow with a one-line configuration change.

The code overhead is low: a custom node typically requires only 20–50 lines of Python, and the paper's four-stage grounded generation pipeline (query rewrite, dense retrieval, context compression, cited response generation) is expressed in roughly 50 lines including configuration.

This architecture supports both rapid prototyping and long-term maintenance. Researchers can publish or share specific nodes as single files, while product teams can stabilize and monitor complete workflows.

## Execution and infrastructure insights

A common challenge in this space is the gap between local experiments and production deployment. Orcheo tackles this by standardizing on Docker Compose for both local development and production deployments — same graph, same nodes, no rewrite. In practice, promoting a workflow from your laptop to production becomes mostly a configuration change (secrets, endpoints, scaling knobs), rather than an engineering rewrite. And when you ship updates, you don’t need to reboot servers to deploy changes.

In practice, Orcheo addresses infrastructure concerns that are easy to miss in prototypes but show up quickly in real usage. Credentials for external APIs and vector databases are managed through Orcheo’s built-in credential vault rather than hardcoded values or scattered environment variables. Runtime telemetry tracks latency, failures, and node-level behavior so you can inspect what happened in each turn of a conversation. And operational controls — session limits, caching, guardrails — keep workflows robust under realistic workloads without requiring a separate ops layer. These patterns come from AIC’s experience building and deploying conversational search and knowledge assistant workflows.

## Reproducibility and collaboration insights

Reproducibility is not only about datasets and evaluation scripts; it is also about system behavior. Orcheo helps by making workflow structure and component boundaries explicit and portable.

In practice, this improves experiment traceability (clearer understanding of what changed between runs), team collaboration (cleaner handoffs across contributors working on different nodes), and benchmarking discipline (better isolation of variables in comparative studies).

The paper quantifies the engineering benefit: evaluation workflows that typically require 500–1,000+ lines of manual scripting for data loading, history management, pipeline orchestration, metric computation, and reporting take only 85–150 lines in Orcheo — a 5–10x reduction. This stems from composable metric nodes with a uniform output contract, automatic conversation history threading, and configuration-driven execution that separates model choices from workflow logic.

## Starter-kit components and practical adoption insights

The paper introduces starter-kit assets for common conversational search tasks, so teams can bootstrap quickly instead of rebuilding baseline components from scratch. These include ready-to-use nodes covering the core pipeline from ingestion to response:

- **Query understanding**: query rewriting, coreference resolution, intent classification
- **Retrieval**: dense, sparse, and hybrid search with reciprocal rank fusion
- **Reranking**: pluggable rerankers (e.g., bge-style rerankers)
- **Generation**: grounded response generation with inline/footnote citation formatting
- **Conversation management**: session state, topic shift detection, memory summarization
- **Safety and quality**: hallucination guards, policy compliance checks

In a typical adoption path, you start with a baseline workflow assembled from these reusable nodes, then replace only the parts that need to be task- or domain-specific. As the workflow matures, you layer in observability and guardrails, and evaluate behavior, cost, and latency under realistic workloads rather than purely offline settings.

This path is intended to keep the system evolvable as requirements change.

If you want to see these components in action, [try the interactive conversational search demos](https://orcheo.readthedocs.io/en/latest/examples/conversational_search/) — they walk through progressively more sophisticated workflows, from basic RAG to production-ready pipelines with caching, streaming, and A/B testing.

## Who should read this paper

This paper is most useful if you are:

- Building conversational search prototypes and want a cleaner architecture (without locking yourself into a monolith)
- Running research workflows where modularity and reproducibility are non-negotiable
- Moving from experiments to deployment and need operational basics (secrets, monitoring, reliability) to be first-class
- Exploring how workflow orchestration can tame the complexity of multi-component LLM systems more broadly

If you want the complete technical details (including workflow examples), the paper goes deeper into the workflow design, execution model, and practical starter-kit components.

## What to do next

- **Skim the workflow examples in the paper** and map each node (intent → retrieval → reranking → generation → tool/db access) to the components in your own stack.
- **Try the [conversational search examples and interactive demos](https://orcheo.readthedocs.io/en/latest/examples/conversational_search/)** in the docs.
- **Browse the [Orcheo GitHub repo](https://github.com/ShaojieJiang/orcheo)** to see how nodes and graphs are structured.
- **Start from a baseline graph and iterate surgically**: swap one node at a time, track deltas between runs, and keep the rest of the workflow fixed.
- **Add “production hygiene” early** (secrets, telemetry, latency/cost checks) so your experimental workflow can graduate to reliable execution.
- **Want help applying this to your stack, or want to share what worked (and what didn’t)?** AIC works with teams to design workflows, integrate Orcheo into existing stacks, and operationalize reliable conversational search and other LLM-powered applications — [get in touch](/contact).
