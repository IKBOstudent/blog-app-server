import mongoose from 'mongoose';

export interface IUserDocument extends mongoose.Document {
    fullName: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
    _doc?: any;
}

const UserSchema = new mongoose.Schema<IUserDocument>(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('User', UserSchema);
