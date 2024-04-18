import { Task, Subtask, SubtaskEntity } from '@/domain';

export class TaskEntity implements Task {
	constructor(
		public id: string,
		public title: string,
		public description: string,
		public subtasks: Subtask[],
		public users: string[],
		public status: string,
	) {}

	//Mapper
	static fromObject(object: { [key: string]: any }) {
		const { id, _id, title, description = '', subtasks = [], users = [], status } = object;

		if (!id && !_id) throw new Error('TaskEntity.fromObject() => Missing id || _id');
		if (!title) throw new Error('TaskEntity.fromObject() => Missing title');
		if (!status) throw new Error('TaskEntity.fromObject() => Missing status');

		let subtasksEntity: Subtask[] = [];

		if (subtasks.length > 0) {
			subtasksEntity = SubtaskEntity.fromArray(subtasks);
		}

		return new TaskEntity(id || _id, title, description, subtasksEntity, users, status);
	}

	static fromArray(array: { [key: string]: any }[]): TaskEntity[] {
		try {
			const tasksFromArray = array.map((task) => TaskEntity.fromObject(task));
			return tasksFromArray;
		} catch (error) {
			throw error;
		}
	}
}
