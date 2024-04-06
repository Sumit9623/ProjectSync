
import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
    {
        creator: {type: mongoose.Schema.Types.ObjectId,ref: "User",required:true},
        title: {type: String,required: true,unique: false,},
        desc: {type: String,required: true,unique: false,},
        tags: {type: [String],default: [],},
        status: {type: String,required: true,default: "Working",},
        tasks: {type: [mongoose.Schema.Types.ObjectId],ref: "Task",default: [],},
        issues: {type: [mongoose.Schema.Types.ObjectId],ref: "Issue",default: [],},
        members: {type: [mongoose.Schema.Types.ObjectId],ref: "User",default:[],},
    },
    { timestamps: true }
);

export default mongoose.model("Project", ProjectSchema);