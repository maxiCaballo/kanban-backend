import { CustomError, CreateSubtaskDto } from '@/domain';
describe('Test on create-subtask.dto.ts', () => {
	//Error
	test('Should throw an error if title is not defined on CreateSubtaskDto.create()', () => {
		//Arrange
		const mockDto = {};
		const expectedError = CustomError.badRequest('Missing title');
		//Act
		const { error, createSubtaskDto } = CreateSubtaskDto.create(mockDto);
		//Assert
		expect(createSubtaskDto).toBeUndefined();
		expect(error).toBeInstanceOf(CustomError);
		expect(error).toEqual(expectedError);
	});
	test('Should return an error if one subtask have an error on CreateSubtaskDto.fromArray()', () => {
		//Arrange
		const mockFailedSubtask = {};
		const mockDto = [
			{
				title: 'Title test',
			},
			mockFailedSubtask,
		];
		//Act
		const { error, failedSubtask, createSubtaskDtos } = CreateSubtaskDto.formArray(mockDto);

		//Assert
		expect(createSubtaskDtos).toBeUndefined();
		expect(error).toBeInstanceOf(CustomError);
		expect(failedSubtask).toEqual(mockFailedSubtask);
	});
	test('Should return isCompleted as false if subtask have isCompleted property defined as true', () => {
		//Arrange
		const expectedDto = {
			title: 'Title test',
			isCompleted: false,
		};
		const mockDto = {
			title: 'Title test',
			isCompleted: true,
		};

		//Act
		const { error, createSubtaskDto } = CreateSubtaskDto.create(mockDto);

		//Assert
		expect(createSubtaskDto).toEqual(expectedDto);
		expect(createSubtaskDto).not.toEqual(mockDto);
		expect(error).toBeUndefined();
	});
	//Ok
	test('Should return a CreateSubtaskDto from a single dto', () => {
		//Arrange
		const mockDto = {
			title: 'Test title',
		};
		const expectedDto = {
			title: 'Test title',
			isCompleted: false,
		};

		//Act
		const { error, createSubtaskDto } = CreateSubtaskDto.create(mockDto);

		//Assert
		expect(error).toBeUndefined();
		expect(createSubtaskDto).toEqual(expectedDto);
	});
	test('Should return a CreateSubtaskDto from a multiples dtos', () => {
		//Arrange
		const mockDto1 = {
			title: 'Test title',
		};
		const mockDto2 = {
			title: 'Test title 2',
		};
		const mockDtos = [mockDto1, mockDto2];
		const expectedMockDtos = [
			{ ...mockDto1, isCompleted: false },
			{ ...mockDto2, isCompleted: false },
		];

		//Act
		const { error, failedSubtask, createSubtaskDtos } = CreateSubtaskDto.formArray(mockDtos);

		//Assert
		expect(error).toBeUndefined();
		expect(failedSubtask).toBeUndefined();
		expect(createSubtaskDtos).toEqual(expectedMockDtos);
	});
});
