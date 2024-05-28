import { CustomError, UpdateTaskDto } from '@/domain';
import { Types } from 'mongoose';

describe('Test on update-task.dto.ts', () => {
	const mockDto = {
		boardId: new Types.ObjectId().toString(),
		userId: new Types.ObjectId().toString(),
		task: {
			id: new Types.ObjectId().toString(),
			title: 'test title',
			description: 'test description',
			status: 'test status',
			users: [new Types.ObjectId().toString(), new Types.ObjectId().toString(), new Types.ObjectId().toString()],
		},
	};
	describe('Errors', () => {
		test('Should throw an error if boardId prop is not defined', () => {
			//Arrange
			const mockErrorDto = {
				task: mockDto.task,
			};
			const expectedError = CustomError.badRequest('Invalid board ID');
			//Act
			const { error, updateTaskDto } = UpdateTaskDto.create(mockErrorDto);

			//Assert
			expect(updateTaskDto).toBeUndefined();
			expect(error).toEqual(expectedError);
		});
		test('Should throw an error if boardId prop is not a string or number', () => {
			//Arrange
			const mockErrorDto = {
				boardId: false,
				task: mockDto.task,
			};
			const expectedError = CustomError.badRequest('Invalid board ID');
			//Act
			const { error, updateTaskDto } = UpdateTaskDto.create(mockErrorDto);

			//Assert
			expect(updateTaskDto).toBeUndefined();
			expect(error).toEqual(expectedError);
		});
		test('Should throw an error if boardId prop is not a valid mongo ID', () => {
			//Arrange
			const mockErrorDto = {
				boardId: new Types.ObjectId().toString() + 'a',
				task: mockDto.task,
			};
			const expectedError = CustomError.badRequest('Invalid board ID');
			//Act
			const { error, updateTaskDto } = UpdateTaskDto.create(mockErrorDto);

			//Assert
			expect(updateTaskDto).toBeUndefined();
			expect(error).toEqual(expectedError);
		});
		test('Should throw an error if taskId prop is not defined', () => {
			//Arrange
			const { title, description, status, users } = mockDto.task;
			const mockErrorDto = {
				boardId: mockDto.boardId,
				userId: mockDto.userId,
				task: {
					title,
					description,
					status,
					users,
				},
			};
			const expectedError = CustomError.badRequest('Invalid task ID');
			//Act
			const { error, updateTaskDto } = UpdateTaskDto.create(mockErrorDto);

			//Assert
			expect(updateTaskDto).toBeUndefined();
			expect(error).toEqual(expectedError);
		});
		test('Should throw an error if taskId prop is not a string or number', () => {
			//Arrange
			const { title, description, status, users } = mockDto.task;
			const mockErrorDto = {
				boardId: mockDto.boardId,
				userId: mockDto.userId,
				task: {
					id: false,
					title,
					description,
					status,
					users,
				},
			};
			const expectedError = CustomError.badRequest('Invalid task ID');
			//Act
			const { error, updateTaskDto } = UpdateTaskDto.create(mockErrorDto);

			//Assert
			expect(updateTaskDto).toBeUndefined();
			expect(error).toEqual(expectedError);
		});
		test('Should throw an error if taskId prop is not a valid mongo ID', () => {
			//Arrange
			const { title, description, status, users } = mockDto.task;
			const mockErrorDto = {
				boardId: mockDto.boardId,
				userId: mockDto.userId,
				task: {
					id: new Types.ObjectId().toString() + 'a',
					title,
					description,
					status,
					users,
				},
			};
			const expectedError = CustomError.badRequest('Invalid task ID');
			//Act
			const { error, updateTaskDto } = UpdateTaskDto.create(mockErrorDto);

			//Assert
			expect(updateTaskDto).toBeUndefined();
			expect(error).toEqual(expectedError);
		});
		test('Should throw an error if only taskId and boardId prop is defined', () => {
			//Arrange
			const mockErrorDto = {
				boardId: mockDto.boardId,
				userId: mockDto.userId,
				task: {
					id: mockDto.task.id,
				},
			};
			const expectedError = CustomError.badRequest('Nothing to update');
			//Act
			const { error, updateTaskDto } = UpdateTaskDto.create(mockErrorDto);

			//Assert
			expect(updateTaskDto).toBeUndefined();
			expect(error).toEqual(expectedError);
		});
		test('Should throw an error if some user id is not valid', () => {
			//Arrange
			const { id, title, description, status, users } = mockDto.task;
			const mockWrongUsers = [...users, false];
			const mockErrorDto = {
				boardId: mockDto.boardId,
				userId: mockDto.userId,
				task: {
					id,
					title,
					description,
					status,
					users: mockWrongUsers,
				},
			};
			const expectedError = CustomError.badRequest('Invalid users IDS');
			//Act
			const { error, updateTaskDto } = UpdateTaskDto.create(mockErrorDto);

			//Assert
			expect(updateTaskDto).toBeUndefined();
			expect(error).toEqual(expectedError);
		});
		test('Should throw an error if task title is defined but is not a string', () => {
			//Arrange
			const { id, description, status, users } = mockDto.task;
			const mockErrorDto = {
				boardId: mockDto.boardId,
				userId: mockDto.userId,
				task: {
					id,
					title: 1,
					description,
					status,
					users,
				},
			};
			const expectedError = CustomError.badRequest('Invalid title');
			//Act
			const { error, updateTaskDto } = UpdateTaskDto.create(mockErrorDto);

			//Assert
			expect(updateTaskDto).toBeUndefined();
			expect(error).toEqual(expectedError);
		});
		test('Should throw an error if task description is defined but is not a string', () => {
			//Arrange
			const { id, title, status, users } = mockDto.task;
			const mockErrorDto = {
				boardId: mockDto.boardId,
				userId: mockDto.userId,
				task: {
					id,
					title,
					description: 1,
					status,
					users,
				},
			};
			const expectedError = CustomError.badRequest('Invalid description');
			//Act
			const { error, updateTaskDto } = UpdateTaskDto.create(mockErrorDto);

			//Assert
			expect(updateTaskDto).toBeUndefined();
			expect(error).toEqual(expectedError);
		});
		test('Should throw an error if task status is defined but is not a string', () => {
			//Arrange
			const { id, title, description, users } = mockDto.task;
			const mockErrorDto = {
				boardId: mockDto.boardId,
				userId: mockDto.userId,
				task: {
					id,
					title,
					description,
					status: 1,
					users,
				},
			};
			const expectedError = CustomError.badRequest('Invalid status');
			//Act
			const { error, updateTaskDto } = UpdateTaskDto.create(mockErrorDto);

			//Assert
			expect(updateTaskDto).toBeUndefined();
			expect(error).toEqual(expectedError);
		});
	});
	describe('Ok', () => {
		test('Should return partial TaskDto if on task only task title and task ID is defined', () => {
			//Arrange
			const { id, title } = mockDto.task;

			const mockErrorDto = {
				boardId: mockDto.boardId,
				userId: mockDto.userId,
				task: {
					id,
					title,
				},
			};
			const expectedResult = { boardId: mockDto.boardId, userId: mockDto.userId, task: { id, title } };
			//Act
			const { error, updateTaskDto } = UpdateTaskDto.create(mockErrorDto);

			//Assert
			expect(error).toBeUndefined();
			expect(updateTaskDto).toEqual(expectedResult);
		});
		test('Should return partial TaskDto if on task only task description and task ID is defined', () => {
			//Arrange
			const { id, description } = mockDto.task;

			const mockErrorDto = {
				boardId: mockDto.boardId,
				userId: mockDto.userId,
				task: {
					id,
					description,
				},
			};
			const expectedResult = { boardId: mockDto.boardId, userId: mockDto.userId, task: { id, description } };
			//Act
			const { error, updateTaskDto } = UpdateTaskDto.create(mockErrorDto);

			//Assert
			expect(error).toBeUndefined();
			expect(updateTaskDto).toEqual(expectedResult);
		});
		test('Should return partial TaskDto if on task only task status and task ID is defined', () => {
			//Arrange
			const { id, status } = mockDto.task;

			const mockErrorDto = {
				boardId: mockDto.boardId,
				userId: mockDto.userId,
				task: {
					id,
					status,
				},
			};
			const expectedResult = { boardId: mockDto.boardId, userId: mockDto.userId, task: { id, status } };
			//Act
			const { error, updateTaskDto } = UpdateTaskDto.create(mockErrorDto);

			//Assert
			expect(error).toBeUndefined();
			expect(updateTaskDto).toEqual(expectedResult);
		});
		test('Should return partial TaskDto if on task only task users and task ID is defined', () => {
			//Arrange
			const { id, users } = mockDto.task;

			const mockErrorDto = {
				boardId: mockDto.boardId,
				userId: mockDto.userId,
				task: {
					id,
					users,
				},
			};
			const expectedResult = { boardId: mockDto.boardId, userId: mockDto.userId, task: { id, users } };
			//Act
			const { error, updateTaskDto } = UpdateTaskDto.create(mockErrorDto);

			//Assert
			expect(error).toBeUndefined();
			expect(updateTaskDto).toEqual(expectedResult);
		});
		test('Should return a full dto', () => {
			//Arrange
			const { id, title, description, users } = mockDto.task;
			const subtasks = [
				{ id: new Types.ObjectId().toString(), title: 'subtask-1' },
				{ id: new Types.ObjectId().toString(), isCompleted: true },
				{ id: new Types.ObjectId().toString(), title: 'subtask-3', isCompleted: true },
			];
			const mockErrorDto = {
				boardId: mockDto.boardId,
				userId: mockDto.userId,
				task: {
					id,
					title,
					description,
					status: 'todo',
					users,
					subtasks,
				},
			};
			const expectedError = CustomError.badRequest('Invalid status');
			//Act
			const { error, updateTaskDto } = UpdateTaskDto.create(mockErrorDto);

			//Assert
			expect(error).toBeUndefined();
			expect(updateTaskDto).toEqual(mockErrorDto);
		});
	});
});
