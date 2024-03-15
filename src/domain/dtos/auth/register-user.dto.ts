import { object, string, ValidationError } from 'yup';
import { CustomError } from '@/domain';

export class RegisterUserDto {
	private constructor(public name: string, public email: string, public password: string) {}

	static create(data: { [key: string]: string }): { error?: CustomError; registerUserDto?: RegisterUserDto } {
		const { name, email, password } = data;
		const schema = object({
			name: string().required('Name is required').min(1, 'Min length of 1').max(20, 'Max length of 20'),
			email: string().required('Email is required').email('Email is not valid'),
			password: string().required('Password is required'),
		});

		try {
			schema.validateSync(
				{
					name,
					email,
					password,
				},
				{ abortEarly: false },
			);
		} catch (error) {
			if (error instanceof ValidationError) {
				return {
					error: CustomError.badRequest(error.errors),
					registerUserDto: undefined,
				};
			}

			return {
				error: CustomError.internalServer(),
				registerUserDto: undefined,
			};
		}

		const registerUserDto = new RegisterUserDto(name, email, password);
		return {
			registerUserDto,
		};
	}
}
