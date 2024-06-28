import { UpdateSubtaskDto, Subtask, DeleteSubtaskDto } from '@/domain';

export abstract class SubtaskDatasource {
	abstract updateSubtask(subtask: UpdateSubtaskDto | Partial<UpdateSubtaskDto>): Promise<Subtask>;
	abstract deleteSubtask(subtask: DeleteSubtaskDto): Promise<Subtask>;
}
