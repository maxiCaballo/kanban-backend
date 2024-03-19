import { object, string } from 'yup';
import { CustomError } from '@/domain';
import { YupAdapter } from '@/config';

export class RegisterUserDto {
	private constructor(public name: string, public lastName: string, public email: string, public password: string) {}

	static create(data: { [key: string]: string }): { error?: CustomError; registerUserDto?: RegisterUserDto } {
		const { name, email, password, lastName } = data;

		const schema = object({
			name: string().required('Name is required').min(1, 'Min length of 1').max(20, 'Max length of 20'),
			lastName: string().required('Lastname is required').min(1, 'Min length of 1').max(20, 'Max length of 20'),
			email: string().required('Email is required').email('Email is not valid'),
			password: string().required('Password is required'),
		});

		const { errors, externalError } = YupAdapter.ValidateYupSchema(schema, { name, lastName, email, password });

		//Yup error
		if (errors && errors.length >= 1) {
			return {
				error: CustomError.badRequest(errors),
				registerUserDto: undefined,
			};
		}
		//External error
		if (externalError) {
			return {
				error: CustomError.internalServer(),
				registerUserDto: undefined,
			};
		}

		//Ok
		const registerUserDto = new RegisterUserDto(name, lastName, email, password);
		return {
			registerUserDto,
		};
	}
}
