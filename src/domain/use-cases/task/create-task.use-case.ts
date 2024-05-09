import { LodashAdapter as _ } from '@/config';
import { UserModel } from '@/data';
import {
	CreateTaskDto,
	ICreateTaskUseCase,
	TaskResponse,
	CustomError,
	TaskRepository,
	Task,
	BoardEntity,
	GetBoardUseCase,
} from '@/domain';

export class CreateTaskUseCase implements ICreateTaskUseCase {
	constructor(private readonly getBoardUseCase: GetBoardUseCase, private readonly taskRepository: TaskRepository) {}

	async execute(createTaskDto: CreateTaskDto): Promise<TaskResponse> {
		const { boardId, userId, task } = createTaskDto;

		try {
			//Validations
			//! usando metodo de mongo, esta mal porque me estoy acoplando a mongodb cambiar por metodo de repositorio o middleware
			const userExist = await UserModel.exists({ _id: userId });

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

			//! usando metodo de mongo, esta mal porque me estoy acoplando a mongodb cambiar por metodo de repositorio o middleware
			//Check if task users exist on db
			task.users.forEach(async (user) => {
				const doNotExistOnDb = !(await UserModel.exists({ _id: user }));

				if (doNotExistOnDb) {
					//should not be occur
					throw CustomError.internalServer();
				}
			});

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

//? - Si al crear una tarea esa persona no se encuentra asignada al tablero y no es admin, no puede crear la tarea.
//? - Al crear una tarea si es miembro del tablero pero no admin automaticamente se vuelve miembro de la tarea.
//? - Al crear una tarea si es admin no se agrega a miembros de la tareas, ya lo es implicitamente.
