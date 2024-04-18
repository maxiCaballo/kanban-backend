import { Task, Column, TaskEntity } from '@/domain';

export class ColumnEntity implements Column {
	constructor(public id: string, public name: string, public tasks: Task[]) {}

	//Mapper
	static fromObject(object: { [key: string]: any }) {
		const { id, _id, name, tasks = [] } = object;

		if (!id && !_id) throw new Error('ColumnEntity.fromObject() => Missing id || _id');
		if (!name) throw new Error('ColumnEntity.fromObject() => Missing name');

		let tasksEntity: Task[] = [];

		if (tasks.length > 0) {
			tasksEntity = TaskEntity.fromArray(tasks);
		}

		return new ColumnEntity(id || _id, name, tasksEntity);
	}

	static fromArray(array: { [key: string]: any }[]): ColumnEntity[] {
		try {
			const columnsFromArray = array.map((column) => ColumnEntity.fromObject(column));
			return columnsFromArray;
		} catch (error) {
			throw error;
		}
	}
}
