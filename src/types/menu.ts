type MenuDTO = {
  id: number;
  title: string;
  name: string;
  path: string;
  hidden: boolean;
  isAuth: boolean;
  icon: string;
  view: string;
  children: MenuDTO[];
  sort?: number;
};

export type Menu = MenuDTO;
