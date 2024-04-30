import { Board, BoardEntity, Column, Subtask, SubtaskEntity, Task, TaskEntity } from '@/domain';
import { LodashAdapter as _ } from '@/config';

export function compareSubtasks(subtasks: Subtask[], subtaskToCompares: Subtask[]): boolean {
	const areNotTheSameLength = !(subtasks.length === subtaskToCompares.length);

	if (areNotTheSameLength) {
		return false;
	}
	for (const subtask of subtasks) {
		const subTaskToCompare = subtaskToCompares.find((subtaskToCompare) => subtaskToCompare.id === subtask.id);

		if (!subTaskToCompare) {
			return false;
		}

		const areNotEqual = !_.areEquals(subtask, subTaskToCompare);

		if (areNotEqual) {
			return false;
		}
	}

	return true;
}
export function compareTasks(tasks: Task[], tasksToCompare: Task[]) {
	const areNotTheSameLength = !(tasks.length === tasksToCompare.length);

	if (areNotTheSameLength) {
		return false;
	}
	for (const task of tasks) {
		const taskToCompare = tasksToCompare.find((taskToCompare) => taskToCompare.id === task.id);

		if (!taskToCompare) {
			return false;
		}

		const areNotEqual = !_.areEquals(task, taskToCompare);

		if (areNotEqual) {
			return false;
		}
	}
	return true;
}
export function compareBoardUsers(users: string[], usersToCompare: string[]) {
	const areNotTheSameLength = !(users.length === usersToCompare.length);

	if (areNotTheSameLength) {
		return false;
	}

	for (const user of users) {
		const userToCompare = usersToCompare.find((userToCompare) => userToCompare === user);

		if (!userToCompare) {
			return false;
		}

		const areNotEqual = user !== userToCompare;

		if (areNotEqual) {
			return false;
		}
	}

	return true;
}
export function compareBoards(board: Board, boardToCompare: { [key: string]: any }[]) {
	try {
		const boardToCompareEntity = BoardEntity.fromObject(boardToCompare);

		if (boardToCompareEntity.id !== board.id) return false;
		if (boardToCompareEntity.name !== board.name) return false;
		if (boardToCompareEntity.admin !== board.admin) return false;
		if (boardToCompareEntity.shared !== board.shared) return false;

		const users = board.users;
		const usersToCompare = boardToCompareEntity.users;
		if (!compareBoardUsers(users, usersToCompare)) return false;

		//Subtasks
		const subtasks: Subtask[] = [];
		const subtasksToCompare: Subtask[] = [];

		board.columns.forEach((column: any) => {
			const subtasksEntity = getAllSubtasksFromTasks(column.tasks);
			subtasks.push(...subtasksEntity);
		});
		boardToCompareEntity.columns.forEach((column: any) => {
			const subtasksEntity = getAllSubtasksFromTasks(column.tasks);
			subtasksToCompare.push(...subtasksEntity);
		});

		const subTasksAreNotEqual = !compareSubtasks(subtasks, subtasksToCompare);

		if (subTasksAreNotEqual) {
			return false;
		}

		//Tasks
		const tasks: Task[] = getAllTasksFromColumns(board.columns);
		const tasksToCompare: Task[] = getAllTasksFromColumns(boardToCompareEntity.columns);
		const tasksAreNotEqual = !compareTasks(tasks, tasksToCompare);

		if (tasksAreNotEqual) {
			return false;
		}

		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}
export function getAllSubtasksFromTasks(tasks: Task[]): Subtask[] {
	const subtasks: Subtask[] = [];

	tasks.forEach((task) => {
		subtasks.push(...task.subtasks);
	});
	return SubtaskEntity.fromArray(subtasks);
}
export function getAllTasksFromColumns(columns: Column[]) {
	const tasks: Task[] = [];

	columns.forEach((column) => {
		tasks.push(...column.tasks);
	});

	return TaskEntity.fromArray(tasks);
}
