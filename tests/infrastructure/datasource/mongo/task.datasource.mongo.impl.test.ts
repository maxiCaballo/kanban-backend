import { mongoDbTest } from '../../../helpers/mongo';
import { BoardModel, seedData } from '@/data';
import { LodashAdapter as _ } from '@/config';
import {
	BoardEntity,
	CustomError,
	CreateTaskDto,
	TaskEntity,
	SubtaskEntity,
	DeleteTaskDto,
	UpdateTaskDto,
} from '@/domain';
import { TaskDatasourceMongoImpl, BoardDatasourceMongoImpl } from '@/infrastructure';
import { Types } from 'mongoose';

describe('Test on BoardMongoDatasourceImpl', () => {
	const boardMongoDataSourceMongoImpl = new BoardDatasourceMongoImpl();
	const taskDatasourceMongoImpl = new TaskDatasourceMongoImpl(boardMongoDataSourceMongoImpl);
	const mockBoardId = '65fba8a36ac699c0be9ffcd3';
	const mockAdmin = '65fb34bafd3f5c84bc4b1ed4';

	//Update Dto

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
	describe('CREATE TASK', () => {
		const columnName = seedData.boards[0].columns[0].name.toLowerCase();
		const taskUsers = ['65fb34bafd3f5c84bc4b1edd'];
		const mockTask = {
			title: 'task test',
			status: columnName,
		};

		const { createTaskDto } = CreateTaskDto.create({
			boardId: mockBoardId,
			userId: '65fb34bafd3f5c84bc4b1ed4',
			task: mockTask,
		});

		test('Should create a task with empty subtasks and users', async () => {
			//Arrange
			const expectedResult = TaskEntity.fromObject({ id: 1, ...createTaskDto!.task });

			try {
				const boardDb = await BoardModel.findById(mockBoardId);
				const tasksBeforeUpdate =
					BoardEntity.fromObject(boardDb!).columns.find((columns) => columns.name === columnName)?.tasks ?? [];
				//Act
				const updatedTasks = await taskDatasourceMongoImpl.createTask(createTaskDto as CreateTaskDto);
				const updatedTask = updatedTasks.find((task) => _.areEquals(task, expectedResult, 'id'));
				expectedResult.id = updatedTask!.id;
				//Assert
				expect(updatedTasks.length).toBeGreaterThan(tasksBeforeUpdate!.length);
				expect(updatedTask).toEqual(expectedResult);
				expect(updatedTask).toBeInstanceOf(TaskEntity);
			} catch (error) {
				expect(error).toBeUndefined();
			}
		});
		test('Should create a task with assigned users', async () => {
			//Arrange
			const expectedResult = TaskEntity.fromObject({
				id: '1',
				title: mockTask.title,
				status: mockTask.status,
				users: taskUsers,
				description: '',
				subtasks: [],
			});
			const { createTaskDto: adaptedCreateTaskDto } = CreateTaskDto.create({
				boardId: mockBoardId,
				userId: '65fb34bafd3f5c84bc4b1ed4',
				task: { ...mockTask, users: taskUsers },
			});

			try {
				const boardDb = await BoardModel.findById(mockBoardId);
				const tasksBeforeUpdate =
					BoardEntity.fromObject(boardDb!).columns.find((columns) => columns.name === columnName)?.tasks ?? [];

				//Act
				const updatedTasks = await taskDatasourceMongoImpl.createTask(adaptedCreateTaskDto as CreateTaskDto);
				console.log(updatedTasks);

				const updatedTask = updatedTasks.find((task) => _.areEquals(task, expectedResult, 'id'));
				expectedResult.id = updatedTask!.id;

				//Assert
				expect(updatedTasks.length).toBeGreaterThan(tasksBeforeUpdate!.length);
				expect(updatedTask).toEqual(expectedResult);
				expect(updatedTask).toBeInstanceOf(TaskEntity);
			} catch (error) {
				expect(error).toBeUndefined();
			}
		});
		test('Should create a task with subtasks', async () => {
			//Arrange
			const subtask = SubtaskEntity.fromObject({ id: 1, title: 'Subtask test', isCompleted: false });
			const subtasks = [subtask];
			const expectedResult = TaskEntity.fromObject({
				id: '1',
				title: mockTask.title,
				status: mockTask.status,
				users: [],
				description: '',
				subtasks,
			});

			const adaptedCreateTaskDto = { ...createTaskDto };
			adaptedCreateTaskDto.task!.subtasks = subtasks;

			try {
				const boardDb = await BoardModel.findById(mockBoardId);
				const tasksBeforeUpdate =
					BoardEntity.fromObject(boardDb!).columns.find((columns) => columns.name === columnName)?.tasks ?? [];

				//Act
				const updatedTasks = await taskDatasourceMongoImpl.createTask(adaptedCreateTaskDto as CreateTaskDto);

				const updatedTask = updatedTasks.find((task) => _.areEquals(task, expectedResult, ['id', 'subtasks']));
				expectedResult.id = updatedTask!.id;

				const { subtasks } = updatedTask!;
				const updatedSubtask = subtasks.find((subtaskToCompare) => _.areEquals(subtaskToCompare, subtask, 'id'));
				expectedResult.subtasks[0].id = updatedSubtask!.id;

				//Assert
				expect(updatedTasks.length).toBeGreaterThan(tasksBeforeUpdate!.length);
				expect(updatedTask).toEqual(expectedResult);
				expect(updatedTask).toBeInstanceOf(TaskEntity);
			} catch (error) {
				expect(error).toBeUndefined();
			}
		});
		//Errors
		test('Should throw an error if board ID is not a mongo ID', async () => {
			//Arrange
			const dtoInvalidMongoID = {
				boardId: '1',
				userId: '65fb34bafd3f5c84bc4b1ed4',
				task: mockTask,
			};
			const expectedResult = CustomError.badRequest('Invalid Mongo ID');

			try {
				//Act
				await taskDatasourceMongoImpl.createTask(dtoInvalidMongoID as CreateTaskDto);
				expect(true).toBeFalsy();
			} catch (error) {
				//Assert

				expect(error).toEqual(expectedResult);
				expect(error).toBeInstanceOf(CustomError);
			}
		});
	});
	describe('DELETE TASK', () => {
		test('Should DELETE a task', async () => {
			//Arrange
			const { _id: taskId } = seedData.boards[0].columns[0].tasks[0];
			const taskToDelete = TaskEntity.fromObject(seedData.boards[0].columns[0].tasks[0]);

			const { deleteTaskDto } = DeleteTaskDto.create({
				boardId: mockBoardId,
				userId: '65fb34bafd3f5c84bc4b1ed4',
				taskId: taskId,
			});
			try {
				const boardDbBeforeDelete = await BoardModel.findById(mockBoardId);
				const boardEntityBeforeDelete = BoardEntity.fromObject(boardDbBeforeDelete!);
				const taskBeforeDelete = BoardEntity.getTaskById(boardEntityBeforeDelete, taskId);

				//Act
				const deletedTask = await taskDatasourceMongoImpl.deleteTask(deleteTaskDto!.taskId, deleteTaskDto!.boardId);

				const boardDbAfterDelete = await BoardModel.findById(mockBoardId);
				const boardEntityAfterDelete = BoardEntity.fromObject(boardDbAfterDelete!);
				const taskAfterDelete = BoardEntity.getTaskById(boardEntityAfterDelete, taskId);

				//Assert
				expect(deletedTask).toEqual(taskToDelete);
				expect(deletedTask).toBeInstanceOf(TaskEntity);
				expect(taskBeforeDelete).toEqual(taskToDelete);
				expect(taskAfterDelete).toBeUndefined();
			} catch (error) {
				expect(error).toBeUndefined();
			}
		});
	});
	describe('UPDATE TASK', () => {
		const mockTask = {
			id: '661ee7be53a30b492609cb61',
			title: 'hello world',
			description: 'update description',
			users: [new Types.ObjectId().toString()],
			status: 'update status',
		};
		const mockTaskDefault = TaskEntity.fromObject(seedData.boards[0].columns[0].tasks[0]);
		describe('Ok', () => {
			test('Should UPDATE only task title', async () => {
				//Arrange
				const { updateTaskDto } = UpdateTaskDto.create({
					boardId: mockBoardId,
					userId: mockAdmin,
					task: {
						id: mockTask.id,
						title: mockTask.title,
					},
				});
				const expectedResult = { ...mockTaskDefault, title: mockTask.title };
				try {
					//Act
					const updatedTask = await taskDatasourceMongoImpl.updateTask(updateTaskDto as UpdateTaskDto);

					//Assert
					expect(updatedTask).toEqual(expectedResult);
				} catch (error) {
					expect(error).toBeUndefined();
				}
			});
			test('Should UPDATE only task description', async () => {
				//Arrange
				const { updateTaskDto } = UpdateTaskDto.create({
					boardId: mockBoardId,
					userId: mockAdmin,
					task: {
						id: mockTask.id,
						description: mockTask.description,
					},
				});
				const expectedResult = { ...mockTaskDefault, description: mockTask.description };
				try {
					//Act
					const updatedTask = await taskDatasourceMongoImpl.updateTask(updateTaskDto as UpdateTaskDto);

					//Assert
					expect(updatedTask).toEqual(expectedResult);
				} catch (error) {
					expect(error).toBeUndefined();
				}
			});
			test('Should UPDATE only task status', async () => {
				//Arrange
				const { updateTaskDto } = UpdateTaskDto.create({
					boardId: mockBoardId,
					userId: mockAdmin,
					task: {
						id: mockTask.id,
						status: mockTask.status,
					},
				});
				const expectedResult = { ...mockTaskDefault, status: mockTask.status };
				try {
					//Act
					const updatedTask = await taskDatasourceMongoImpl.updateTask(updateTaskDto as UpdateTaskDto);

					//Assert
					expect(updatedTask).toEqual(expectedResult);
				} catch (error) {
					expect(error).toBeUndefined();
				}
			});
			test('Should UPDATE only task users with the user to push do not exist', async () => {
				//Arrange
				const { updateTaskDto } = UpdateTaskDto.create({
					boardId: mockBoardId,
					userId: mockAdmin,
					task: {
						id: mockTask.id,
						users: mockTask.users,
					},
				});

				const expectedResult = { ...mockTaskDefault, users: [...mockTaskDefault.users, ...mockTask.users] };
				try {
					//Act
					const updatedTask = await taskDatasourceMongoImpl.updateTask(updateTaskDto as UpdateTaskDto);

					//Assert
					expect(updatedTask).toEqual(expectedResult);
				} catch (error) {
					expect(error).toBeUndefined();
				}
			});
			test('Should not UPDATE task users if user to push already exist on task user', async () => {
				//Arrange
				const { updateTaskDto } = UpdateTaskDto.create({
					boardId: mockBoardId,
					userId: mockAdmin,
					task: {
						id: mockTask.id,
						users: ['65fb34bafd3f5c84bc4b1ed4'],
					},
				});

				const expectedResult = { ...mockTaskDefault, users: [...mockTaskDefault.users] };
				try {
					//Act
					const updatedTask = await taskDatasourceMongoImpl.updateTask(updateTaskDto as UpdateTaskDto);

					//Assert
					expect(updatedTask).toEqual(expectedResult);
				} catch (error) {
					expect(error).toBeUndefined();
				}
			});
			test(`Should move task from 'todo' column to 'doing' column`, async () => {
				//Arrange
				const newColumn = '661ee7be53a30b492609cb6d';
				const taskId = mockTaskDefault.id;

				try {
					//Act
					const updatedTask = await taskDatasourceMongoImpl.updateColumnTask(taskId, mockBoardId, newColumn);
					console.log(updatedTask);

					//Assert
					// expect(updatedTask).toEqual(expectedResult);
				} catch (error) {
					expect(error).toBeUndefined();
				}
			});
		});
		describe('Error', () => {
			test('Should not UPDATE a task if board ID is not a valid ID', async () => {
				//Arrange
				const updateTaskDto = {
					boardId: mockBoardId + '1',
					userId: mockAdmin,
					task: {
						id: mockTask.id,
						title: mockTask.title,
					},
				};
				const expectedResult = CustomError.badRequest('Invalid Mongo ID');
				try {
					//Act
					const updatedTask = await taskDatasourceMongoImpl.updateTask(updateTaskDto as UpdateTaskDto);

					//Assert
					expect(updatedTask).toBeUndefined();
				} catch (error) {
					expect(error).toEqual(expectedResult);
				}
			});
			test('Should not UPDATE a task if task ID is not a valid ID', async () => {
				//Arrange
				const updateTaskDto = {
					boardId: mockBoardId,
					userId: mockAdmin,
					task: {
						id: mockTask.id + '1',
						title: mockTask.title,
					},
				};
				const expectedResult = CustomError.badRequest('Invalid Mongo ID');
				try {
					//Act
					const updatedTask = await taskDatasourceMongoImpl.updateTask(updateTaskDto as UpdateTaskDto);

					//Assert
					expect(updatedTask).toBeUndefined();
				} catch (error) {
					expect(error).toEqual(expectedResult);
				}
			});
			test('Should not UPDATE a task if board do not exist', async () => {
				//Arrange
				const inexistentBoard = new Types.ObjectId().toString();
				const updateTaskDto = {
					boardId: inexistentBoard,
					userId: mockAdmin,
					task: {
						id: mockTask.id,
						title: mockTask.title,
					},
				};
				const expectedResult = CustomError.notFound('Board not found');
				try {
					//Act
					const updatedTask = await taskDatasourceMongoImpl.updateTask(updateTaskDto as UpdateTaskDto);

					//Assert
					expect(updatedTask).toBeUndefined();
				} catch (error) {
					expect(error).toEqual(expectedResult);
				}
			});
			test('Should not UPDATE a task if task do not exist', async () => {
				//Arrange
				const inexistentTask = new Types.ObjectId().toString();

				const updateTaskDto = {
					boardId: mockBoardId,
					userId: mockAdmin,
					task: {
						id: inexistentTask,
						title: mockTask.title,
					},
				};
				const expectedResult = CustomError.notFound('Task not found');
				try {
					//Act
					const updatedTask = await taskDatasourceMongoImpl.updateTask(updateTaskDto as UpdateTaskDto);

					//Assert
					expect(updatedTask).toBeUndefined();
				} catch (error) {
					expect(error).toEqual(expectedResult);
				}
			});
		});
	});
});
