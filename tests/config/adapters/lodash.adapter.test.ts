import { LodashAdapter as _ } from '@/config';
import { SubtaskEntity } from '@/domain';

describe('Test on lodash.adapter.ts', () => {
	const subtasks = {
		1: new SubtaskEntity('1', 'subtask1', true),
		2: new SubtaskEntity('2', 'subtask1', false),
		3: new SubtaskEntity('3', 'subtask1', false),
		4: new SubtaskEntity('4', 'subtask1', true),
		5: new SubtaskEntity('5', 'subtask1', false),
	};
	test('Should return differents elements between 2 list of object', () => {
		//Arrange
		const lisOfObject1 = [subtasks[1], subtasks[2], subtasks[3]];
		const lisOfObject2 = [subtasks[1], subtasks[2], subtasks[3], subtasks[4], subtasks[5]];
		const expectedResult = [subtasks[4], subtasks[5]];

		//Act
		const result = _.getDifferentElementsFromArray(lisOfObject2, lisOfObject1);

		//Assert
		expect(result).toEqual(expectedResult);
	});
	test('Should return differents elements between 2 list of object one of them empty', () => {
		//Arrange
		const lisOfObject1: any = [];
		const lisOfObject2 = [subtasks[1]];
		const expectedResult = [subtasks[1]];

		//Act
		const result = _.getDifferentElementsFromArray(lisOfObject2, lisOfObject1);

		//Assert
		expect(result).toEqual(expectedResult);
	});
});
