# Architecture

## Business Architecture

router
↓
pages
↓
features
↓
domains

Business dependencies should always flow downward.

---

# Directory Responsibilities

router/

- route registration
- route configuration
- lazy loading

pages/

- route entry components
- page composition
- orchestration

features/

- business workflows
- workflow UI

domains/

- reusable business resources

components/

- reusable UI components

hooks/

- reusable hooks

utils/

- pure utility functions

---

# Dependency Rules

Allowed

pages → features
pages → domains

features → domains

pages/features/domains
→ components
→ hooks
→ utils

Forbidden

domains → features
domains → pages

features → pages

---

# Principles

Domain = Resource

Feature = Workflow

Components are pure UI.

Business dependencies must always flow downward.
