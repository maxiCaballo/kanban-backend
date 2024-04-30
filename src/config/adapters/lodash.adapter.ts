import _ from 'lodash';

type AnyObject = { [key: string]: any };

export class LodashAdapter {
	static areEquals(value: AnyObject, other: AnyObject, propertyToOmit?: string): boolean {
		let obj1 = this.cloneDeep(value);
		let obj2 = this.cloneDeep(other);

		if (propertyToOmit) {
			obj1 = _.omit(obj1, propertyToOmit);
			obj2 = _.omit(obj2, propertyToOmit);
		}

		return _.isEqual(obj1, obj2);
	}

	static cloneDeep(value: AnyObject) {
		return _.cloneDeep(value);
	}
}
