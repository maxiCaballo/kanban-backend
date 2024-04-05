import { CustomError } from '@/domain/error/custom-error.error';
import { DeleteBoardDto } from '../board/delete-board.dto';

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
