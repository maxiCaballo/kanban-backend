export function deleteUndefinedProps<T extends object>(object: T): Partial<T> {
	const objectWithPartialsProps: Partial<T> = {};

	for (const [key, value] of Object.entries(object)) {
		if (value !== undefined) {
			objectWithPartialsProps[key as keyof T] = value;
		}
	}

	return objectWithPartialsProps;
}
