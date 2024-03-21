import { Schema, model } from 'mongoose';

//Todo: validar que al insertar usuarios al tablero y a las tareas no exista previamente, hacerlo con un "pre save".
//Todo: validar que al asignar un usuario a una tarea este se encuentre asignado al tablero

const subtaskSchema = new Schema({
	title: {
		type: String,
		required: [true, 'Subtask name is required'],
	},
	isCompleted: {
		type: Boolean,
		default: false,
	},
});

const taskSchema = new Schema(
	{
		title: {
			type: String,
			required: [true, 'Task title is required'],
		},
		description: String,
		subtasks: [subtaskSchema],
		users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		status: {
			type: String,
			required: [true, 'Task status is required'],
		},
	},
	{ timestamps: true },
);

const columnSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Column name is required'],
	},
	tasks: [taskSchema],
});

const boardSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Name is required'],
	},
	columns: [columnSchema],
	users: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	admin: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
});

boardSchema.set('toJSON', {
	virtuals: true,
	versionKey: false, //Elimina la propiedad __v
});

boardSchema.virtual('shared').get(function () {
	return this.users.length > 1;
});

export const BoardModel = model('Board', boardSchema);
