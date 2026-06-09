# Styling Rules

Use:

```ts
antd - style;
```

for all component styling.

Good:

```ts
const useStyles = createStyles(...)
```

---

Never import:

```ts
import './index.css';
import './index.less';
import './index.scss';
```

CSS files are forbidden.

---

Keep styles colocated with components.

Example:

```text
UserTable/
├── index.tsx
└── styles.ts
```
