import {
	AnyObject,
	CustomError,
	IUpdateTaskDto,
	isValidId,
	deleteUndefinedProps,
	IFullSubtask,
	UpdateSubtaskDto,
} from '@/domain';

export class UpdateTaskDto implements IUpdateTaskDto {
	private constructor(
		public readonly boardId: string, //Required
		public readonly userId: string | number, //Required
		public readonly task: {
			id: string; //Required
			title?: string;
			description?: string;
			users?: string[];
			status?: string;
			subtasks?: (IFullSubtask | Partial<IFullSubtask>)[];
		},
	) {
		const thisSubtasks = this.task.subtasks;

		if (thisSubtasks?.length === 0 || thisSubtasks === undefined) this.task.subtasks = undefined;
	}

	static create(object: AnyObject): {
		error?: CustomError;
		updateTaskDto?: UpdateTaskDto | Partial<UpdateTaskDto>;
	} {
		const { boardId, userId } = object;

		if (!isValidId(boardId)) {
			return {
				error: CustomError.badRequest('Invalid board ID'),
			};
		}

		if (!isValidId(userId)) {
			return {
				error: CustomError.badRequest('Invalid user ID'),
			};
		}

		const { task } = object;

		if (!isValidId(task.id)) {
			return {
				error: CustomError.badRequest('Invalid task ID'),
			};
		}

		const onlyTaskIdIsDefined = Object.keys(task).length === 1;
		if (onlyTaskIdIsDefined) {
			return {
				error: CustomError.badRequest('Nothing to update'),
			};
		}
		const { title, description, status, users } = task;
		const propsToCheck = Object.entries({
			title,
			description,
			status,
			users,
		});

		for (const [key, value] of propsToCheck) {
			if (Array.isArray(value)) {
				const someIdIsNotValid = value.some((value) => !isValidId(value));
				if (someIdIsNotValid) {
					return {
						error: CustomError.badRequest(`Invalid users IDS`),
					};
				}
				break;
			}

			if (typeof value !== 'string' && typeof value !== 'undefined') {
				return {
					error: CustomError.badRequest(`Invalid ${key}`),
				};
			}
		}

		const { subtasks } = task;
		let subtasksValidated: (IFullSubtask | Partial<IFullSubtask>)[] = [];

		if (Array.isArray(subtasks) && subtasks.length > 0) {
			for (const subtask of subtasks) {
				const { error, subtaskDto } = UpdateSubtaskDto.validateOnlySubtask(subtask);

				if (error) {
					return {
						error: CustomError.badRequest('Invalid subtasks'),
					};
				}

				subtasksValidated.push(subtaskDto!);
			}
		}

		const updateTaskDto = new UpdateTaskDto(String(boardId), String(userId), {
			id: String(task.id),
			title: task.title,
			description: task.description,
			users: task.users,
			status: task.status,
			subtasks: subtasksValidated!,
		});

		const somePropIsUndefined = Object.values(updateTaskDto.task).some((valueProp) => valueProp === undefined);

		if (somePropIsUndefined) {
			const partialTask = deleteUndefinedProps(updateTaskDto.task);

			return {
				updateTaskDto: {
					boardId: updateTaskDto.boardId,
					userId: String(userId),
					task: {
						id: partialTask.id!,
						...partialTask,
					},
				},
			};
		}

		return {
			updateTaskDto,
		};
	}
}
