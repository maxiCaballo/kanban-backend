import { UpdateBoardDto, CustomError } from '@/domain';

describe('Test on UpdateBoardDto', () => {
	//Errors
	test('Should return id error as instanceOf CustomError if id is not defined', () => {
		//Arrange
		const object = {};
		const expectedError = {
			message: 'Invalid Id',
			ok: false,
			statusCode: 400,
		};

		//Act
		const { error, updateBoardDto } = UpdateBoardDto.create(object);

		//Assert
		expect(updateBoardDto).toBeFalsy();
		expect(error).toBeInstanceOf(CustomError);
		expect(error).toEqual(expectedError);
	});
	test('Should return id error as instanceOf CustomError if id is not a string and number', () => {
		//Arrange
		const object = { id: false };
		const expectedError = {
			message: 'Invalid Id',
			ok: false,
			statusCode: 400,
		};

		//Act
		const { error, updateBoardDto } = UpdateBoardDto.create(object);

		//Assert
		expect(updateBoardDto).toBeFalsy();
		expect(error).toBeInstanceOf(CustomError);
		expect(error).toEqual(expectedError);
	});

	//UpdateBoardDto
	test('Should return updateBoardDto with defined props', () => {
		//Arrange
		const object = { id: 1, name: 'New name', columns: [], shared: true, users: [], admin: '1234' };

		//Act
		const { error, updateBoardDto } = UpdateBoardDto.create(object);

		//Assert
		expect(error).toBeFalsy();
		expect(updateBoardDto).toEqual(object);
		expect(updateBoardDto).toBeInstanceOf(UpdateBoardDto);
	});
	test('Should return a partial updateBoardDto with defined props', () => {
		//Arrange
		const object = { id: 1, name: 'New name' };

		//Act
		const { error, updateBoardDto } = UpdateBoardDto.create(object);

		//Assert
		expect(error).toBeFalsy();
		expect(updateBoardDto).toEqual(object);
		expect(updateBoardDto).not.toBeInstanceOf(UpdateBoardDto);
	});
});
