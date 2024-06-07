import { UpdateSubtaskDto, Subtask } from '@/domain';

export abstract class SubtaskRepository {
	abstract updateSubtask(subtask: UpdateSubtaskDto | Partial<UpdateSubtaskDto>): Promise<Subtask>;
}
