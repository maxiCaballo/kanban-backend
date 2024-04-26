import { CustomError, ICreateSubtaskDto, ICreateTaskDto } from '@/domain';
import { CreateSubtaskDto } from '../subtask/create-subtask.dto';
import { isArray } from 'lodash';

export class CreateTaskDto implements ICreateTaskDto {
	private constructor(
		public title: string, //Required
		public status: string, //Required
		public users: string[],
		public description: string,
		public subtasks: ICreateSubtaskDto[],
	) {}

	static create(object: { [key: string]: any }): { error?: CustomError; createTaskDto?: CreateTaskDto } {
		const { title, status, description = '', users = [] } = object;

		if (!title) {
			return { error: CustomError.badRequest('Missing task title') };
		}

		if (!status) {
			return { error: CustomError.badRequest('Missing task status') };
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
			const { error, createSubtaskDtos } = CreateSubtaskDto.formArray(subtasks);

			if (error) {
				return {
					error,
				};
			}
			subtasks = createSubtaskDtos;
		}

		return {
			createTaskDto: new CreateTaskDto(title, status, users, description, subtasks),
		};
	}
}
