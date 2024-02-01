export type MenuItemChildProps = {
  children?: MenuItemChildrenProps;
  href: string;
  level: number;
  title: string;
};

export type MenuItemChildrenProps = MenuItemChildProps[];

export type VisibleListItem = {
  childrenCount: number;
  hasChildren: boolean;
  hasParentList: boolean;
  parentTitle: string;
  title: string;
};

export type VisibleListItemData = VisibleListItem[];
