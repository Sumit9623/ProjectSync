import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
import Teams from "../models/Teams.js";
import Project from "../models/Project.js";
import otpGenerator from 'otp-generator';


export const addTeam = async (req, res, next) =>
{
    try {
        const newTeam = new Teams(req.body);
        const user = await User.findById(req.user.id);
        newTeam.creator = req.user.id;
        newTeam.members.push(req.user.id);
        console.log(user);
        user.teams.push(newTeam._id);
        await newTeam.save();
        await user.save();
        res.status(200).json(newTeam);
    } catch (err) {
        next(err);
    }
};


export const deleteTeam = async (req, res, next) => {
    try {
        const team = await Teams.findById(req.params.id);
        if (!team) return next(createError(404, "Team not found!"));
        const user = await User.findById(req.user.id);
        if(team && user && user._id.toString() == team.creator.toString())
        {
            const promise = new Promise((resolve,reject)=>{
                team.members.forEach(async (member)=>{
                  await User.findByIdAndUpdate(
                    member._id,
                    {$pull:{"teams":team._id}},
                    {new:true}
                  )
                })
                resolve();
              }
              )
              promise.then(async ()=>
              {
                await Teams.findByIdAndDelete(team._id,{new:true});
              }).then(()=>{
                  res.status(200).send("Team Deleted");
              })
        }
    } catch (err) {
        next(err);
    }
};

export const getTeam = async (req, res, next) => {
    try {
        const team = await Teams.findById(req.params.id)
        .populate('projects');
        if(team.members.includes(req.user.id))
        {
            await team.populate("members", "_id  name email img")
            res.status(200).json(team);
        }
        else res.status(403).send("You are not member of team")
    } catch (err) {
        next(err);
    }
};


export const updateTeam = async (req, res, next) => {
    try {
        const Team = await Teams.findById(req.params.id);
        if (!Team) return next(createError(404, "Teams not found!"));
        const user = await User.findById(req.user.id);
        if(Team && user && user._id.toString() == Team.creator.toString())
        {
            await Teams.findByIdAndUpdate(Team._id,req.body,{new:true});
            res.status(200).send("Team Updated");
        }
        else res.status(403).send("You are not allowed to update Project")

    } catch (err) {
        next(err);
    }
};

export const updateMembers = async (req, res, next) => {
    try {
        const Team = await Teams.findById(req.params.id);
        if (!Team) return next(createError(404, "Teams not found!"));
        for (let i = 0; i < Team.members.length; i++) {
            if (Team.members[i].id.toString() === req.user.id) {
                if (Team.members[i].access === "Owner" || Team.members[i].access === "Admin" || Team.members[i].access === "Editor") {
                    //update single member inside members array
                    await Teams.findByIdAndUpdate(
                        req.params.id,
                        {
                            $set: {
                                "members.$[elem].access": req.body.access,
                                "members.$[elem].role": req.body.role,
                            },
                        },
                        {
                            arrayFilters: [{ "elem.id": req.body.id }],
                            new: true,
                        }
                    );
                    res.status(200).json({ message: "Member has been updated..." });
                } else {
                    return next(createError(403, "You are not allowed to update this Teams!"));
                }
            }

        }
        return next(createError(403, "You can update only if you are a member of this Teams!"));
    }
    catch (err) {
        next(err);
    }
};

export const removeMember = async (req, res, next) => {
    try
    {
      const team = await Teams.findById(req.params.id);
      const user = await User.findById(req.body.id)
      if (!team) return next(createError(404, "Team not found!"));
      if (!user) return next(createError(404, "User not found!"));

      if(req.user.id.toString() == team.creator.toString())
      {
          if(team.creator.toString() == req.body.id.toString())
          {
            res.status(403).send("cannot remove admin of project");
          }
          else{
            user.teams = user.teams.filter((projectid)=>{ return projectid != req.params.id});
            team.members = team.members.filter((memberid)=>{return memberid != req.body.id});
            await user.save()
            await team.save();
            res.status(200).send("member removed");
          }
      }
      else return next(createError(403, "You are not allowed to remove member"));

    } catch (err) {
      next(err);
    }
};



export const addTeamProject = async (req, res, next) => {

    const user = await User.findById(req.user.id);;
    if (!user) {
        return next(createError(404, "User not found"));
    }

    const newProject = new Project(req.body);
    newProject.creator = req.user.id;
    newProject.members.push(req.user.id);
    try {
        const saveProject = await newProject.save();
        User.findByIdAndUpdate(user.id, { $push: { projects: saveProject._id } }, { new: true }, (err, doc) => {
            if (err) {
                next(err);
            }
        });
        Teams.findByIdAndUpdate(req.params.id, { $push: { projects: saveProject._id } }, { new: true }, (err, doc) => {
            if (err) {
                next(err);
            }
        });
        res.status(200).json(saveProject);
    } catch (err) {
        next(err);
    }
};



dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    },
    port: 465,
    host: 'smtp.gmail.com'
});

export const inviteTeamMember = async (req, res, next) => {
    //send mail using nodemailer

    console.log("I am in invite project");
    const user = await User.findById(req.user.id);
    if (!user) return next(createError(404, "User not found"));

    const team = await Teams.findById(req.params.id);
    if (!team) return next(createError(404, "Team not found!"));

    const token = jwt.sign({teamid : req.params.id, userid : req.body.id },process.env.JWT,{ expiresIn: "1d" });
    const link = `${process.env.URL}team/invite/verify?token=${token}`;

    const mailBody = `
            <div style="font-family: Poppins, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
        <img src="https://gdm-catalog-fmapi-prod.imgix.net/ProductLogo/833bf572-0ee5-47cc-8a27-5862fcab2d62.png" alt="VEXA Logo" style="display: block; margin: 0 auto; max-width: 200px; margin-bottom: 20px;">
        <div style="background-color: #FFF; border: 1px solid #e5e5e5; border-radius: 5px; box-shadow: 0px 3px 6px rgba(0,0,0,0.05);">
            <div style="background-color: #854CE6; border-top-left-radius: 5px; border-top-right-radius: 5px; padding: 20px 0;">
            <h2 style="font-size: 28px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 10px;">Invitation to Join Team: ${team.name}</h2>
            </div>
            <div style="padding: 30px;">
            <p style="font-size: 16px; color: #666; margin-bottom: 20px;">Dear ${req.body.name},</p>
            <p style="font-size: 16px; color: #666; margin-bottom: 20px;">You have been invited to join a team <b>${team.name}</b> on ProjectSync by <b>${user.name}</b>. Please follow the link below to accept the invitation:</p>
            <div style="text-align: center;">
                <a href=${link} style="background-color: #854CE6; color: #FFF; text-decoration: none; font-size: 16px; font-weight: 500; padding: 10px 30px; border-radius: 5px;">Accept Invitation</a>
            </div>
            <p style="font-size: 16px; color: #666; margin-top: 30px;">Best regards,</p>
            <p style="font-size: 16px; color: #666;">The ProjectSync Team</p>
            </div>
        </div>
        </div>
        `;
    if(user._id.toString() == team.creator.toString())
    {
      console.log("I am in invite member ");
      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: req.body.email,
        subject: `Invitation to join Team ${team.name}`,
        html: mailBody
      };
      transporter.sendMail(mailOptions, (err,data) => {
        if (err) {
          return next(err);
        } else {
          return res.status(200).json({ message: "Email sent successfully" });
        }
      });
    }
    else {
      return next(createError(403, "You are not allowed to invite members to this project!"));
    }

};

//verify invitation and add to team member
export const verifyInvitationTeam = async (req, res, next) => {
    try {
        console.log("I am in verify team invitation");
        const {token} = req.query;
        jwt.verify(token,process.env.JWT,async (err,obj)=>
        {
         if(err)
         {
            next(createError(403, "Invalid Link"))
         }
         else
         {
           const {userid, teamid} = obj;
           const user = await User.findById(userid);
           const team = await  Teams.findById(teamid);
           if(user && team)
           {
             if(!team.members.includes(userid))
             {
               team.members.push(userid);
               await team.save()
             }
             if(!user.teams.includes(teamid))
             {
               user.teams.push(teamid);
               await user.save();
               res.status(200).send("Member added");
             }
             else{
                res.status(200).send("Already a member of Team")
             }
           }
           else return next(createError(403, "Error while adding to Team"));
         }
        });
     } catch (err) {
       next(err);
     }
};


export const getTeamMembers = async (req, res, next) => {
    try {
        const team = await Teams.findById(req.params.id);
        if (!team) return next(createError(404, "Team not found!"));
        if(team.members.includes(req.user.id))
        {
            await team.populate("members","_id name email");
            res.status(200).json(team.members);
        }
        else res.status(403).send('You are not allowed see members')
    } catch (err) {
        next(err);
    }
}