import { SubtaskRepository, UpdateSubtaskDto, Subtask } from '@/domain';

export class SubtaskRepositoryImpl implements SubtaskRepository {
	constructor(private readonly subtaskDatasource: SubtaskRepository) {}

	updateSubtask(subtask: UpdateSubtaskDto | Partial<UpdateSubtaskDto>): Promise<Subtask> {
		return this.subtaskDatasource.updateSubtask(subtask);
	}
}
