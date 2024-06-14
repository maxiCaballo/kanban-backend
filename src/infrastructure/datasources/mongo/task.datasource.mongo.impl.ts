import { BoardModel, MongoDb } from '@/data';
import { LodashAdapter as _ } from '@/config';
import { ColumnEntity, CreateTaskDto, CustomError, Task, TaskDatasource, UpdateTaskDto, BoardEntity } from '@/domain';
import { BoardDatasourceMongoImpl } from '@/infrastructure';

export class TaskDatasourceMongoImpl implements TaskDatasource {
	constructor(private readonly boardDatasourceMongoImpl: BoardDatasourceMongoImpl) {}

	async createTask(createTaskDto: CreateTaskDto): Promise<Task[]> {
		const { boardId } = createTaskDto;

		const isValidMongoId = MongoDb.isValidMongoId(boardId);
		if (!isValidMongoId) {
			throw CustomError.badRequest('Invalid Mongo ID');
		}

		const { task } = createTaskDto;
		const columnName = task.status;

		try {
			const updatedBoardDb = await BoardModel.findOneAndUpdate(
				{
					_id: boardId,
					'columns.name': columnName, //If column doesn't exist mongo throw an error
				},
				{
					$push: {
						'columns.$[col].tasks': task,
					},
				},
				{
					arrayFilters: [{ 'col.name': columnName }],
					new: true,
					projection: { columns: { $elemMatch: { name: columnName } } },
				},
			);

			if (!updatedBoardDb || updatedBoardDb.columns.length === 0) {
				throw CustomError.internalServer();
			}

			const updatedTasks = ColumnEntity.fromObject(updatedBoardDb.columns[0]).tasks;

			//Update users board
			if (task.users.length > 0) {
				await this.boardDatasourceMongoImpl.updateBoard({ id: boardId, users: task.users });
			}

			return updatedTasks;
		} catch (error) {
			console.log(error);

			//Todo: should be delete task to reverse the update
			throw error;
		}
	}
	async deleteTask(taskId: string, boardId: string): Promise<Task> {
		if (!MongoDb.isValidMongoId(boardId) || !MongoDb.isValidMongoId(taskId)) {
			throw CustomError.badRequest('Invalid Mongo ID');
		}

		try {
			const updatedTasksBoardDb = await BoardModel.findOneAndUpdate(
				{
					_id: boardId,
					'columns.tasks._id': taskId,
				},
				{
					$pull: {
						'columns.$[].tasks': { _id: taskId },
					},
				},
				{
					projection: { columns: 1 },
				},
			);

			if (!updatedTasksBoardDb || updatedTasksBoardDb.columns.length === 0) {
				throw CustomError.internalServer();
			}

			const updatedColumnsEntity = ColumnEntity.fromArray(updatedTasksBoardDb.columns);
			let deletedTask: Task | undefined;

			for (const column of updatedColumnsEntity) {
				deletedTask = column.tasks.find((task) => task.id === taskId);

				if (deletedTask) {
					break;
				}
			}

			if (!deletedTask) {
				throw CustomError.internalServer();
			}

			return deletedTask;
		} catch (error) {
			throw error;
		}
	}
	async updateTask(updateTaskDto: UpdateTaskDto | Partial<UpdateTaskDto>): Promise<Task> {
		const { boardId, task: taskDto } = updateTaskDto;

		if (!MongoDb.isValidMongoId(boardId) || !MongoDb.isValidMongoId(taskDto!.id)) {
			throw CustomError.badRequest('Invalid Mongo ID');
		}

		try {
			const boardDb = await this.boardDatasourceMongoImpl.getBoard(boardId!);

			if (!boardDb) {
				throw CustomError.notFound('Board not found');
			}

			const originalTaskEntity = BoardEntity.getTaskById(boardDb, taskDto!.id);

			if (!originalTaskEntity) {
				throw CustomError.notFound('Task not found');
			}

			const filterNote = (property: string) => `columns.$[].tasks.$[task].${property}`;
			const {
				id: taskId,
				title: titleDb,
				description: descriptionDb,
				users: usersDb,
				status: statusDb,
			} = originalTaskEntity!;

			let updatedUsers = taskDto!.users ?? usersDb;

			//Updated subtask
			const updatedTaskBoard = await BoardModel.findOneAndUpdate(
				{
					_id: boardId!,
					'columns.tasks._id': taskId,
				},
				{
					$set: {
						[`${filterNote('title')}`]: taskDto!.title ?? titleDb,
						[`${filterNote('description')}`]: taskDto!.description ?? descriptionDb,
						[`${filterNote('status')}`]: taskDto!.status ?? statusDb,
					},
					$addToSet: {
						[`${filterNote('users')}`]: { $each: updatedUsers },
					},
				},
				{
					arrayFilters: [{ 'task._id': taskId }],
					new: true,
				},
			);

			if (!updatedTaskBoard) {
				throw CustomError.internalServer();
			}
			const updatedTaskBoardEntity = BoardEntity.fromObject(updatedTaskBoard);
			const updatedTaskEntity = BoardEntity.getTaskById(updatedTaskBoardEntity, taskId);

			if (!updatedTaskEntity) {
				throw CustomError.internalServer();
			}

			return updatedTaskEntity;
		} catch (error) {
			throw error;
		}
	}
	async updateColumnTask(taskId: string, boardId: string, columnId: string): Promise<Task> {
		if (!MongoDb.isValidMongoId(boardId) || !MongoDb.isValidMongoId(taskId)) {
			throw CustomError.badRequest('Invalid Mongo ID');
		}

		try {
			const boardDb = await this.boardDatasourceMongoImpl.getBoard(boardId);
			const task = BoardEntity.getTaskById(boardDb, taskId);

			if (!task) {
				throw CustomError.notFound('Task not found');
			}
			const column = boardDb.getColumnById(columnId);

			if (!column) {
				throw CustomError.notFound('Column not found');
			}

			if (task.status !== column.name) {
				task.status = column.name;
			}

			const response = await BoardModel.findOneAndUpdate(
				{
					_id: boardId,
					'columns._id': columnId, //If column doesn't exist mongo throw an error
				},
				{
					$push: {
						'columns.$[col].tasks': task,
					},
				},
				{
					arrayFilters: [{ 'col._id': columnId }],
					new: true,
					projection: { columns: { $elemMatch: { _id: columnId } } },
				},
			);

			if (!response) {
				throw CustomError.internalServer();
			}

			await this.deleteTask(taskId, boardId);

			const columna = ColumnEntity.fromObject(response.columns[0]);

			if (!column) {
				throw CustomError.internalServer();
			}
			const updatedTask = columna.tasks.find((value) => _.areEquals(task, value, ['id', 'subtasks']));

			if (!updatedTask) {
				throw CustomError.internalServer();
			}

			return updatedTask;
		} catch (error) {
			throw error;
		}
	}
}
