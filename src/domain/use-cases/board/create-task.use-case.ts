import { UserModel } from '@/data';
import { CreateTaskDto, ICreateTaskUseCase, TaskResponse, BoardRepository, CustomError } from '@/domain';

export class CreateTaskUseCase implements ICreateTaskUseCase {
	constructor(private readonly boardRepository: BoardRepository) {}

	async execute(createTaskDto: CreateTaskDto): Promise<TaskResponse> {
		const { boardId, task } = createTaskDto;

		//Todo: logica de negocio
		//1- Si viene con usuarios chequear que existan en base de datos

		try {
			const boardDb = await this.boardRepository.getBoard(boardId);

			const existColumnWithTaskStatus = boardDb.columns.some(({ name }) => name === task.status);

			if (!existColumnWithTaskStatus) {
				throw CustomError.notFound(`Column ${task.status} do not exsit on this board`);
			}
			const users = task.users;
			if (users.length > 0) {
				for (const user of users) {
					const userExist = await UserModel.findById(user); //todo Should be a method of User use case

					if (!userExist) {
						throw CustomError.notFound(`User in task: ${user} not found `);
					}
				}
			}
		} catch (error) {
			throw error;
		}

		throw new Error('Method not implemented.');
	}
}
