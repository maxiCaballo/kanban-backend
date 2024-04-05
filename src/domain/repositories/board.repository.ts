import { RegisterBoardDto, type Board } from '@/domain';
export abstract class BoardRepository {
	abstract create(registerBoardDto: RegisterBoardDto): Promise<Board>;
	/*
    read
    update
    delete
    */
}
