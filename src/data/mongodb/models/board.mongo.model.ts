import { Schema, model } from 'mongoose';

const subtaskSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Subtask name is required'],
	},
	isDone: {
		type: Boolean,
		default: false,
	},
});

const taskSchema = new Schema({
	title: {
		type: String,
		required: [true, 'Task title is required'],
	},
	description: {
		type: String,
		required: [true, 'Task description is required'],
	},
	subtasks: [subtaskSchema],
	users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

const columnSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Column name is required'],
	},
	tasks: [taskSchema],
});

export const boardSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Name is required'],
	},
	column: [columnSchema],
	//todo: shared = virtual
	shared: {
		type: Boolean,
		required: [true, 'Name is required'],
	},
	user: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	admin: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
});

boardSchema.set('toJSON', {
	virtuals: true,
	versionKey: false, //Elimina la propiedad __v
});

export const BoardModel = model('Board', boardSchema);
