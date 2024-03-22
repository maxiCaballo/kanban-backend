import { object, string } from 'yup';
import { CustomError, ILoginDto } from '@/domain';
import { YupAdapter } from '@/config';

export class LoginDto implements ILoginDto {
	private constructor(public email: string, public password: string) {}

	static create(data: { [key: string]: string }): { error?: CustomError; loginDto?: LoginDto } {
		const { email, password } = data;

		const schema = object({
			email: string().required('Email is required').email('Email is not valid'),
			password: string().required('Password is required'),
		});

		const { errors: yupErrors, externalError } = YupAdapter.ValidateYupSchema(schema, { email, password });

		//Yup error
		if (yupErrors && yupErrors.length >= 1) {
			return {
				error: CustomError.badRequest(yupErrors),
				loginDto: undefined,
			};
		}
		//External error
		if (externalError) {
			return {
				error: CustomError.internalServer(),
				loginDto: undefined,
			};
		}

		//Ok
		const loginDto = new LoginDto(email, String(password));
		return {
			loginDto,
		};
	}
}
