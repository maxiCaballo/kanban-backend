export interface User {
	id: string;
	email: string;
	name: string;
	lastName: string;
	password: string;
	boards: string[];
}

export interface Board {
	id: string;
	name: string;
	columns: Column[];
	shared: boolean;
	users: User[];
	admin: User;
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
	users: User[];
}

export interface Subtask {
	id: string;
	name: string;
	isDone: boolean;
}
