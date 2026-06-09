# State Rules

## Fetch State

Use:

- useDataFetch
- useResourceList
- useSimpleList

for server data fetching.

Avoid:

```ts
useEffect(...)
```

with manual request handling.

---

## Query State

Use:

```ts
useResourceQuery;
```

for query state management.

Avoid:

```ts
const [filters, setFilters] = useState(...)
```

when ResourceQuery is available.

---

## Modal State

Use:

```ts
useActionController;
```

for modal control.

Avoid local open state management.

---
