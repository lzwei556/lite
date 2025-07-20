import { ToSnake } from 'ts-case-convert';

type ToLabel<P> = P extends `${infer First}_${infer Rest}` ? `${First}.${ToLabel<Rest>}` : P;

type Name<Entity extends Object> = keyof Entity;
type Label<Entity extends Object> = ToLabel<Lowercase<ToSnake<Name<Entity>>>>;

export type Field<Entity extends Object> = {
  name: Name<Entity>;
  label: Label<Entity>;
  description: `${Label<Entity>}.desc`;
};
