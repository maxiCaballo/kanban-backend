import { Subtask } from '@/domain';

export class SubtaskEntity implements Subtask {
	constructor(public id: string, public title: string, public isCompleted: boolean) {}

	//Mapper
	static fromObject(object: { [key: string]: any }) {
		const { id, _id, title, isCompleted = false } = object;

		if (!id && !_id) throw new Error('SubtaskEntity.fromObject() => Missing id || _id');
		if (!title) throw new Error('SubtaskEntity.fromObject() => Missing title');

		return new SubtaskEntity(id || _id, title, isCompleted);
	}

	static fromArray(array: { [key: string]: any }[]): SubtaskEntity[] {
		try {
			const subtastksFromArray = array.map((subtask) => SubtaskEntity.fromObject(subtask));
			return subtastksFromArray;
		} catch (error) {
			throw error;
		}
	}
}
