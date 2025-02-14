export interface ITask {
  id: string;
  title: string;
  assignee: string;
  description: string;
  createdAt: string;
}

export interface IBoard {
  id: string;
  tasks: ITask[];
}

export interface IUser {
  userInfo: object;
  boards: IBoard[];
}

export interface IUserInfo {
  id: number;
  login: string;
  name: string;
  surname: string;
  middleName: string;
}

export interface ApiError {
  status: string;
  originalStatus: number;
  data: string;
  error: string;
}

export interface IDateFilter {
  from?: string | null;
  to?: string | null;
}
