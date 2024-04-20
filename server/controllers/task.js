dotenv.config();
import mongoose from "mongoose";
import User from "../models/User.js";
import Task from "../models/Task.js";
import Project from "../models/Project.js";

import bcrypt from "bcrypt";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from 'dotenv';


export const addTask = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const project = await Project.findById(req.params.id);
  if (!user) return next(createError(404, "User not found"));
  if (!project) return next(createError(404, "Project not found"));
  try
  {
    if(project.members.includes(user._id))
    {
      const newtask = new Task(req.body);
      newtask.creator = req.user.id;
      newtask.projectId = req.params.id;
      await newtask.save();

      // start date and deadline are defult to date.now
      // add this value from frontend

      await User.findByIdAndUpdate(user.id, { $push: { "tasks": newtask._id } }, { new: true });
      await Project.findByIdAndUpdate(req.params.id, { $push: { "tasks": newtask._id } }, { new: true });
      res.status(200).json(newtask);
    }
  } catch (err) {
    next(err);
  }
};

export const getTask = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(createError(404, "User not found"));
  const task = await Task.findById(req.params.id);
  if (!task) return next(createError(404, "taks not found"));
  const project = await Project.findById(task.projectId);
  if (!project) return next(createError(404, "Project not found"));
  try {
    if(task && user && project.members.includes(req.user.id))
    {
        res.status(200).json(task);
    }
    else res.status(403).send("You are not allowed to see task")

  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(createError(404, "User not found"));
  const task = await Task.findById(req.params.id);
  if (!task) return next(createError(404, "Task not found"));
  try {
    if(user._id.toString() == task.creator.toString())
    {
      await Task.findByIdAndUpdate(task._id,{...req.body},{new:true});
      res.status(200).send("Task Updated")
    }
    else res.status(403).send("You can not update Task")
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(createError(404, "User not found"));
  const task = await Task.findById(req.params.id);
  if (!task) return next(createError(404, "Task not found"));
  const project = await Project.findById(task.projectId);
  if (!project) return next(createError(404, "Task not found"));
  try {
    if(task.creator.toString() == req.user.id.toString())
    {
      const promise = new Promise(async (resolve,reject)=>{
        task.members.forEach(async (member)=>{
          await User.findByIdAndUpdate(
            member._id,
            {$pull:{"tasks":task._id}},
            {new:true}
          )
        })
        await Project.findByIdAndUpdate(
          task.projectId,
          {$pull:{"tasks":task._id}},
          {new:true}
        )
        await User.findByIdAndUpdate(
          task.creator,
          {$pull:{"tasks":task._id}},
          {new:true}
        )

        resolve();
      }
      )
      promise.then(async ()=>
      {
        await Task.findByIdAndDelete(task._id,{new:true});
      }).then(()=>{
          res.status(200).send("Task Deleted");
      })
    }
    else res.status(403).send("You can not Delete Task")

  } catch (err) {
    next(err);
  }
};

export const addTaskMember = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(createError(404, "User not found"));
  const task = await Task.findById(req.params.id);
  if(!task) return next(createError(404, "Task not found"));
  try
  {
    console.log(user._id,task.creator);
    if(user._id.toString() == task.creator.toString())
    {
      const user1 = await User.findById(req.body.id);
      if(user1)
      {
        if(!task.members.includes(req.body.id)) task.members.push(req.body.id);
        if(!user1.tasks.includes(task._id)) user1.tasks.push(task._id);
        await task.save();
        await user1.save();
        res.status(200).send("Member Added");
      }
      else return next(createError(404, "User not found"));
    }
    else res.status(403).send("You are not allowed to add member")
  } catch (err) {
    next(err);
  }
};

export const removeTaskMember = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(createError(404, "User not found"));
  const task = await Task.findById(req.params.id);
  if(!task) return next(createError(404, "Task not found"));
  try
  {
    if(user._id.toString() == task.creator.toString())
    {
      const user1 = await User.findById(req.body.id);
      if(user1)
      {
        if(user1._id.toString() == task.creator.toString())
        {
          return next(createError(404, "Can not remove yourself"));
        }
        await User.findByIdAndUpdate(
          user1._id,
          {$pull:{"tasks":task._id}},
          {new:true}
        )

        await Task.findByIdAndUpdate(
          task._id,
          {$pull:{"members":req.body.id}},
          {new:true}
        )

        res.status(200).send("Member Deleted");
      }
      else return next(createError(404, "User not found"));
    }
  } catch (err) {
    next(err);
  }
};