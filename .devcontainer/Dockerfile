# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.236.0/containers/typescript-node/.devcontainer/base.Dockerfile

# [Choice] Node.js version (use -bullseye variants on local arm64/Apple Silicon): 18, 16, 14, 18-bullseye, 16-bullseye, 14-bullseye, 18-buster, 16-buster, 14-buster
ARG VARIANT="18-buster"
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:${VARIANT}

# [configuration]
ARG ANCHOR_CLI="latest"
ARG SOLANA_CLI="1.10.26"
ARG NODE_VERSION=18

ENV PATH="/home/node/.local/share/solana/install/active_release/bin:${PATH}"
ENV PATH="/home/node/.cargo/bin:${PATH}"

# [packages:linux]
RUN apt-get update \
    && apt-get -y install --no-install-recommends \
    gcc \
    g++ \
    pkg-config \
    libudev-dev \
    libssl-dev \
    make \
    build-essential \
    libclang-dev \
    llvm

# [optional:core:nvm]
RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${NODE_VERSION}"

# [packages:npm] Uncomment if you want to install more global node packages
RUN su node -c "npm install -g typescript@next pnpm yarn @project-serum/anchor@${ANCHOR_CLI}"

# [feature:rust]
RUN su node -c "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y && rustup --version && cargo --version && rustc --version"

# [feature:solana]
RUN su node -c 'sh -c "$(curl -sSfL https://release.solana.com/v${SOLANA_CLI}/install)" && solana --version'

# [feature:anchor]
RUN su node -c 'cargo install --git https://github.com/project-serum/anchor avm --locked --force && avm install ${ANCHOR_CLI} && avm use ${ANCHOR_CLI} && anchor --version'

# [anchor:cache] 
# Build a dummy program to bootstrap the BPF SDK (doing this speeds up builds).
RUN su node -c 'mkdir -p /tmp && cd tmp && anchor init dummy && cd dummy && anchor build'