import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email"],
        lowercase: true,
    },
    name: {
        type: String,
        required: [true, "Full name is required"],
        minLength: [2, "Full name must be more than 2 characters"],
        maxLength: [50, "Full name must be less than 50 characters"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false,
    },
    userType: {
        type: String,
        default: "student",
    },
    gender: {
        type: String,
        required: [true, "Gender is required"],
    },
    course: {
        type: String,
        enum: ["undergraduate", "postgraduate", 'others']
    },
    credits: {
        type: String,
    },
    registrationDate: Date,
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    isVerified: Boolean,
    verifyTokenExpiry: Date,
    school: { type: String },
    company: { type: String }
})


const User = models.User || model("User", UserSchema);

export default User;