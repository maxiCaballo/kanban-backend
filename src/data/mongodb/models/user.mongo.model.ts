import { Schema, model } from 'mongoose';
import { BcryptAdapter } from '@/config';

const userSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Name is required'],
	},
	lastname: {
		type: String,
		required: [true, 'Name is required'],
	},
	email: {
		type: String,
		required: [true, 'Email is required'],
		unique: true,
	},
	password: {
		type: String,
		required: [true, 'Password is required'],
	},
	boards: [{ type: Schema.Types.ObjectId, ref: 'Board' }],
});

userSchema.set('toJSON', {
	virtuals: true,
	versionKey: false, //Elimina la propiedad __v
	transform: function (doc, ret, options) {
		delete ret._id;
		delete ret.password;
	},
});

//Middlewares
userSchema.pre('save', async function (next) {
	let user = this;

	if (!user.isModified('password')) return next();

	user.password = BcryptAdapter.hash(user.password);
	next();
});

export const UserModel = model('User', userSchema);
