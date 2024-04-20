dotenv.config();
import mongoose from "mongoose";
import User from "../models/User.js";
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import Issue from "../models/Issue.js"

import bcrypt from "bcrypt";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from 'dotenv';

export const addIssue = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const project = await Project.findById(req.params.id);
  if (!user) return next(createError(404, "User not found"));
  if (!project) return next(createError(404, "Project not found"));
  try
  {
    if(project.members.includes(user._id))
    {
      const newIssue = new Issue(req.body);
      newIssue.creator = req.user.id;
      newIssue.projectId = req.params.id;
      await newIssue.save();

      await User.findByIdAndUpdate(req.user.id, { $push: { "issues": newIssue._id } }, { new: true });
      await Project.findByIdAndUpdate(req.params.id, { $push: { "issues": newIssue._id } }, { new: true });
      res.status(200).json(newIssue);
    }
    else
    {
      return next(createError(404, "You are not member of project"));
    }
  } catch (err) {
    next(err);
  }
};

export const getIssue = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(createError(404, "User not found"));
  const issue = await Issue.findById(req.params.id);
  if (!issue) return next(createError(404, "taks not found"));
  const project = await Project.findById(issue.projectId);
  if (!project) return next(createError(404, "Project not found"));
  try {
    if(issue && user && project.members.includes(req.user.id))
    {
        res.status(200).json(issue);
    }
    else res.status(403).send("You are not allowed to see Issue");

  } catch (err) {
    next(err);
  }
};

export const updateIssue = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(createError(404, "User not found"));
  const issue = await Issue.findById(req.params.id);
  if (!issue) return next(createError(404, "Issue not found"));
  try {
    if(user._id.toString() == Issue.creator.toString())
    {
      await Issue.findByIdAndUpdate(issue._id,{...req.body},{new:true});
      res.status(200).send("Issue Updated")
    }
    else res.status(403).send("You can not update Issue")
  } catch (err) {
    next(err);
  }
};

export const deleteIssue = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(createError(404, "User not found"));
  const issue = await Issue.findById(req.params.id);
  if (!issue) return next(createError(404, "Issue not found"));
  const project = await Project.findById(issue.projectId);
  if (!project) return next(createError(404, "Project not found"));
  try {
    if(issue.creator.toString() == req.user.id.toString())
    {
      const promise = new Promise(async (resolve,reject)=>{
        issue.members.forEach(async (member)=>{
          await User.findByIdAndUpdate(
            member._id,
            {$pull:{"issues":issue._id}},
            {new:true}
          )
        })
        await Project.findByIdAndUpdate(
          issue.projectId,
          {$pull:{"issues":issue._id}},
          {new:true}
        )
        await User.findByIdAndUpdate(
          issue.creator,
          {$pull:{"issues":issue._id}},
          {new:true}
        )
        resolve();
      }
      )
      promise.then(async ()=>
      {
        await Issue.findByIdAndDelete(issue._id,{new:true});
      }).then(()=>{
          res.status(200).send("Issue Deleted");
      })
    }
    else res.status(403).send("You can not Delete Issue")

  } catch (err) {
    next(err);
  }
};
