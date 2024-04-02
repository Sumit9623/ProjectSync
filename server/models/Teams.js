import mongoose from "mongoose";
const TeamSchema = new mongoose.Schema(
    {
        name: {type: String,required: true,unique: false,},
        desc: {type: String,required: true,unique: false,},
        creatorId: {type: mongoose.Schema.Types.ObjectId, ref: "User",required: true,unique: false,},
        members: {
            type: [{
                _id: false,
                id: {type: mongoose.Schema.Types.ObjectId,ref: "User",required: true,},
                role: {type: String,default: "Member",required: true,},
                access: {type: String,require: true,default: "view",unique: false,}
            }],
            required: true,
            default: [],
        },
        projects:{type: [mongoose.Schema.Types.ObjectId],ref: "Project",default: [],},
    },
    { timestamps: true }
);

export default mongoose.model("Team", TeamSchema);