export interface ITask {
  id: string;
  title: string;
  assignee: string;
  description: string;
}

export interface IBoard {
  id: string;
  tasks: ITask[];
}

export interface IUser {
  userInfo: object;
  boards: IBoard[];
}
