import { BoardModel, MongoDb } from '@/data';
import { BoardEntity, CustomError, DeleteSubtaskDto, Subtask, SubtaskDatasource, UpdateSubtaskDto } from '@/domain';

export class SubtaskDatasourceMongoImpl implements SubtaskDatasource {
	async updateSubtask(updateSubtaskDto: UpdateSubtaskDto | Partial<UpdateSubtaskDto>): Promise<Subtask> {
		const { boardId, subtask } = updateSubtaskDto;

		const isNotValidMongoId = {
			boardId: !MongoDb.isValidMongoId(boardId),
			subtaskId: !MongoDb.isValidMongoId(subtask?.id),
		};
		if (isNotValidMongoId.boardId || isNotValidMongoId.subtaskId) {
			throw CustomError.badRequest('Invalid mongo id');
		}

		try {
			const boardDb = await BoardModel.findById(boardId!);

			if (!boardDb) {
				throw CustomError.notFound('Board not found');
			}

			const boardEntity = BoardEntity.fromObject(boardDb);
			const subtaskEntity = BoardEntity.getSubtaskById(boardEntity, subtask!.id as string);

			if (!subtaskEntity) {
				throw CustomError.notFound('Subtask not found');
			}

			const filterNote = (property: string) => `columns.$[].tasks.$[].subtasks.$[subtask].${property}`;
			const { title: titleDb, isCompleted: isCompletedDb } = subtaskEntity;

			//Updated subtask
			const updatedboardDb = await BoardModel.findOneAndUpdate(
				{
					_id: boardId!,
					'columns.tasks.subtasks._id': subtask!.id,
				},
				{
					$set: {
						[`${filterNote('title')}`]: subtask!.title ?? titleDb,
						[`${filterNote('isCompleted')}`]: subtask!.isCompleted ?? isCompletedDb,
					},
				},
				{
					arrayFilters: [{ 'subtask._id': subtask!.id }],
					new: true,
				},
			);

			if (!updatedboardDb) {
				throw CustomError.internalServer();
			}
			const updatedBoardEntity = BoardEntity.fromObject(updatedboardDb);
			const updatedSubtaskEntity = BoardEntity.getSubtaskById(updatedBoardEntity, subtask!.id as string);

			if (!updatedSubtaskEntity) {
				throw CustomError.internalServer();
			}

			return updatedSubtaskEntity;
		} catch (error) {
			throw error;
		}
	}
	async deleteSubtask(subtaskDto: DeleteSubtaskDto): Promise<Subtask> {
		const { boardId, userId, subtaskId } = subtaskDto;

		const { invalidBoardId, invalidSubtaskId, invalidUserId } = {
			invalidBoardId: !MongoDb.isValidMongoId(boardId),
			invalidSubtaskId: !MongoDb.isValidMongoId(subtaskId),
			invalidUserId: !MongoDb.isValidMongoId(userId),
		};
		if (invalidBoardId || invalidSubtaskId || invalidUserId) {
			throw CustomError.badRequest('Invalid mongo id');
		}
		try {
			const boardDb = await BoardModel.findById(boardId!);

			if (!boardDb) {
				throw CustomError.notFound('Board not found');
			}

			const boardEntity = BoardEntity.fromObject(boardDb);
			const subtaskEntity = BoardEntity.getSubtaskById(boardEntity, subtaskId as string);

			if (!subtaskEntity) {
				throw CustomError.notFound('Subtask not found');
			}

			//Updated subtask
			const updatedboardDb = await BoardModel.findOneAndUpdate(
				{
					_id: boardId!,
					'columns.tasks.subtasks._id': subtaskId,
				},
				{
					$pull: {
						'columns.$[].tasks.$[].subtasks': { _id: subtaskId },
					},
				},
				{
					projection: { columns: 1 },
				},
			);

			if (!updatedboardDb) {
				throw CustomError.internalServer();
			}

			return subtaskEntity;
		} catch (error) {
			throw error;
		}
	}
}
