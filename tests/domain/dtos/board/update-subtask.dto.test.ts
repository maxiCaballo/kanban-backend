import { UpdateSubtaskDto, CustomError } from '@/domain';

describe('Test on UpdateSubtaskDto', () => {
	describe('Errors', () => {
		test('Should throw id error if missing id or is not a string or is not a number', () => {
			//Arrange
			const mockSubtaskMissingId = {
				isCompleted: true,
				title: 'test',
			};
			const mockSubtaskErrorType = {
				id: true,
				isCompleted: true,
				title: 'test',
			};
			const mockSubtaskOnlyId = {
				id: 1,
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
		test('Should throw an error if only id is present ', () => {
			//Arrange
			const mockSubtaskOnlyId = {
				id: 1,
			};
			const expectedError = {
				ok: false,
				statusCode: 400,
				message: 'Nothing to update',
			};
			//Act
			const { error, updateSubtaskDto } = UpdateSubtaskDto.create(mockSubtaskOnlyId);
			//Assert
			expect(updateSubtaskDto).toBe(undefined);
			expect(error).toEqual(expectedError);
		});
	});
	describe('Success', () => {
		test('Should return a partial DTO', () => {
			//Arrange
			const mockPartialDto = {
				id: 1,
				isCompleted: true,
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
				id: 1,
				isCompleted: true,
				title: 'test',
			};
			//Act
			const { error, updateSubtaskDto } = UpdateSubtaskDto.create(mockPartialDto);

			//Assert
			expect(updateSubtaskDto).toEqual(mockPartialDto);
			expect(error).toBe(undefined);
		});
	});
});
