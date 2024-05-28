import {
	IUpdateSubtaskUseCase,
	UpdateSubtaskDto,
	BoardRepository,
	BoardEntity,
	CustomError,
	SubtaskResponse,
} from '@/domain';

export class UpdateSubtaskUseCase implements IUpdateSubtaskUseCase {
	constructor(private readonly boardRepository: BoardRepository) {}

	async execute(updateSubtaskDto: UpdateSubtaskDto, userId: string): Promise<SubtaskResponse> {
		const { boardId, subtask } = updateSubtaskDto;
		try {
			const board = await this.boardRepository.getBoard(boardId);

			const { isAdmin, isMember } = BoardEntity.isMemberOrAdminByUserId(board, userId);

			if (!isAdmin && !isMember) {
				throw CustomError.unAuthorized();
			}
			const usersSubtask = BoardEntity.getUsersTaskBySubtask(board, subtask.id);

			//Subtask not found
			if (!usersSubtask) {
				throw CustomError.notFound('Subtask not found');
			}

			if (!isAdmin) {
				const isUserAssignedToSubtask = usersSubtask.find((subtaskUserId) => subtaskUserId.toString() === userId);
				if (!isUserAssignedToSubtask) {
					throw CustomError.unAuthorized();
				}
			}

			const updatedBoard = await this.boardRepository.updateSubtask(updateSubtaskDto);

			return {
				subtask: updatedBoard,
			};
		} catch (error) {
			throw error;
		}
	}
}

/*
 1. Si no es ni admin ni usuario no puede editar la subtarea.
 2. Si no es admin pero es miembro, puede editar solo la subtarea a la que pertenece.
*/
