export type ProjectItem = {
  id: number;
  name: string;
  createdAt: Date;
  updateAt?: Date;
};

export type getProjectListService = {
  search: string;
};
