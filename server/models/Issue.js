
import mongoose from "mongoose";

const IssueSchema = new mongoose.Schema(
    {
        projectId: {type: mongoose.Schema.Types.ObjectId, ref: "Project",required: true,unique: false,},
        creatorId: {type: mongoose.Schema.Types.ObjectId, ref: "User",required: true,unique: false,},
        title: {type: String,required: true,unique: false,},
        desc: {type: String,required: true,unique: false,},
        tags: {type: [String],default: [],},
        status: {type: String,required: true,default: "Working",},
        members: {type: [mongoose.Schema.Types.ObjectId],ref: "User",default: [],},
    },
    { timestamps: true }
);

export default mongoose.model("Issue", IssueSchema);