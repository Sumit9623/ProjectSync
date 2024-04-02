
import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
    {
        title: {type: String,required: true,unique: false,},
        desc: {type: String,required: true,unique: false,},
        tags: {type: [String],default: [],},
        status: {type: String,required: true,default: "Working",},
        tasks: {type: [mongoose.Schema.Types.ObjectId],ref: "Task",default: [],},
        issues: {type: [mongoose.Schema.Types.ObjectId],ref: "Issue",default: [],},
        members: {
            type: [{
                _id: false,
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                role: {
                    type: String,
                    default:"member",
                    required: true,
                },
                access: {
                    type: String,
                    require: true,
                    default: "view",
                    unique: false,
                }
            }],
            required: true,
            default: [],
        },
    },
    { timestamps: true }
);

export default mongoose.model("Project", ProjectSchema);