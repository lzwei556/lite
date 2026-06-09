# Domain Rules

## Purpose

A domain represents a reusable business resource.

Examples:

```text
domains/project
domains/user
domains/role
domains/alarm-level
```

Domain = Resource.

Domains are the source of truth for a business resource.

---

# Structure

## Small Domains

When complexity is low, prefer a single file.

Example:

```text
domains/

├── project.ts
├── user.ts
└── role.ts
```

A single file may contain:

- APIs
- Types
- Schemas
- Fields
- Enums
- Transforms

when the overall size remains manageable.

---

## Large Domains

When complexity grows, split by responsibility.

Example:

```text
domains/project/

├── api.ts
├── schema.ts
├── fields.ts
├── transforms.ts
├── components/
│   ├── status-tag.tsx
│   └── status-select.tsx
└── index.ts
```

Split when:

- many API functions
- multiple schemas
- complex transforms
- reusable resource UI
- large type definitions

---

# API Rules

## Standard CRUD Naming

Prefer standard CRUD names.

Good:

```ts
get;
getList;

create;
update;
deleteOne;
```

Additional actions should use clear verbs.

Examples:

```ts
assignUsers;
generateToken;
enable;
disable;
publish;
```

Avoid unnecessary resource prefixes inside the same domain.

Good:

```ts
create;
update;
deleteOne;
```

Bad:

```ts
createProject;
updateProject;
deleteProject;
```

---

## Parameters

API functions should receive a single object parameter.

Good:

```ts
create({
  name,
  description
});
```

Good:

```ts
update({
  id,
  name
});
```

Avoid:

```ts
create(name, description);
```

Avoid:

```ts
update(id, name);
```

---

## Pagination Request Types

Pagination request types must extend:

```ts
PageParameter;
```

Good:

```ts
type GetProjectsParams = PageParameter & {
  keyword?: string;
};
```

---

## Pagination Response Types

Paginated APIs must return:

```ts
PageResult<T>;
```

Good:

```ts
Promise<PageResult<Project>>;
```

Non-paginated APIs should return the actual resource type.

---

# Schema Rules

Schemas belong to domains.

Examples:

```ts
projectQuerySchema;

projectFormSchema;
```

Avoid defining reusable resource schemas inside:

```text
pages/
features/
```

unless they are workflow-specific.

---

# Field Rules

Field definitions belong to domains.

Good:

```ts
export const Fields = {
  Name: {
    name: 'name',
    label: 'PROJECT_NAME'
  },

  Description: {
    name: 'description',
    label: 'DESCRIPTION'
  }
};
```

Pages should consume field definitions rather than redefine them.

Good:

```tsx
columns={[
  Fields.Name,
  Fields.Description
]}
```

Avoid duplicating field metadata when a field definition already exists.

---

# Transform Rules

Reusable business transforms belong to domains.

Examples:

```ts
toOptions();

toTreeData();

toMap();
```

Avoid placing reusable transforms inside:

```text
pages/
features/
```

---

# Enum Rules

Business enums and related metadata belong to domains.

Examples:

```ts
ProjectStatus;

AlarmLevel;
```

Related metadata should be colocated.

Examples:

```ts
labels;

colors;

options;
```

Good:

```text
domains/alarm-level/

config.ts
```

contains:

- enum values
- labels
- colors
- options

---

# Resource UI Rules

Domains may contain UI when the UI represents a reusable business resource.

Good:

```tsx
<AlarmLevelTag />
```

Good:

```tsx
<ProjectStatusTag />
```

The UI should be reusable across multiple features.

---

## Resource UI Placement

Resource UI should be colocated with the resource it represents.

Good:

```text
domains/alarm-level/

├── config.ts
├── tag.tsx
└── select.tsx
```

---

## Resource UI Constraints

Domain UI should:

- represent a resource
- be reusable
- be workflow agnostic

Good:

```tsx
<AlarmLevelTag />
```

Good:

```tsx
<RoleTag />
```

Good:

```tsx
<ProjectStatusSelect />
```

Bad:

```tsx
<CreateProjectModal />
```

Bad:

```tsx
<AssignUsersDrawer />
```

Bad:

```tsx
<TokenModal />
```

Workflow-specific UI belongs to features.

---
