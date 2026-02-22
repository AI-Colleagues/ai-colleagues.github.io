#!/usr/bin/env sh
set -eu

# On Linux, Docker requires the current user to be in the "docker" group.
if [ "$(uname)" = "Linux" ] && ! id -nG | grep -qw docker; then
  echo "Your user is not in the 'docker' group, which is required to run Docker."
  echo ""
  echo "Run the following commands, then re-run this install command:"
  echo ""
  echo "  sudo usermod -aG docker \$USER"
  echo "  newgrp docker"
  echo ""
  exit 1
fi

if ! command -v uv >/dev/null 2>&1; then
  echo "uv not found. Installing uv..."
  curl -LsSf https://astral.sh/uv/install.sh | sh
  export PATH="$HOME/.local/bin:$PATH"
fi

if [ -n "${ORCHEO_STACK_ASSET_BASE_URL:-}" ]; then
  export ORCHEO_STACK_ASSET_BASE_URL
fi

uv tool install -U orcheo-sdk

if [ "$#" -gt 0 ]; then
  exec orcheo install "$@"
fi

if [ -n "${ORCHEO_INSTALL_ARGS:-}" ]; then
  # Match install.ps1 behavior: split env var by whitespace into args.
  # shellcheck disable=SC2086
  exec orcheo install $ORCHEO_INSTALL_ARGS
fi

exec orcheo install
