# Modal Rules

## Modal Props

All modal components must extend:

```ts
ActionModalContext;
```

Good:

```ts
type UserModalProps = ActionModalContext<User>;
```

or

```ts
type UserModalProps = ActionModalContext<User> & {
  readonly?: boolean;
};
```

---

## Modal State

Modal visibility must be controlled through:

```ts
useActionController;
```

Avoid:

```ts
const [open, setOpen] = useState(false);
```

---

## Modal Submit

Submit handlers should follow:

```ts
() => form.validateFields().then(createSubmitHandler(submit, close));
```

Avoid custom validation pipelines.

---
