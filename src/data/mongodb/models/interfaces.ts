import { Types } from 'mongoose';
import { User, Board } from '@/domain';

//*Board
export interface SubtaskSchema {
	title: string;
	isCompleted: boolean;
}

export interface TaskSchema {
	title: string;
	description: string;
	subtasks: Types.DocumentArray<SubtaskSchema>;
	users: Types.ObjectId | User[];
	status: string;
}

export interface ColumnSchema {
	name: string;
	tasks: Types.DocumentArray<TaskSchema>;
}
export interface BoardSchema {
	name: string;
	columns: Types.DocumentArray<ColumnSchema>;
	users: Types.ObjectId[] | User[];
	admin: Types.ObjectId | User;
}

//*User
export interface UserSchema {
	name: string;
	lastname: string;
	email: string;
	password: string;
	boards: Types.ObjectId[] | Board[];
}
