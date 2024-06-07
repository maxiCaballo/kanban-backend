import { Subtask, UpdateSubtaskDto } from '@/domain';

export interface SubtaskResponse {
	subtask: Subtask;
}

export interface IUpdateSubtaskUseCase {
	execute(updateSubtaskDto: UpdateSubtaskDto, userId: string): Promise<SubtaskResponse>;
}
