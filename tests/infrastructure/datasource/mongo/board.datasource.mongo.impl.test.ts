import { mongoDbTest } from '../../../helpers/mongo';
import { BoardModel } from '@/data';
import { LodashAdapter as _ } from '@/config';
import { UpdateBoardDto, BoardEntity } from '@/domain';
import { BoardDatasourceMongoImpl } from '@/infrastructure';

describe('Test on BoardMongoDatasourceImpl', () => {
	const boardMongoDatasource = new BoardDatasourceMongoImpl();
	const mockBoardId = '65fba8a36ac699c0be9ffcd3';
	const mockAdminBoard = '65fb34bafd3f5c84bc4b1ed4';
	const mockBoard = {
		id: mockBoardId,
		name: 'New name',
		columns: [],
		shared: false,
		users: [],
		admin: mockAdminBoard,
	};

	//Update Dto
	const { updateBoardDto: mockUpdateBoardDto } = UpdateBoardDto.create(mockBoard);

	//Connect
	beforeAll(async () => {
		await mongoDbTest.connect();
	});
	//Clean database and insert test data
	beforeEach(async () => {
		await mongoDbTest.deleteAllData();
		await mongoDbTest.insertFakeData();
	});
	//Close connection
	afterAll(async () => {
		//Delete all
		// await mongoDbTest.deleteAllData();
		await mongoDbTest.disconnect();
	});

	describe('UPDATE BOARD', () => {
		test('Should update completely a board', async () => {
			//Arrange
			const boardDb = await BoardModel.findById(mockBoard.id);
			const mockBoardDb = BoardEntity.fromObject(boardDb!);

			//Act
			const mockBoardUpdated = await boardMongoDatasource.updateBoard(mockUpdateBoardDto as UpdateBoardDto);

			//Assert
			expect(mockBoard.id).toEqual(mockBoardDb.id);
			expect(mockBoard).not.toEqual(mockBoardDb);
			expect(mockBoardUpdated).toBeInstanceOf(BoardEntity);
			expect(mockBoardUpdated).toEqual(mockBoard);
		});
		test('Should update only columns a board', async () => {
			//Arrange
			// const boardDb = await BoardModel.findById(mockBoard.id);
			// const mockBoardDb = BoardEntity.fromObject(boardDb!);
			// //Act
			// const mockBoardUpdated = await boardMongoDatasource.updateBoard(mockUpdateBoardDto as UpdateBoardDto);
			// //Assert
			// expect(mockBoard.id).toEqual(mockBoardDb.id);
			// expect(mockBoard).not.toEqual(mockBoardDb);
			// expect(mockBoardUpdated).toBeInstanceOf(BoardEntity);
			// expect(mockBoardUpdated).toEqual(mockBoard);
		});
	});
});
