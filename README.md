# Chainized

Previously this repository was dedicated only to `solana` learning and development, I've choosen monorepository idea because it's way more efficient to work especially when you're going to build additional packages for API or front-end.

## Getting Started

> I was trying to keep things as simple as it's possible.

### Prerequisites

- `node@18.4.0`
- `pnpm@7.3.0`
- `rustc@1.61.0`
- `cargo@1.61.0`
- `anchor-cli@0.24.2`
- `solana-cli@1.10.26`

### Installation

The installation process is trival, once you have installed `rust`, `anchor` and `solana` on your machine. Due to repository specification you must setup `.env` before project installation `NODE_ENV="development"` is enough because we have development defaults. In case you're willing to use `docker` for development you're suppsed to override default variables which are focused on using testnets.

```
$ pnpm install
```

In case you're preparing code for production you build project using follwoing script.

```
$ pnpm run build
```

### Usage

## Contributing

```js
private youDoNot(contribute: any)
```
