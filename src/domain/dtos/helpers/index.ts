import { MongoDb } from '@/data';

export function deleteUndefinedProps<T extends object>(object: T): Partial<T> {
	const objectWithPartialsProps: Partial<T> = {};

	for (const [key, value] of Object.entries(object)) {
		if (value !== undefined) {
			objectWithPartialsProps[key as keyof T] = value;
		}
	}

	return objectWithPartialsProps;
}

export function isValidId(id: any): boolean {
	if (typeof id !== 'string' && typeof id !== 'number') return false;

	if (!MongoDb.isValidMongoId(id)) return false;

	return true;
}
