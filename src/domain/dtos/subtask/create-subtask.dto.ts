import { ICreateSubtaskDto, CustomError, AnyObject } from '@/domain';

export class CreateSubtaskDto implements ICreateSubtaskDto {
	constructor(public title: string, public isCompleted: boolean = false) {}

	static create(object: AnyObject): { error?: CustomError; createSubtaskDto?: CreateSubtaskDto } {
		const { title } = object;

		if (!title) {
			return {
				error: CustomError.badRequest('Missing title'),
			};
		}

		return {
			createSubtaskDto: new CreateSubtaskDto(title),
		};
	}

	static formArray(objects: AnyObject[]): {
		error?: CustomError;
		failedSubtask?: AnyObject;
		createSubtaskDtos?: CreateSubtaskDto[];
	} {
		const createSubtaskDtos = [];
		for (const object of objects) {
			const { error, createSubtaskDto } = CreateSubtaskDto.create(object);

			if (error) {
				return { error, failedSubtask: object };
			}

			createSubtaskDtos.push(createSubtaskDto!);
		}

		return { createSubtaskDtos };
	}
}
