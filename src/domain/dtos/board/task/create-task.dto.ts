import { CustomError, ICreateSubtaskDto, ICreateTaskDto } from '@/domain';
import { CreateSubtaskDto } from '../subtask/create-subtask.dto';
import { isArray } from 'lodash';
type AnyObject = { [key: string]: any };
export class CreateTaskDto implements ICreateTaskDto {
	private constructor(
		public title: string, //Required
		public status: string, //Required
		public users: string[],
		public description: string,
		public subtasks: ICreateSubtaskDto[],
	) {}

	static create(object: AnyObject): { error?: CustomError; failedSubtask?: AnyObject; createTaskDto?: CreateTaskDto } {
		const { title, status, description = '', users = [] } = object;

		if (!title || typeof title !== 'string') {
			return { error: CustomError.badRequest('Error on task title') };
		}

		if (!status || typeof title !== 'string') {
			return { error: CustomError.badRequest('Error on task status') };
		}
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
		let { subtasks = [] } = object;
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

		return {
			createTaskDto: new CreateTaskDto(title, status, users, description, subtasks),
		};
	}
}
