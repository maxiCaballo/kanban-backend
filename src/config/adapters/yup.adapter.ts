import { Schema, ValidationError } from 'yup';

type ObjectType = Record<string, any>;

export class YupAdapter {
	static ValidateYupSchema<T extends ObjectType>(
		schema: Schema<T>,
		objectToValidate: T,
	): { ok: boolean; errors?: string[]; externalError?: boolean } {
		try {
			schema.validateSync(objectToValidate, { abortEarly: false });
		} catch (error) {
			if (error instanceof ValidationError) {
				return {
					ok: false,
					errors: error.errors,
				};
			}
			console.log(error);

			return {
				ok: false,
				externalError: true,
			};
		}

		return {
			ok: true,
		};
	}
}
