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
export interface IUpdateBoard {
	id: string | number;
	name?: string;
	columns?: Column[];
	shared?: boolean;
	users?: string[];
	admin?: string;
}
