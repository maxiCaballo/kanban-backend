import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

export class BcryptAdapter {
	static hash(password: string, rounds: number = 10) {
		const salt = genSaltSync(rounds); //Vueltas, por defecto 10
		return hashSync(password, salt);
	}
	static compare(password: string, hash: string) {
		return compareSync(password, hash);
	}
}
