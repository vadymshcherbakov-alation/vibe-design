# Design Playground

## Getting started

```sh
git clone https://github.com/Alation/design-playground.git
cd design-playground
pnpm install
pnpm dev
```

## Project structure

This is a monorepo managed by [Turborepo](https://turborepo.dev/) and [pnpm workspaces](https://pnpm.io/workspaces).

```
apps/
  alation-base-ui/   # Core project — start here
packages/
  ui/                # Shared component library
  eslint-config/     # Shared ESLint config
  typescript-config/ # Shared TypeScript config
```

### `alation-base-ui`

This is the core project where the main design work happens. If you're contributing to the shared design system, this is where you should be working.

### Creating your own project

You can create your own app under `apps/` to experiment independently. It will be automatically picked up by the workspace. For example:

```sh
mkdir apps/my-project
cd apps/my-project
pnpm init
```

From there, set up your app however you like. You can import shared packages (e.g. `@repo/ui`) just like `alation-base-ui` does.
