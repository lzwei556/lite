# ResourceTable Rules

## Purpose

`ResourceTable` is the standard component for CRUD pages.

Use `ResourceTable` when:

* displaying resource lists
* supporting create/update/delete operations
* integrating with ActionController
* integrating with modal or drawer actions

Prefer `ResourceTable` over `Table` whenever the page contains resource actions.

---

# List Integration

## List Source

ResourceTable should be connected to a list hook.

Good:

```tsx
<ResourceTable
  list={list}
/>
```

where:

```ts
const list = useResourceList(...);
```

or

```ts
const list = useSimpleList(...);
```

Avoid manually managing table data.

---

## Refresh

Mutations should refresh the list through:

```ts
list.refresh()
```

Example:

```ts
create: {
  onSuccess: list.refresh
}
```

```ts
update: {
  onSuccess: list.refresh
}
```

---

# Action Controller

## CRUD Operations

Standard CRUD APIs should be registered through:

```tsx
actionController={{
  api: {
    create,
    update,
    delete: deleteOne
  }
}}
```

Naming should follow domain API conventions.

Good:

```ts
create
update
deleteOne
```

Avoid:

```ts
saveProject
removeProject
```

unless required by backend semantics.

---

# Standard CRUD Actions

The following actions are considered built-in actions:

* create
* update
* delete

ResourceTable already provides default behavior for:

* position
* render
* state

Do not configure them unless customization is required.

Good:

```tsx
actions: {
  create: {
    modal: (ctx) => (
      <CreateFormModal {...ctx} />
    ),
    onSuccess: list.refresh
  }
}
```

Bad:

```tsx
actions: {
  create: {
    position: 'toolbar',
    render: (...),
    state: ...
  }
}
```

when the behavior matches framework defaults.

---

# Convention Over Configuration

Prefer framework conventions over explicit configuration.

If ResourceTable already provides:

* default action position
* default action renderer
* default action state

do not redefine them.

Only configure behavior that differs from the framework default.

---

# Custom Actions

Any action other than:

* create
* update
* delete

is considered a custom action.

Examples:

```text
assign
generateToken
enable
disable
publish
archive
resetPassword
```

Custom actions may define:

* position
* render
* state
* modal

according to business requirements.

Example:

```tsx
generateToken: {
  position: 'row',

  modal: (ctx) => (
    <TokenModal {...ctx} />
  ),

  render: ({ record }) => (
    ...
  )
}
```

---

# Position Rules

## Standard CRUD

Do not specify position for:

* create
* update
* delete

ResourceTable provides default positions.

---

## Custom Actions

Specify position only when required.

Examples:

```tsx
position: 'row'
```

```tsx
position: 'toolbar'
```

---

# Render Rules

## Standard CRUD

Do not implement custom render functions for:

* create
* update
* delete

unless business behavior differs from framework defaults.

---

## Custom Actions

Custom actions may provide render functions.

Example:

```tsx
render: ({ record, open }) => (
  <Link
    onClick={() =>
      open('assign', record)
    }
  >
    Assign Users
  </Link>
)
```

---

# State Rules

## Standard CRUD

Do not manually configure action state for:

* create
* update
* delete

ResourceTable manages standard CRUD state automatically.

---

## Custom Actions

Use explicit state only when the action performs additional requests.

Good:

```tsx
assign: {
  state: createActionState(
    useDataFetch(assignUsers, {
      manual: true
    })
  )
}
```

---

# Modal Integration

Modal actions should use:

```ts
ActionModalContext
```

Modal components should follow modal rules defined in:

```text
modal.md
```

Good:

```tsx
modal: (ctx) => (
  <CreateFormModal {...ctx} />
)
```

---

# Permission Rules

Action permissions should be defined through:

```ts
useCan(...)
```

Good:

```tsx
create: {
  can: useCan(
    Permission.ProjectAdd
  )
}
```

Avoid embedding permission logic inside render functions.

---

# Column Rules

Prefer domain field metadata when constructing columns.

Good:

```tsx
columns={[
  Fields.Name,
  Fields.Description,
  Fields.TypeText
].map(field => ({
  dataIndex: field.name,
  title: intl.get(field.label)
}))}
```

Avoid duplicating field definitions inside pages.

---

# Page Responsibility

Page components should configure:

* columns
* actions
* permissions
* list source

ResourceTable should handle:

* action state
* action rendering
* CRUD orchestration

Avoid reimplementing framework behavior inside pages.
