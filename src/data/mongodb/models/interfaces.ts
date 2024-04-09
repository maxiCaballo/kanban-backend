import { HydratedDocument, Model, Types } from 'mongoose';
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

//Instance methods
export interface BoardInstanceMethods {}
//Static methods
export interface BoardStaticMethods extends Model<BoardSchema, {}, BoardInstanceMethods> {
	// getAdmin(boardId: string): Promise<HydratedDocument<BoardSchema, BoardInstanceMethods>>;
}

//*User
export interface UserSchema {
	name: string;
	lastname: string;
	email: string;
	password: string;
	boards: Types.ObjectId[] | Board[];
}
