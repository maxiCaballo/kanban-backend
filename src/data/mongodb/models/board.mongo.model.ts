import { Schema, model } from 'mongoose';
import { SubtaskSchema, TaskSchema, ColumnSchema, BoardSchema, UserModel } from '@/data';

const subtaskSchema = new Schema<SubtaskSchema>({
	title: {
		type: String,
		required: [true, 'Subtask name is required'],
	},
	isCompleted: {
		type: Boolean,
		default: false,
	},
});

const taskSchema = new Schema<TaskSchema>(
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

const columnSchema = new Schema<ColumnSchema>({
	name: {
		type: String,
		required: [true, 'Column name is required'],
	},
	tasks: [taskSchema],
});

const boardSchema = new Schema<BoardSchema>({
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

//Configurations
boardSchema.set('toJSON', {
	virtuals: true,
	versionKey: false, //Elimina la propiedad __v
});

boardSchema.virtual('shared').get(function () {
	return this.users.length > 1;
});

//Middlewares
//Todo: validar que al insertar usuarios al tablero y a las tareas no exista previamente, hacerlo con un "pre save".
//Todo: validar que al asignar un usuario a una tarea este se encuentre asignado al tablero.
//Todo: validar que al borrar un tablero tambien se borre ese tablero del usuario con el post('delete')

//After the board is created I save that board in the user, the $addToSet guarantees me that that board does not exist.
//If it exists it does nothing and if it does not exist it adds it.
boardSchema.post('save', async function (doc) {
	await UserModel.updateOne({ _id: doc.admin }, { $addToSet: { boards: doc._id } });
});

export const BoardModel = model('Board', boardSchema);
