import { ProjectType } from 'domain/project-type';

export type Project = {
  id: number;
  name: string;
  description: string;
  token: string;
  type: ProjectType;
};
