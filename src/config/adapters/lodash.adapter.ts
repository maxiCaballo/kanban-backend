import _ from 'lodash';

type AnyObject = { [key: string]: any };

export class LodashAdapter {
	static areEquals(value: AnyObject, other: AnyObject, propertyToOmit?: string | string[]): boolean {
		let obj1 = this.cloneDeep(value);
		let obj2 = this.cloneDeep(other);

		if (propertyToOmit) {
			if (Array.isArray(propertyToOmit)) {
				propertyToOmit.forEach((key) => {
					obj1 = _.omit(obj1, key);
					obj2 = _.omit(obj2, key);
				});
			} else {
				obj1 = _.omit(obj1, propertyToOmit);
				obj2 = _.omit(obj2, propertyToOmit);
			}
		}

		return _.isEqual(obj1, obj2);
	}
	static listOfObjectsAreEquals(value: AnyObject[], other: AnyObject[], propertyToOmit?: string): boolean {
		for (const element of value) {
			const elementExist = other.find((elementToCompare) => this.areEquals(element, elementToCompare, propertyToOmit));

			if (!elementExist) {
				return false;
			}
		}
		return true;
	}
	static getDifferentElementsFromArray<T>(listWithDifferntElements: T[], other: T[]): T[] {
		const diferrentElements = _.differenceWith(listWithDifferntElements, other, _.isEqual);
		return diferrentElements;
	}

	static cloneDeep(value: AnyObject) {
		return _.cloneDeep(value);
	}
}
