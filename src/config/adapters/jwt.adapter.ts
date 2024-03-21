import jwt from 'jsonwebtoken';
import { envs } from '@/config';

const JWT_SECRET_KEY = envs.JWT_SECRET_KEY;

export class JwtAdapter {
	static generateToken(payload: any, duration: string = '2h'): Promise<string | null> {
		return new Promise((resolve) => {
			jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: duration }, (err, token) => {
				if (err) return resolve(null);

				resolve(token!);
			});
		});
	}

	static validateToken<T>(token: string): Promise<T | null> {
		return new Promise((resolve, reject) => {
			jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
				if (err) {
					return resolve(null);
				}

				//Decoded = payload
				resolve(decoded as T);
			});
		});
	}
}
