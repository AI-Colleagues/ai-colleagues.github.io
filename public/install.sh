#!/usr/bin/env sh
set -eu

if ! command -v uv >/dev/null 2>&1; then
  echo "uv not found. Installing uv..."
  curl -LsSf https://astral.sh/uv/install.sh | sh
fi

export PATH="$HOME/.local/bin:$PATH"

if [ -n "${ORCHEO_STACK_ASSET_BASE_URL:-}" ]; then
  export ORCHEO_STACK_ASSET_BASE_URL
fi

uv tool install -U orcheo-sdk, skill-mgr

if [ "$#" -gt 0 ]; then
  exec orcheo install "$@"
fi

if [ -n "${ORCHEO_INSTALL_ARGS:-}" ]; then
  # Match install.ps1 behavior: split env var by whitespace into args.
  # shellcheck disable=SC2086
  exec orcheo install $ORCHEO_INSTALL_ARGS
fi

exec orcheo install
