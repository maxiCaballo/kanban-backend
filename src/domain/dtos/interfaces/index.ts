import { Column, Subtask } from '@/domain';
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
export interface IUpdateSubtaskDto {
	boardId: string | number;
	subtask: {
		id: string | number;
		title?: string;
		isCompleted?: boolean;
	};
}

export interface ICreateTaskDto {
	title: string;
	description: string;
	subtasks: ICreateSubtaskDto[];
	users: string[];
	status: string;
}
export interface ICreateSubtaskDto {
	title: string;
	isCompleted: boolean;
}
