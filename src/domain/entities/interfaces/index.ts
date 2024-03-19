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
	column: Column[];
	shared: boolean;
	user: User[];
	admin: User;
}

export interface Column {
	id: string;
	name: string;
	task: Task[];
}

export interface Task {
	id: string;
	title: string;
	description: string;
	subtask: Subtask[];
	users: User[];
}

export interface Subtask {
	id: string;
	name: string;
	isDone: boolean;
}
