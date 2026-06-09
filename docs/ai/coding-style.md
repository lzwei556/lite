# Coding Style

## Principles

Prefer consistency over personal preference.

Prefer simplicity over premature abstraction.

Prefer explicitness over magic.

Follow existing patterns before introducing new ones.

Choose the simplest implementation that satisfies the requirements.

---

# Type Rules

## Type Alias Only

Always use:

```ts
type Project = {
  id: string;
  name: string;
};
```

Never use:

```ts
interface Project {
  id: string;
  name: string;
}
```

---

# Export Rules

## Export Only Reusable Symbols

Export symbols only when reused outside the current file.

Good:

```ts
export type Project = {
  id: string;
  name: string;
};
```

when used externally.

Good:

```ts
type FormValues = {
  name: string;
};
```

when used only locally.

Avoid exporting implementation details.

---

## Named Exports

Use named exports by default.

Good:

```ts
export const Fun = () => {
  ...
};
```

Avoid:

```ts
function Fun() {
  ...
}
export default Fun;
```

Route entry components are the only exception.

---

# Declaration Rules

## Functions

Use arrow functions by default.

Good:

```ts
const submit = () => {
  ...
};
```

Good:

```ts
export const create = async (
  params: CreateProjectParams
) => {
  ...
};
```

Avoid:

```ts
function submit() {
  ...
}
```

Route entry components are the only exception.

---

# React Rules

## Do Not Use FC

Always use:

```tsx
const UserTable = () => {
  return <Table />;
};
```

Never use:

```tsx
const UserTable: FC = () => {
  return <Table />;
};
```

---

## Inline Props

If props are only used by the current component, define them inline.

Good:

```tsx
const UserTable = ({
  users,
  loading
}: {
  users: User[];
  loading: boolean;
}) => {
  ...
};
```

Avoid:

```tsx
type UserTableProps = {
  users: User[];
  loading: boolean;
};

const UserTable = (
  props: UserTableProps
) => {
  ...
};
```

when the props type is not reused.

---

## Shared Props

If props are reused by multiple components, extract them.

Good:

```tsx
export type UserFormProps = {
  user?: User;
  readonly?: boolean;
};
```

---

# Import Rules

## Public Entry Points

Prefer public entry points.

Good:

```ts
import { create, update, deleteOne } from 'domains/project';
```

Avoid:

```ts
import { create } from 'domains/project/api';
```

Consumers should depend on public APIs rather than internal file structure.

---

## Path Aliases

Prefer project aliases.

Good:

```ts
import { create } from 'domains/project';

import { CreateFormModal } from 'features/project-management';

import { ResourceTable } from 'components';
```

Avoid:

```ts
import { create } from '../../../domains/project';

import { ResourceTable } from '../../../../components';
```

---

# File Organization

## Prefer Simplicity

Choose the simplest structure that fits the complexity.

Prefer:

```text
project.ts
```

before:

```text
project/

├── api.ts
├── schema.ts
├── fields.ts
├── transforms.ts
└── index.ts
```

---

## Split Only When Necessary

Start with a single file.

Split only when complexity justifies it.

Do not introduce additional files or directories without a clear benefit.

---
