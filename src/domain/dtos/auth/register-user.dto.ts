import { object, string } from 'yup';
import { CustomError, IRegisterUserDto } from '@/domain';
import { YupAdapter } from '@/config';

export class RegisterUserDto implements IRegisterUserDto {
	private constructor(public name: string, public lastname: string, public email: string, public password: string) {}

	static create(data: { [key: string]: string }): { error?: CustomError; registerUserDto?: RegisterUserDto } {
		const { name, email, password, lastname } = data;

		const schema = object({
			name: string().required('Name is required').min(1, 'Min length of 1').max(20, 'Max length of 20'),
			lastname: string().required('Lastname is required').min(1, 'Min length of 1').max(20, 'Max length of 20'),
			email: string().required('Email is required').email('Email is not valid'),
			password: string().required('Password is required'),
		});

		const { errors: yupErrors, externalError } = YupAdapter.ValidateYupSchema(schema, {
			name,
			lastname,
			email,
			password,
		});

		//Yup error
		if (yupErrors && yupErrors.length >= 1) {
			return {
				error: CustomError.badRequest(yupErrors),
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
		const registerUserDto = new RegisterUserDto(name, lastname, email, String(password));
		return {
			registerUserDto,
		};
	}
}
