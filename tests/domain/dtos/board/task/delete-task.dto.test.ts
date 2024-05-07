import { DeleteTaskDto, CustomError } from '@/domain';
import { Types } from 'mongoose';

describe('Test on delete-task.dto.ts', () => {
	const randomMongoId = new Types.ObjectId().toString();
	//Errors
	test('Should throw an error if board id is not a mongo id', () => {
		//Arrange
		const mockDto = {
			boardId: '1',
			taskId: '2',
		};
		const expectedError = CustomError.badRequest('Invalid board ID');

		//Act
		const { error, deleteTaskDto } = DeleteTaskDto.create(mockDto);

		//Assert
		expect(deleteTaskDto).toBeUndefined();
		expect(error).toEqual(expectedError);
		expect(error).toBeInstanceOf(CustomError);
	});
	test('Should throw an error if board id is not a number or string', () => {
		//Arrange
		const mockDto = {
			boardId: [],
			taskId: '2',
		};
		const expectedError = CustomError.badRequest('Invalid board ID');

		//Act
		const { error, deleteTaskDto } = DeleteTaskDto.create(mockDto);

		//Assert
		expect(deleteTaskDto).toBeUndefined();
		expect(error).toEqual(expectedError);
		expect(error).toBeInstanceOf(CustomError);
	});
	test('Should throw an error if task id is not a number or string', () => {
		//Arrange
		const mockDto = {
			boardId: randomMongoId,
			taskId: false,
		};
		const expectedError = CustomError.badRequest('Invalid task ID');

		//Act
		const { error, deleteTaskDto } = DeleteTaskDto.create(mockDto);

		//Assert
		expect(deleteTaskDto).toBeUndefined();
		expect(error).toEqual(expectedError);
		expect(error).toBeInstanceOf(CustomError);
	});
	test('Should throw an error if task id is not a number or string', () => {
		//Arrange
		const mockDto = {
			boardId: randomMongoId,
			taskId: false,
		};
		const expectedError = CustomError.badRequest('Invalid task ID');

		//Act
		const { error, deleteTaskDto } = DeleteTaskDto.create(mockDto);

		//Assert
		expect(deleteTaskDto).toBeUndefined();
		expect(error).toEqual(expectedError);
		expect(error).toBeInstanceOf(CustomError);
	});
	test('Should throw an error if task id is not mongo id', () => {
		//Arrange
		const mockDto = {
			boardId: new Types.ObjectId().toString(),
			taskId: 1,
		};
		const expectedError = CustomError.badRequest('Invalid task ID');

		//Act
		const { error, deleteTaskDto } = DeleteTaskDto.create(mockDto);

		//Assert
		expect(deleteTaskDto).toBeUndefined();
		expect(error).toEqual(expectedError);
		expect(error).toBeInstanceOf(CustomError);
	});
});
