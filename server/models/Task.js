import mongoose from "mongoose";
const TaskSchema = new mongoose.Schema(
    {
        projectId: {type: mongoose.Schema.Types.ObjectId, ref: "Project",required: true,unique: false,},
        creator: {type: mongoose.Schema.Types.ObjectId, ref: "User",required: true,unique: false,},
        members: {type: [mongoose.Schema.Types.ObjectId],ref: "User",default: [],},
        title: {type: String,required: true,unique: false,},
        desc: {type: String,required: true,unique: false,},
        tags: {type: [String],default: [],},
        status: {type: String,required: true,default: "Working",},
        start_date: { type: Date, required: true, default: Date.now },
        end_date: { type: Date, required: true, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.model("Task", TaskSchema);