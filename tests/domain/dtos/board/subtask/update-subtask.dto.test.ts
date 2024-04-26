import { UpdateSubtaskDto, CustomError } from '@/domain';

describe('Test on UpdateSubtaskDto', () => {
	describe('Errors', () => {
		//Subtask
		test('Should throw id error if missing id or is not a string or is not a number on subtask property', () => {
			//Arrange
			const mockSubtaskMissingId = {
				boardId: 1,
				subtask: {
					isCompleted: true,
					title: 'test',
				},
			};
			const mockSubtaskErrorType = {
				boardId: 1,
				subtask: {
					id: true,
					isCompleted: true,
					title: 'test',
				},
			};
			const expectedError = {
				ok: false,
				statusCode: 400,
				message: 'Invalid ID',
			};

			//Act
			const { error: errorMissingId, updateSubtaskDto: dtoMissingId } = UpdateSubtaskDto.create(mockSubtaskMissingId);
			const { error: errorType, updateSubtaskDto: dtoErrorType } = UpdateSubtaskDto.create(mockSubtaskErrorType);

			//Assert
			expect(errorMissingId && errorType).toBeInstanceOf(CustomError);
			expect(errorType && errorMissingId).toEqual(expectedError);
			expect(dtoMissingId && dtoErrorType).toBe(undefined);
		});
		test('Should throw an error if only id is present on subtask property', () => {
			//Arrange
			const mockSubtaskOnlyId = {
				boardId: 1,
				subtask: {
					id: 1,
				},
			};
			const expectedError = {
				ok: false,
				statusCode: 400,
				message: 'Nothing to update',
			};
			//Act
			const { error, updateSubtaskDto } = UpdateSubtaskDto.create(mockSubtaskOnlyId);
			console.log(error);

			//Assert
			expect(updateSubtaskDto).toBe(undefined);
			expect(error).toEqual(expectedError);
		});
		//Board id
		test('Should throw id error if missing id or is not a string or is not a number on boardId property', () => {
			//Arrange
			const mockBoardIdMissingId = {
				subtask: {
					isCompleted: true,
					title: 'test',
				},
			};
			const mockBoardIdErrorType = {
				boardId: true,
				subtask: {
					id: true,
					isCompleted: true,
					title: 'test',
				},
			};
			const expectedError = {
				ok: false,
				statusCode: 400,
				message: 'Invalid ID',
			};

			//Act
			const { error: errorMissingId, updateSubtaskDto: dtoMissingId } = UpdateSubtaskDto.create(mockBoardIdMissingId);
			const { error: errorType, updateSubtaskDto: dtoErrorType } = UpdateSubtaskDto.create(mockBoardIdErrorType);
			console.log({
				errorMissingId,
				errorType,
			});

			//Assert
			expect(errorMissingId && errorType).toBeInstanceOf(CustomError);
			expect(errorType && errorMissingId).toEqual(expectedError);
			expect(dtoMissingId && dtoErrorType).toBe(undefined);
		});
		test('Should throw an error if only id is present on boardId property', () => {
			//Arrange
			const mockBoardIdOnlyId = {
				boardId: 1,
			};
			const expectedError = {
				ok: false,
				statusCode: 400,
				message: 'Nothing to update',
			};
			//Act
			const { error, updateSubtaskDto } = UpdateSubtaskDto.create(mockBoardIdOnlyId);

			//Assert
			expect(updateSubtaskDto).toBe(undefined);
			expect(error).toEqual(expectedError);
		});
	});
	describe('Success', () => {
		test('Should return a partial DTO', () => {
			//Arrange
			const mockPartialDto = {
				boardId: 1,
				subtask: {
					id: 1,
					isCompleted: true,
				},
			};
			//Act
			const { error, updateSubtaskDto } = UpdateSubtaskDto.create(mockPartialDto);

			//Assert
			expect(updateSubtaskDto).toEqual(mockPartialDto);
			expect(error).toBe(undefined);
		});
		test('Should return a full DTO', () => {
			//Arrange
			const mockPartialDto = {
				boardId: 1,
				subtask: {
					id: 1,
					isCompleted: true,
					title: 'test',
				},
			};
			//Act
			const { error, updateSubtaskDto } = UpdateSubtaskDto.create(mockPartialDto);
			console.log(updateSubtaskDto);
			//Assert
			expect(updateSubtaskDto).toEqual(mockPartialDto);
			expect(error).toBe(undefined);
		});
	});
});
