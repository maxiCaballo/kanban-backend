import { Response, NextFunction, Request } from 'express';
import { CustomError } from '@/domain';
import { JwtAdapter, Payload } from '@/config';

export class JwtMiddleware {
	static async validate(req: Request, res: Response, next: NextFunction) {
		const authorization = req.header('Authorization'); //'Authorization: Bearer hola'

		if (!authorization || !authorization.startsWith('Bearer')) {
			const customError = CustomError.unAuthorized().formatError();
			return res.status(customError.statusCode).json(customError);
		}

		const token = authorization.split(' ').at(1) || ''; // ['Bearer','Token']

		try {
			const payload = await JwtAdapter.validateToken<Payload>(token);

			if (!payload) {
				const customError = CustomError.unAuthorized('Invalid token').formatError();
				return res.status(customError.statusCode).json(customError);
			}

			req.body.tokenPayload = payload; // { id: '65fca68dcdd3abc79f8ff2d3', iat: 1711056525, exp: 1711063725 }

			next();
		} catch (error) {
			const customError = CustomError.handleError(error);
			return res.status(customError.statusCode).json(customError);
		}
	}
}
