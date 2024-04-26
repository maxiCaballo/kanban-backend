import { ICreateSubtaskDto, CustomError } from '@/domain';

type anyObject = { [key: string]: any };

export class CreateSubtaskDto implements ICreateSubtaskDto {
	constructor(public title: string, public isCompleted: boolean = false) {}

	static create(object: anyObject): { error?: CustomError; createSubtaskDto?: CreateSubtaskDto } {
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

	static formArray(objects: anyObject[]): {
		error?: CustomError;
		createSubtaskDtos?: CreateSubtaskDto[];
	} {
		const createSubtaskDtos = [];
		for (const object of objects) {
			const { error, createSubtaskDto } = CreateSubtaskDto.create(object);

			if (error) {
				return { error };
			}

			createSubtaskDtos.push(createSubtaskDto!);
		}

		return { createSubtaskDtos };
	}
}
