import { SubtaskRepository, UpdateSubtaskDto, Subtask, DeleteSubtaskDto } from '@/domain';

export class SubtaskRepositoryImpl implements SubtaskRepository {
	constructor(private readonly subtaskDatasource: SubtaskRepository) {}

	updateSubtask(subtask: UpdateSubtaskDto | Partial<UpdateSubtaskDto>): Promise<Subtask> {
		return this.subtaskDatasource.updateSubtask(subtask);
	}
	deleteSubtask(subtask: DeleteSubtaskDto): Promise<Subtask> {
		return this.subtaskDatasource.deleteSubtask(subtask);
	}
}
