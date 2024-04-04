import { UserModel } from '@/data';
import { Request, Response } from 'express';

export class UserController {
	//DI - UserRepository
	constructor() {}

	getUsers = async (req: Request, res: Response) => {
		await UserModel.find()
			.then((users) =>
				res.json({
					users,
					token: req.body.token,
				}),
			)
			.catch((error) => error);
	};
	getUser = async (req: Request, res: Response) => {};
}
