import { Board, Column, ColumnEntity, Subtask, Task, TaskEntity, UserEntity } from '@/domain';
import { LodashAdapter as _ } from '@/config';

export class BoardEntity implements Board {
	private constructor(
		public id: string,
		public name: string,
		public columns: Column[],
		public shared: boolean,
		public users: string[],
		public admin: string,
	) {}

	//Mapper
	static fromObject(object: { [key: string]: any }) {
		const { id, _id, name, columns = [], shared = false, admin } = object;

		if (!id && !_id) throw new Error('BoardEntity.fromObject() => Missing id || _id');
		if (!name) throw new Error('BoardEntity.fromObject() => Missing board name');
		if (!admin) throw new Error('BoardEntity.fromObject() => Missing admin id');

		let { users = [] } = object;
		if (users.length > 0) {
			users = UserEntity.fromObject(users, { returnUsersAsStringIds: true });
		}

		let columnsEntity: Column[] = [];

		if (columns.length > 0) columnsEntity = ColumnEntity.fromArray(columns);

		return new BoardEntity(id || _id, name, columnsEntity, shared, users, String(admin));
	}

	static isMemberOrAdminByUserId(board: BoardEntity, userId: string | number): { isAdmin: boolean; isMember: boolean } {
		const isMember = Boolean(board.users.find((user) => user === userId));
		const isAdmin = board.admin === userId;

		return {
			isAdmin,
			isMember,
		};
	}

	static getSubtaskById(board: BoardEntity, subtaskId: Subtask['id']): Subtask | undefined {
		for (const column of board.columns) {
			for (const task of column.tasks) {
				const subtask = task.subtasks.find((subtask) => subtask.id === subtaskId);
				if (subtask) {
					return subtask;
				}
			}
		}
		return undefined;
	}
	static getUsersTaskBySubtask(board: BoardEntity, subtaskId: string | number): string[] | undefined {
		for (const column of board.columns) {
			for (const task of column.tasks) {
				const subtask = task.subtasks.find((subtask) => subtask.id === subtaskId);
				if (subtask) {
					return task.users;
				}
			}
		}

		return undefined;
	}
}
