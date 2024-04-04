import { object, string } from 'yup';
import { Column, CustomError, IBoardDto } from '@/domain';
import { YupAdapter } from '@/config';

export class RegisterBoardDto implements IBoardDto {
	private constructor(public name: string, public admin: string) {}

	static create(data: { [key: string]: string }): { error?: CustomError; registerUserDto?: RegisterBoardDto } {
		const { name, admin } = data;

		const schema = object({
			name: string().required('Name is required').min(1, 'Min length of 1').max(20, 'Max length of 20'),
			admin: string().required('Admin id is required'),
		});

		const { errors: yupErrors, externalError } = YupAdapter.ValidateYupSchema(schema, {
			name,
			admin,
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
		const registerUserDto = new RegisterBoardDto(name, admin);
		return {
			registerUserDto,
		};
	}
}
