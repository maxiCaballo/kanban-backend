import { LodashAdapter as _ } from '@/config';
import { UserModel } from '@/data';
import {
	CreateTaskDto,
	ICreateTaskUseCase,
	TaskResponse,
	BoardRepository,
	CustomError,
	TaskRepository,
	Task,
} from '@/domain';

export class CreateTaskUseCase implements ICreateTaskUseCase {
	constructor(private readonly boardRepository: BoardRepository, private readonly taskRepository: TaskRepository) {}

	async execute(createTaskDto: CreateTaskDto): Promise<TaskResponse> {
		const { boardId, task } = createTaskDto;

		try {
			const boardDb = await this.boardRepository.getBoard(boardId);

			const column = boardDb.columns.find((column) => column.name === task.status);

			if (!column) {
				throw CustomError.notFound(`Column '${task.status}' not found`);
			}
			const users = task.users;

			if (users.length > 0) {
				for (const user of users) {
					const userExist = await UserModel.exists({ _id: user });

					if (!userExist) {
						throw CustomError.notFound(`User in task: ${user} not found `);
					}
				}
			}

			const updatedTasks = await this.taskRepository.createTask(createTaskDto);

			const tasksBeforeUpdate = column.tasks ?? [];

			let updatedTask: Task | undefined;

			const differentsTasks = _.getDifferentElementsFromArray<Task>(updatedTasks, tasksBeforeUpdate);

			if (!(differentsTasks.length === 1)) {
				throw CustomError.internalServer();
				//Todo: reverse update delete
			}

			updatedTask = differentsTasks[0];

			return {
				task: updatedTask,
			};
		} catch (error) {
			throw error;
		}
	}
}
