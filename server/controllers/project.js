dotenv.config();
import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
import Project from "../models/Project.js";
import Works from "../models/Task.js";
import otpGenerator from 'otp-generator';


export const addProject = async (req, res, next) =>
{
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(createError(404, "User not found"));
  }
  try {
    const newProject = {...req.body};
    newProject.creator = req.user.id;
    const pro = new Project(newProject)
    pro.members.push(req.user.id);
    const saveProject = await  pro.save();
    User.findByIdAndUpdate(user.id, { $push: { "projects": saveProject._id } }, { new: true });
    res.status(200).json(saveProject);
  } catch (err) {
    next(err);
  }
};


export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return next(createError(404, "Project not found!"));
    if(project.creator == req.user.id)
    {
      console.log(project);
      const promise = new Promise((resolve,reject)=>{
        project.members.forEach(async (member)=>{
          await User.findByIdAndUpdate(
            member._id,
            {$pull:{"projects":project._id}},
            {new:true}
          )
        })
        resolve();
      }
      )
      promise.then(async ()=>
      {
        await Project.findByIdAndDelete(project._id);
        console.log("Users project deleted");
      })
      res.status(200).send("Project Deleted");
    }
    else
    {
      return next(createError(404, "You are not allowed to delete project"));
    }
  } catch (err) {
    next(err);
  }
};

export const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate("members", "_id  name email");
    console.log("I am in getProject");
    if(!project) return next(createError(403, "Project not found"));
    var verified = false
    await Promise.all(
      project.members.map(async (Member) => {
        console.log(Member._id);
        console.log(req.user.id);
        if (Member._id == req.user.id) {
          verified = true
        }
      })
    )
      .then(() => {
        if (verified) {
          return res.status(200).json(project);
        } else {
          return next(createError(403, "You are not allowed to view this project!"));
        }
      });

  } catch (err) {
    next(err);
  }
};


export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return next(createError(404, "project not found!"));
    if(project.creator.toString()===req.user.id.toString())
    {
      console.log(project.creator);
      console.log(req.user.id);
      const updatedproject = await Project.findByIdAndUpdate(req.params.id,{$set: req.body,},{ new: true });
      res.status(200).json({ message: "Project has been updated..." });
    }
    else
    {
      return next(createError(403, "Only project creator can update project"));
    }
  } catch (err) {
    next(err);
  }
};


// export const addMember = async (req, res, next) => {
//   try
//   {
//     const project = await Project.findById(req.params.id);
//     const user = await User.findById(req.user.id);
//     console.log(project.creator);
//     console.log(user._id);
//     if(user && project && user._id.toString() == project.creator.toString())
//     {
//       if(!project.members.includes(req.body.member))
//       {
//         project.members.push(req.body.member);
//         await project.save()
//         res.status(200).send("Members Added project")
//       }
//       else res.status(200).send("already a Member")
//     }
//     else return next(createError(403, "You can update only if you are a member of this project!"));
//   }
//   catch (err) {
//     next(err);
//   }
// };

export const removeMember = async (req, res, next) => {
  try
  {
    const project = await Project.findById(req.params.id);
    const user = await User.findById(req.body.id)
    if (!project) return next(createError(404, "project not found!"));
    if (!user) return next(createError(404, "User not found!"));

    if(req.user.id.toString() == project.creator.toString())
    {
        if(project.creator.toString() == req.body.id.toString())
        {
          res.status(403).send("cannot remove admin of project");
        }
        else{
          user.projects = user.projects.filter((projectid)=>{ return projectid != req.params.id});
          project.members = project.members.filter((memberid)=>{return memberid != req.body.id});
          await user.save()
          await project.save();
          res.status(200).send("member removed");
        }
    }
    else return next(createError(403, "You are not allowed to remove member"));

  } catch (err) {
    next(err);
  }
};


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  },
  port: 465,
  host: 'smtp.gmail.com'
});

export const inviteProjectMember = async (req, res, next) => {

  const user = await User.findById(req.user.id);
  if (!user) return next(createError(404, "User not found"));

  const project = await Project.findById(req.params.id);
  if (!project) return next(createError(404, "Project not found!"));

  const token = jwt.sign({projectid : req.params.id, userid : req.body.id },process.env.JWT,{ expiresIn: "1d" });
  const link = `${process.env.URL}project/invite/verify?token=${token}`;

  const mailBody = `
      <div style="font-family: Poppins, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
        <img src="https://gdm-catalog-fmapi-prod.imgix.net/ProductLogo/833bf572-0ee5-47cc-8a27-5862fcab2d62.png" alt="ProjectSync Logo" style="display: block; margin: 0 auto; max-width: 200px; margin-bottom: 20px;">
        <h1 style="font-size: 22px; font-weight: 500; color: #854CE6; text-align: center; margin-bottom: 30px;">Invitation to join a ProjectSync Project</h1>
        <div style="background-color: #FFF; border: 1px solid #e5e5e5; border-radius: 5px; box-shadow: 0px 3px 6px rgba(0,0,0,0.05);">
            <div style="padding: 30px;">
                <p style="font-size: 16px; color: #666; margin-bottom: 20px;">Dear ${req.body.name},</p>
                <p style="font-size: 14px; color: #666; margin-bottom: 20px;">You've been invited to join a project called <b>${project.title}</b> on ProjectSync by <b>${user.name}</b>.</p>
                <p style="font-size: 14px; color: #666; margin-bottom: 20px;">To accept the invitation and join the project, please click on the button below:</p>
                <div style="text-align: center; margin-bottom: 30px;">
                    <a href=${link} style="background-color: #854CE6; color: #FFF; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">Accept Invitation</a>
                </div>
                <p style="font-size: 14px; color: #666; margin-bottom: 20px;">If you have any questions or issues with joining the project, please contact  <b>${user.name}</b> for assistance.</p>
            </div>
        </div>
        <br>
        <p style="font-size: 16px; color: #666; margin-top: 30px;">Best regards,</p>
        <p style="font-size: 16px; color: #666; margin-bottom: 20px; text-align: center;">Best regards,<br>The ProjectSync Team</p>
    </div>
    `
  if(user._id.toString() == project.creator.toString())
  {
    console.log("I am in invite member ");
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: req.body.email,
      subject: `Invitation to join project ${project.title}`,
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

//verify invitation and add to project member
export const verifyInvitation = async (req, res, next) =>
{
  try {
     const {token} = req.query;
     jwt.verify(token,process.env.JWT,async (err,obj)=>
     {
      if(err)
      {
        res.status(201).send("Invalid Lnk- Link Expired !" );
      }
      else
      {
        const {userid, projectid} = obj;
        const project = await  Project.findById(projectid);
        const user = await User.findById(userid);
        if(user && project)
        {
          if(!project.members.includes(userid))
          {
            project.members.push(userid);
            await project.save()
          }
          if(!user.projects.includes(projectid))
          {
            user.projects.push(projectid);
            await user.save();
            res.status(200).send("Member added");
          }
          else{
            res.status(200
            ).send("Already a member of Project")
         }
        }
        else return next(createError(403, "You can update only if you are a member of this project!"));
      }
     });
  } catch (err) {
    next(err);
  }
};


export const getProjectMembers = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate("members","_id name email");
    if (!project) return next(createError(404, "Project not found!"));
    if(project.members.includes(req.user.id))
    {
        await project.populate("members","_id name email");
        res.status(200).json(project.members);
    }
    else res.status(403).send('You are not allowed see members')
  } catch (err) {
    next(err);
  }
}

