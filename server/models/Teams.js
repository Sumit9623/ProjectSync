import mongoose from "mongoose";
const TeamSchema = new mongoose.Schema(
    {
        creator: {type: mongoose.Schema.Types.ObjectId,ref: "User",required:true},
        name: {type: String,required: true,unique: false,},
        desc: {type: String,required: true,unique: false,},
        members: {type: [mongoose.Schema.Types.ObjectId],ref: "User",default:[],},
        projects:{type: [mongoose.Schema.Types.ObjectId],ref: "Project",default: [],},
    },
    { timestamps: true }
);

export default mongoose.model("Team", TeamSchema);