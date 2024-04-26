import { AuthResponseUseCase, BoardEntity } from '@/domain';
import { seedData } from '@/data';
import request from 'supertest';
import { testServer } from '../../test-server';
import { mongoDbTest } from '../../helpers/mongo';
import { compareBoards } from '../../helpers';

describe('Test on board routes', () => {
	const boardsPath = '/api/boards';
	const authPath = '/api/auth';
	const mockBoard = BoardEntity.fromObject(seedData.boards[0]);
	const mockUser = {
		email: 'test1@google.com',
		password: '123456',
	};

	let mockLoggedUser: AuthResponseUseCase;

	beforeAll(async () => {
		await mongoDbTest.connect();
		testServer.start();

		await mongoDbTest.deleteAllData();
		await mongoDbTest.insertFakeData();

		//Login
		mockLoggedUser = JSON.parse((await request(testServer.app).post(`${authPath}/login`).send(mockUser)).text);
	});

	beforeEach(async () => {
		await mongoDbTest.deleteAllData();
		await mongoDbTest.insertFakeData();
	});

	afterAll(async () => {
		await mongoDbTest.deleteAllData();
		testServer.close();
		await mongoDbTest.disconnect();
	});

	//Tests
	test('Should get a board from mongo database ', async () => {
		//Arrange
		const expectedResponse = {
			ok: true,
			statusCode: 200,
			board: mockBoard,
		};

		//Act
		const { body: response } = await request(testServer.app)
			.get(`${boardsPath}/${mockBoard.id}`)
			.set('Authorization', `Bearer ${mockLoggedUser.token}`);

		const boardsAreEqual = compareBoards(mockBoard, response.board);

		//Assert
		expect(response.ok).toEqual(expectedResponse.ok);
		expect(response.statusCode).toEqual(expectedResponse.statusCode);
		expect(boardsAreEqual).toBe(true);
	});
});
