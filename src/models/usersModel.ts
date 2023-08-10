import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    phoneNo: {
        type: String,
        required: true,
    },
    location:{
        type: String,
        required: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
});

export const usersModel = mongoose.model<any, any>("Users", userSchema);

