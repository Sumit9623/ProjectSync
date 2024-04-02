import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
    {
        name: {type: String,required: true,unique: false,},
        email: {type: String,required: true,unique: true,},
        password: {type: String,default: "",},
        projects: {type: [mongoose.Schema.Types.ObjectId],ref: "Project",default: [],},
        teams: {type: [mongoose.Schema.Types.ObjectId],ref: "Team",default: [],},
        tasks: {type: [mongoose.Schema.Types.ObjectId],ref: "Task",default: [],},
        issues: {type: [mongoose.Schema.Types.ObjectId],ref: "Issue",default: [],},
    },
    { timestamps: true }
);

UserSchema.methods.generateVerificationToken = function () {
    const user = this;
    const verificationToken = jwt.sign(
        { ID: user._id },
        process.env.USER_VERIFICATION_TOKEN_SECRET,
        { expiresIn: "7d" }
    );
    return verificationToken;
};

export default mongoose.model("User", UserSchema);