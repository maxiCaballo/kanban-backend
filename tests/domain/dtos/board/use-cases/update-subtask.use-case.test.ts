import { mongoDbTest } from '../../../../helpers/mongo';
import { testServer } from '../../../../test-server';
import { CustomError, UpdateSubtaskDto, UpdateSubtaskUseCase } from '@/domain';
import { Types } from 'mongoose';
import { seedData } from '@/data';
import { BoardRepositoryImpl, BoardDatasourceMongoImpl } from '@/infrastructure';

const boardDatasourceMongoImpl = new BoardDatasourceMongoImpl();
const boardRepository = new BoardRepositoryImpl(boardDatasourceMongoImpl);

const updateSubtaskUseCase = new UpdateSubtaskUseCase(boardRepository);

describe('Test on update-subtask.use-case.ts', () => {
	beforeAll(async () => {
		await mongoDbTest.connect();
		testServer.start();
		await mongoDbTest.deleteAllData();
		await mongoDbTest.insertFakeData();
	});

	beforeEach(async () => {
		await mongoDbTest.deleteAllData();
		await mongoDbTest.insertFakeData();
	});

	afterAll(async () => {
		// await mongoDbTest.deleteAllData();
		testServer.close();
		await mongoDbTest.disconnect();
	});
	//Errors
	test('Should return an error if user is not an admin or board member', async () => {
		//Arrange
		const { _id: id, title, isCompleted } = seedData.boards[0].columns[0].tasks[0].subtasks[0];
		const mockUpdateSubtaskDto = {
			boardId: seedData.boards[0]._id,
			subtask: {
				id,
				title,
				isCompleted,
			},
		};
		const mockFakeUserId = new Types.ObjectId().toString();
		const expectedError = CustomError.unAuthorized();

		try {
			//Act
			await updateSubtaskUseCase.execute(mockUpdateSubtaskDto as UpdateSubtaskDto, mockFakeUserId);
		} catch (error) {
			//Assert
			expect(error).toEqual(expectedError);
		}
	});
	test('Should return an error if user is not assigned to subtask and is not an admin', async () => {
		//Arrange
		const { _id: id, title, isCompleted } = seedData.boards[0].columns[0].tasks[0].subtasks[0];
		const mockUpdateSubtaskDto = {
			boardId: seedData.boards[0]._id,
			subtask: {
				id,
				title,
				isCompleted,
			},
		};
		const mockMemberBoardButNotSubtask = '65fb34bafd3f5c84bc4b1ed6';
		const expectedError = CustomError.unAuthorized();

		try {
			//Act
			await updateSubtaskUseCase.execute(mockUpdateSubtaskDto as UpdateSubtaskDto, mockMemberBoardButNotSubtask);
		} catch (error) {
			//Assert
			expect(error).toEqual(expectedError);
		}
	});
	test('Should return an error if subtask do not exist on board', async () => {
		//Arrange
		const { _id: id, title, isCompleted } = seedData.boards[0].columns[0].tasks[0].subtasks[0];
		const mockUpdateSubtaskDto = {
			boardId: seedData.boards[0]._id,
			subtask: {
				id: new Types.ObjectId().toString(), //Random id
				title,
				isCompleted,
			},
		};
		const adminBoard = seedData.boards[0].admin;
		const expectedError = CustomError.notFound('Subtask not found');

		try {
			//Act
			await updateSubtaskUseCase.execute(mockUpdateSubtaskDto as UpdateSubtaskDto, adminBoard);
		} catch (error) {
			//Assert
			expect(error).toEqual(expectedError);
		}
	});
});
