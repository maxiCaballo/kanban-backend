import { CreateTaskDto, CustomError } from '@/domain';

describe('Test on CreateTaskDto', () => {
	const boardId = 1;
	//Errors
	test('Should throw an error if BOARD ID is not defined', () => {
		//Arrange
		const mockDto = {};
		const expectedError = CustomError.badRequest('Error on Board ID');

		//Act
		const { error, failedSubtask, createTaskDto } = CreateTaskDto.create(mockDto);

		//Assert
		expect(createTaskDto).toBeUndefined();
		expect(failedSubtask).toBeUndefined();
		expect(error).toEqual(expectedError);
	});
	test('Should throw an error if BOARD ID is not a string', () => {
		//Arrange
		const mockDto = {
			boardId: false,
		};
		const expectedError = CustomError.badRequest('Error on Board ID');

		//Act
		const { error, failedSubtask, createTaskDto } = CreateTaskDto.create(mockDto);

		//Assert
		expect(createTaskDto).toBeUndefined();
		expect(failedSubtask).toBeUndefined();
		expect(error).toEqual(expectedError);
	});
	test('Should throw an error if BOARD ID is not a number', () => {
		//Arrange
		const mockDto = {
			boardId: false,
		};
		const expectedError = CustomError.badRequest('Error on Board ID');

		//Act
		const { error, failedSubtask, createTaskDto } = CreateTaskDto.create(mockDto);

		//Assert
		expect(createTaskDto).toBeUndefined();
		expect(failedSubtask).toBeUndefined();
		expect(error).toEqual(expectedError);
	});
	test('Should throw an error if TITLE is not defined', () => {
		//Arrange
		const mockDto = { boardId, task: {} };
		const expectedError = CustomError.badRequest('Error on task title');

		//Act
		const { error, failedSubtask, createTaskDto } = CreateTaskDto.create(mockDto);

		//Assert
		expect(createTaskDto).toBeUndefined();
		expect(failedSubtask).toBeUndefined();
		expect(error).toEqual(expectedError);
	});
	test('Should throw an error if TITLE is not a string', () => {
		//Arrange
		const mockDto = {
			boardId,
			task: {
				title: false,
			},
		};
		const expectedError = CustomError.badRequest('Error on task title');

		//Act
		const { error, failedSubtask, createTaskDto } = CreateTaskDto.create(mockDto);

		//Assert
		expect(createTaskDto).toBeUndefined();
		expect(failedSubtask).toBeUndefined();
		expect(error).toEqual(expectedError);
	});
	test('Should throw an error if STATUS is not defined', () => {
		//Arrange
		const mockDto = {
			boardId,
			task: {
				title: 'Test title',
			},
		};
		const expectedError = CustomError.badRequest('Error on task status');

		//Act
		const { error, failedSubtask, createTaskDto } = CreateTaskDto.create(mockDto);

		//Assert
		expect(createTaskDto).toBeUndefined();
		expect(failedSubtask).toBeUndefined();
		expect(error).toEqual(expectedError);
	});
	test('Should throw an error if STATUS is not a string', () => {
		//Arrange
		const mockDto = {
			boardId,
			task: {
				title: 'Test title',
				status: false,
			},
		};
		const expectedError = CustomError.badRequest('Error on task status');

		//Act
		const { error, failedSubtask, createTaskDto } = CreateTaskDto.create(mockDto);

		//Assert
		expect(createTaskDto).toBeUndefined();
		expect(failedSubtask).toBeUndefined();
		expect(error).toEqual(expectedError);
	});
	test('Should throw an error if DESCRIPTION is not a string', () => {
		//Arrange
		const mockDto = {
			boardId,
			task: {
				title: 'Test title',
				status: 'Todo',
				description: false,
			},
		};

		const expectedError = CustomError.badRequest('Error on task description');

		//Act
		const { error, failedSubtask, createTaskDto } = CreateTaskDto.create(mockDto);

		//Assert
		expect(createTaskDto).toBeUndefined();
		expect(failedSubtask).toBeUndefined();
		expect(error).toEqual(expectedError);
	});
	test('Should throw an error if typeof USERS is not an array', () => {
		//Arrange
		const mockDto = {
			boardId,
			task: { title: 'Test title', status: 'Todo', users: 1 },
		};

		const expectedError = CustomError.badRequest('Invalid task users ids');

		//Act
		const { error, failedSubtask, createTaskDto } = CreateTaskDto.create(mockDto);

		//Assert
		expect(createTaskDto).toBeUndefined();
		expect(failedSubtask).toBeUndefined();
		expect(error).toEqual(expectedError);
	});
	test('Should throw an error if typeof USERS are not number or string', () => {
		//Arrange
		const mockDto = {
			boardId,
			task: {
				title: 'Test title',
				status: 'Todo',
				users: [1, '1', false],
			},
		};
		const expectedError = CustomError.badRequest('Invalid task users ids');

		//Act
		const { error, failedSubtask, createTaskDto } = CreateTaskDto.create(mockDto);

		//Assert
		expect(createTaskDto).toBeUndefined();
		expect(failedSubtask).toBeUndefined();
		expect(error).toEqual(expectedError);
	});
	test('Should throw an error if SUBTASKS is not an array', () => {
		//Arrange
		const mockDto = {
			boardId,
			task: {
				title: 'Test title',
				status: 'Todo',
				users: [],
				subtasks: 1,
			},
		};
		const expectedError = CustomError.badRequest('Invalid users subtasks');

		//Act
		const { error, failedSubtask, createTaskDto } = CreateTaskDto.create(mockDto);

		//Assert
		expect(createTaskDto).toBeUndefined();
		expect(failedSubtask).toBeUndefined();
		expect(error).toEqual(expectedError);
	});
	test('Should throw an error if SUBTASKS are not valid', () => {
		//Arrange
		const mockFailedSubtask = 1;
		const mockDto = {
			boardId,
			task: {
				title: 'Test title',
				status: 'Todo',
				users: [],
				subtasks: [mockFailedSubtask],
			},
		};
		//Act
		const { error, failedSubtask, createTaskDto } = CreateTaskDto.create(mockDto);

		//Assert
		expect(createTaskDto).toBeUndefined();
		expect(error).toBeInstanceOf(CustomError);
		expect(failedSubtask).toEqual(mockFailedSubtask);
	});
	//Ok
	test('Should return a createTaskDto', () => {
		//Arrange
		const mockCreateTaskDto = {
			boardId,
			task: {
				title: 'Test title',
				status: 'Todo',
				users: [1, 2, 3],
				subtasks: [
					{
						title: 'Subtasks title',
					},
				],
			},
		};
		const expectedDto = {
			boardId,
			task: {
				title: 'Test title',
				status: 'Todo',
				description: '',
				users: [1, 2, 3],
				subtasks: [
					{
						title: 'Subtasks title',
						isCompleted: false,
					},
				],
			},
		};

		//Act
		const { error, failedSubtask, createTaskDto } = CreateTaskDto.create(mockCreateTaskDto);

		//Assert
		expect(error).toBeUndefined();
		expect(failedSubtask).toBeUndefined();
		expect(createTaskDto).toEqual(expectedDto);
	});
});
