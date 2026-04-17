import { Enum } from "./project-type";

export type Project = {
  id: number;
  name: string;
  description: string;
  token: string;
  type: Enum;
};
