import { Column } from '@/domain';
//Auth
export interface IRegisterUserDto {
	name: string;
	lastname: string;
	email: string;
	password: string;
}
export interface ILoginDto {
	email: string;
	password: string;
}
//Board
export interface IRegisterBoardDto {
	name: string;
	admin: string;
}
export interface IDeleteBoardDto {
	boardId: string | number;
}
export interface IUpdateBoardDto {
	id: string | number;
	name?: string;
	columns?: Column[];
	shared?: boolean;
	users?: string[];
	admin?: string;
}

//Task
export interface ICreateTaskDto {
	boardId: string | number;
	userId: string | number;
	task: {
		title: string;
		description: string;
		subtasks: ICreateSubtaskDto[];
		users: string[];
		status: string;
	};
}
export interface IDeleteTaskDto {
	userId: string | number;
	boardId: string | number;
	taskId: string | number;
}
export interface IUpdateTaskDto {
	boardId: string;
	userId: string | number;
	task: {
		id: string;
		title?: string;
		description?: string;
		users?: string[];
		status?: string;
		subtasks?: (IFullSubtask | Partial<IFullSubtask>)[];
	};
}

//Subtask
export interface IFullSubtask {
	id: string | number;
	title?: string;
	isCompleted?: boolean;
}
export interface ICreateSubtaskDto {
	title: string;
	isCompleted: boolean;
}
export interface IUpdateSubtaskDto {
	boardId: string | number;
	subtask: IFullSubtask | Partial<IFullSubtask>;
}
