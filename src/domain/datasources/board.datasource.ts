import { RegisterBoardDto, type Board } from '@/domain';
export abstract class BoardDatasource {
	abstract create(registerBoardDto: RegisterBoardDto): Promise<Board>;
	/*
    read
    update
    delete
    */
}
