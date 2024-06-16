import {
	UpdateTaskUseCase,
	GetBoardUseCase,
	UpdateSubtaskUseCase,
	CustomError,
	UpdateTaskDto,
	UpdateSubtaskDto,
	SubtaskEntity,
	TaskEntity,
} from '@/domain';
import { mongoDbTest } from '../../../helpers/mongo';
import { boardTest, adminBoardTest, taskTest } from '../../../helpers';
import {
	TaskRepositoryImpl,
	TaskDatasourceMongoImpl,
	BoardDatasourceMongoImpl,
	BoardRepositoryImpl,
	SubtaskRepositoryImpl,
	SubtaskDatasourceMongoImpl,
} from '@/infrastructure';
import { Types } from 'mongoose';

//Datasources
const boardMongoDatasourceImpl = new BoardDatasourceMongoImpl();
const taskMongoDatasourceImpl = new TaskDatasourceMongoImpl(boardMongoDatasourceImpl);
const subtaskMongoDatasource = new SubtaskDatasourceMongoImpl();

//Repositories
const taskRepositoryImpl = new TaskRepositoryImpl(taskMongoDatasourceImpl);
const boardRepositoryImpl = new BoardRepositoryImpl(boardMongoDatasourceImpl);
const subtaskRepositoryImpl = new SubtaskRepositoryImpl(subtaskMongoDatasource);

//Use cases
const getBoardUseCase = new GetBoardUseCase(boardRepositoryImpl);
const updateSubtaskUseCase = new UpdateSubtaskUseCase(boardRepositoryImpl, subtaskRepositoryImpl);
const updateTaskUseCase = new UpdateTaskUseCase(getBoardUseCase, taskRepositoryImpl, updateSubtaskUseCase); //Test

describe('Test on update-task.use-case.ts', () => {
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

	//Dto
	const { updateTaskDto } = UpdateTaskDto.create({
		boardId: String(boardTest.id),
		userId: adminBoardTest,
		task: { id: String(taskTest.id), title: 'Test' },
	});

	describe('Errors', () => {
		test('Should throw an error if board do not exist', async () => {
			//Arrange
			const invalidBoard = { ...updateTaskDto, boardId: new Types.ObjectId().toString() };
			const expectedError = CustomError.notFound('Board not found');

			try {
				//Act
				const { task } = await updateTaskUseCase.execute(invalidBoard);
				//Assert
				expect(task).toBeUndefined();
			} catch (error) {
				expect(error).toEqual(expectedError);
			}
		});
		test('Should throw an error if user is not an admin or member', async () => {
			//Arrange
			const invalidBoard = { ...updateTaskDto, userId: new Types.ObjectId().toString() };
			const expectedError = CustomError.unAuthorized();

			try {
				//Act
				const { task } = await updateTaskUseCase.execute(invalidBoard);
				//Assert
				expect(task).toBeUndefined();
			} catch (error) {
				expect(error).toEqual(expectedError);
			}
		});
		test('Should throw an error if task status do not exist on board', async () => {
			//Arrange
			const invalidColumnName = 'InvalidColumn';
			const invalidBoard = { ...updateTaskDto, task: { ...updateTaskDto!.task, status: invalidColumnName } };
			const expectedError = CustomError.badRequest(`Column ${invalidColumnName} do not exist on this board`);

			try {
				//Act
				const { task } = await updateTaskUseCase.execute(invalidBoard as UpdateTaskDto);
				//Assert
				expect(task).toBeUndefined();
			} catch (error) {
				expect(error).toEqual(expectedError);
			}
		});
		test('Should throw an error if some user of users is not a member or admin', async () => {
			//Arrange
			const invalidBoard = {
				...updateTaskDto,
				task: { ...updateTaskDto!.task, users: [new Types.ObjectId().toString()] },
			};
			const expectedError = CustomError.unAuthorized(`Invalid users`);

			try {
				//Act
				const { task } = await updateTaskUseCase.execute(invalidBoard as UpdateTaskDto);
				//Assert
				expect(task).toBeUndefined();
			} catch (error) {
				expect(error).toEqual(expectedError);
			}
		});
	});

	describe('Ok', () => {
		test('Should update completely a task', async () => {
			try {
				//Arrange
				const newUser = '65fb34bafd3f5c84bc4b1ed6';
				const newSubtask = SubtaskEntity.fromObject({ title: 'Subtask title test', id: '661ee7be53a30b492609cb62' });
				const { updateSubtaskDtos: subtaskDto } = UpdateSubtaskDto.formArray([
					{ boardId: String(boardTest.id), subtask: newSubtask },
				]);

				const taskDto = {
					id: taskTest.id,
					title: 'Title test',
					description: 'description test',
					users: [newUser],
					status: 'doing',
					subtasks: subtaskDto,
				};
				const expectedResult = TaskEntity.fromObject({
					...taskDto,
					users: [...taskTest.users, newUser],
					subtasks: [...taskTest.subtasks, newSubtask],
				});

				const dto = { ...updateTaskDto, task: taskDto };
				//Act
				const { task } = await updateTaskUseCase.execute(dto as UpdateTaskDto);
				expect(task).toEqual(expectedResult);
			} catch (error) {
				console.log(error);
				expect(error).toBeUndefined();
			}
		});
		test('Should update only subtask', async () => {
			try {
				//Arrange
				const newSubtask = SubtaskEntity.fromObject({ title: 'Subtask title test', id: '661ee7be53a30b492609cb62' });
				const { updateSubtaskDtos: subtaskDto } = UpdateSubtaskDto.formArray([
					{ boardId: String(boardTest.id), subtask: newSubtask },
				]);

				const taskDto = {
					id: taskTest.id,
					subtasks: subtaskDto,
				};
				const expectedResult = TaskEntity.fromObject({
					...taskTest,
					subtasks: [...taskTest.subtasks, newSubtask],
				});

				const dto = { ...updateTaskDto, task: taskDto };
				//Act
				const { task } = await updateTaskUseCase.execute(dto as UpdateTaskDto);
				expect(task).toEqual(expectedResult);
			} catch (error) {
				console.log(error);
				expect(error).toBeUndefined();
			}
		});
	});
});
