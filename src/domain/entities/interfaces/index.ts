import { type ObjectId } from 'mongoose';

export interface User {
	id: string;
	email: string;
	name: string;
	lastname: string;
	password: string;
	boards: string[];
}

export interface Board {
	id: string;
	name: string;
	columns: Column[];
	shared: boolean;
	users: string[];
	admin: string;
	getColumnsNames: () => string[];
	getColumnById: (columnId: string) => Column | undefined;
	getTaskById: (taskId: string) => Task | undefined;
}

export interface Column {
	id: string;
	name: string;
	tasks: Task[];
}

export interface Task {
	id: string;
	title: string;
	description: string;
	subtasks: Subtask[];
	users: string[];
	status: string;
}

export interface Subtask {
	id: string;
	title: string;
	isCompleted: boolean;
}
