import { CustomError, ICreateSubtaskDto, ICreateTaskDto } from '@/domain';
import { CreateSubtaskDto } from '../subtask/create-subtask.dto';
import { isArray } from 'lodash';

//Todo, testear y cambiar que si los ids no son MongoId validos arrojar error y testear
//Todo que status y title se esten enviando en lowercase
type AnyObject = { [key: string]: any };

export class CreateTaskDto implements ICreateTaskDto {
	private constructor(
		public boardId: string | number, //Required
		public task: {
			title: string; //Required
			status: string; //Required
			users: string[];
			description: string;
			subtasks: ICreateSubtaskDto[];
		},
	) {}

	static create(object: AnyObject): { error?: CustomError; failedSubtask?: AnyObject; createTaskDto?: CreateTaskDto } {
		const { boardId, task } = object;

		if (!boardId || (typeof boardId !== 'string' && typeof boardId !== 'number')) {
			return { error: CustomError.badRequest('Error on Board ID') };
		}
		const { title, status } = task;

		if (!title || typeof title !== 'string') {
			return { error: CustomError.badRequest('Error on task title') };
		}

		if (!status || typeof status !== 'string') {
			return { error: CustomError.badRequest('Error on task status') };
		}
		const { description = '', users = [] } = task;
		if (typeof description !== 'string') {
			return { error: CustomError.badRequest('Error on task description') };
		}

		//Users
		if (!isArray(users)) {
			return {
				error: CustomError.badRequest('Invalid task users ids'),
			};
		}
		if (users.length > 0) {
			const typeofError = users.some((id: string | number) => {
				if (typeof id !== 'number' && typeof id !== 'string') return true;
			});

			if (typeofError)
				return {
					error: CustomError.badRequest('Invalid task users ids'),
				};
		}

		//Subtasks
		let { subtasks = [] } = task;
		if (!isArray(subtasks)) {
			return {
				error: CustomError.badRequest('Invalid users subtasks'),
			};
		}
		if (subtasks.length > 0) {
			const { error, failedSubtask, createSubtaskDtos } = CreateSubtaskDto.formArray(subtasks);

			if (error) {
				return {
					error,
					failedSubtask,
				};
			}
			subtasks = createSubtaskDtos;
		}

		const okTask = {
			title: title.toLowerCase(),
			status: status.toLowerCase(),
			users,
			description,
			subtasks,
		};
		const createTaskDto = new CreateTaskDto(boardId, okTask);
		return {
			createTaskDto,
		};
	}
}
