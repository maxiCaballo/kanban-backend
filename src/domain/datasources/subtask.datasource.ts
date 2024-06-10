import { UpdateSubtaskDto, Subtask } from '@/domain';

export abstract class SubtaskDatasource {
	abstract updateSubtask(subtask: UpdateSubtaskDto | Partial<UpdateSubtaskDto>): Promise<Subtask>;
}