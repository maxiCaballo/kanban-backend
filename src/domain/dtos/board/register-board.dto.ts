import { object, string } from 'yup';
import { CustomError, IRegisterBoardDto } from '@/domain';
import { YupAdapter } from '@/config';
import { Payload } from '@/config';

type TokenPayload = Payload;

interface CreateParams {
	tokenPayload: TokenPayload;
	[key: string]: string | TokenPayload;
}

export class RegisterBoardDto implements IRegisterBoardDto {
	private constructor(public name: string, public admin: string) {}

	static create(data: CreateParams): { error?: CustomError; registerBoardDto?: RegisterBoardDto } {
		const {
			name,
			tokenPayload: { id: loggedUserId },
		} = data;

		const schema = object({
			name: string()
				.required('Name is required')
				.min(1, 'Board name must have min length of 1')
				.max(20, 'Board name must have max length of 20'),
		});

		const { errors: yupErrors, externalError } = YupAdapter.ValidateYupSchema(schema, { name });

		//Yup error
		if (yupErrors && yupErrors.length >= 1) {
			return {
				error: CustomError.badRequest(yupErrors),
				registerBoardDto: undefined,
			};
		}
		//External error
		if (externalError) {
			return {
				error: CustomError.internalServer(),
				registerBoardDto: undefined,
			};
		}

		//Ok
		const registerBoardDto = new RegisterBoardDto(name as string, loggedUserId);
		return {
			registerBoardDto,
		};
	}
}

/*
	Personal verification 
	admin: string()
				.required('Admin id is required')
				.test('match', 'admin & tokenPayload.id must be the same', function (value) {
					const is_admin_id_equal_logged_user = value === loggedUserId;
					if (!is_admin_id_equal_logged_user) {
						throw this.createError({
							path: 'admin',
							message: 'Admin id & Logged user id must be the same',
						});
					}
					return is_admin_id_equal_logged_user;
				}),
*/
