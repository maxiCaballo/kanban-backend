import { LodashAdapter as _ } from '@/config';
import {
	CreateTaskDto,
	ICreateTaskUseCase,
	TaskResponse,
	CustomError,
	TaskRepository,
	Task,
	BoardEntity,
	GetBoardUseCase,
	UserRepository,
} from '@/domain';

export class CreateTaskUseCase implements ICreateTaskUseCase {
	constructor(
		private readonly getBoardUseCase: GetBoardUseCase,
		private readonly taskRepository: TaskRepository,
		private readonly userRepository: UserRepository,
	) {}

	async execute(createTaskDto: CreateTaskDto): Promise<TaskResponse> {
		const { boardId, userId, task } = createTaskDto;

		try {
			//Validations
			const userExist = await this.userRepository.userExist(String(userId));

			if (!userExist) {
				throw CustomError.notFound(`User: ${userId} not found`);
			}

			const { board: boardEntity } = await this.getBoardUseCase.execute(boardId, userId);

			const column = boardEntity.columns.find((column) => column.name === task.status);

			if (!column) {
				throw CustomError.notFound(`Column '${task.status}' not found`);
			}

			const { isMember } = BoardEntity.isMemberOrAdminByUserId(boardEntity, userId);

			const validMemebers = BoardEntity.isMemberOrAdminByUserIds(boardEntity, task.users);

			if (!validMemebers) {
				throw CustomError.unAuthorized(`Some user is not a member of this Board`);
			}

			//Check if task users exist on db
			for (const user of task.users) {
				const doNotExistOnDb = !(await this.userRepository.userExist(String(user)));

				if (doNotExistOnDb) {
					//should not be occur
					throw CustomError.internalServer();
				}
			}

			if (isMember) {
				const memberIsInUsersTask = task.users.find((user) => user === String(userId));

				if (!memberIsInUsersTask) {
					task.users.push(String(userId));
				}
			}

			//Create Task
			const updatedTasks = await this.taskRepository.createTask(createTaskDto);

			const tasksBeforeUpdate = column.tasks ?? [];

			let updatedTask: Task | undefined;

			const differentsTasks = _.getDifferentElementsFromArray<Task>(updatedTasks, tasksBeforeUpdate);

			if (!(differentsTasks.length === 1)) {
				await this.taskRepository.deleteTask(String(updatedTask!.id), String(boardId));
				throw CustomError.internalServer();
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

//? - Si al crear una tarea esa persona no se encuentra asignada al tablero y no es admin, no puede crear la tarea.
//? - Al crear una tarea si es miembro del tablero pero no admin automaticamente se vuelve miembro de la tarea.
//? - Al crear una tarea si es admin quien la crea y el no se agrega como miembro de la tarea, no va a aparecer como tal,
//? sinembargo si se agrega si va a aparecer, pero igualmente va a poder editar la tarea de las dos formas.
