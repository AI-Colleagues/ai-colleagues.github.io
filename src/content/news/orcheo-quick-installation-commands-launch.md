---
title: "Orcheo Quick Installation Commands Are Now Live"
summary: "We launched quick installation commands for macOS, Linux, and Windows, plus SDK install and upgrade paths so teams can start using Orcheo in minutes."
pubDate: 2026-02-22
author: Orcheo Team
category: Product
tags:
  - orcheo
  - installation
  - release
  - sdk
---

We've launched a new **quick installation flow** for Orcheo to make first-time setup faster on major platforms.

You can now install Orcheo with a single command for each platform:

```bash
# macOS
bash <(curl -fsSL https://ai-colleagues.com/install.sh)
```

```bash
# Linux
curl -fsSL https://ai-colleagues.com/install.sh | sh
```

```powershell
# Windows (PowerShell)
irm https://ai-colleagues.com/install.ps1 | iex
```

For SDK-based workflows, run:

```bash
uv tool install -U orcheo-sdk
orcheo install
```

To upgrade an existing installation:

```bash
orcheo install upgrade --yes
```

These commands are designed to help you go from zero to a working Orcheo environment with minimal manual setup.

If you run into any problems during installation or upgrade, please report them [here](https://github.com/ShaojieJiang/orcheo/issues).
