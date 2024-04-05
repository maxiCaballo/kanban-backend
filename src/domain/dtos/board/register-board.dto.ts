import { object, string } from 'yup';
import { CustomError, IBoardDto } from '@/domain';
import { YupAdapter } from '@/config';
import { Payload } from '@/config';

type TokenPayload = Payload;
interface CreateParams {
	tokenPayload: TokenPayload;
	[key: string]: string | TokenPayload;
}

export class RegisterBoardDto implements IBoardDto {
	private constructor(public name: string, public admin: string) {}

	static create(data: CreateParams): { error?: CustomError; registerUserDto?: RegisterBoardDto } {
		const {
			name,
			tokenPayload: { id: loggedUserId },
			admin = loggedUserId,
		} = data;

		const schema = object({
			name: string()
				.required('Name is required')
				.min(1, 'Board name must have min length of 1')
				.max(20, 'Board name must have max length of 20'),
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
		const registerUserDto = new RegisterBoardDto(name as string, admin as string);
		return {
			registerUserDto,
		};
	}
}
