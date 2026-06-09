# Page Rules

## Route Entry Components

A route entry component is a component rendered directly by React Router.

Examples:

```text
pages/user/index.tsx
pages/user/list/index.tsx
```

---

### Location

Route entry components must be located under:

```text
pages/<feature>/
```

---

### Declaration Style

Use function declaration.

Good:

```ts
export default function UserPage() {
  return null;
}
```

Bad:

```ts
export const UserPage = () => {
  return null;
};
```

---

### Export Style

Use default export.

Good:

```ts
export default function UserPage() {
  return null;
}
```

---

## Business Components

Separate page logic from presentation logic.

Page:

* compose features
* coordinate hooks

Component:

* render UI

Avoid placing all business logic directly inside page components.
