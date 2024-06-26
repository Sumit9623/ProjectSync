import { createError } from "../error.js";
import User from "../models/User.js";
import Project from "../models/Project.js";
import Teams from "../models/Teams.js";
import Issue from "../models/Issue.js"

export const updateUser = async (req, res, next) =>
{
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user.id,{$set: req.body,},{ new: true });
    res.status(200).json(updatedUser);
  }
  catch (err) {
    next(createError(403, "Error while updating user"));
  }
}

export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user.id)
  {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted.");
    } catch (err) {
      next(err);
    }
  }
  else {
    return next(createError(403, "Error in deleting user"));
  }
}

export const getUserDetails = async (req, res, next) => {
  try
  {
    User.findById(req.user.id)
      .populate('teams')
      .populate('projects')
      .populate('tasks')
      .populate('issues')
      .exec((err, user) => {
        if (err) {
            console.error('Error:', err);
            return;
        }
        res.status(200).json(user);
    });
  } catch (err) {
    next(err);
  }
}

export const getUserTasks = async (req, res, next) => {
  try{
    const user = await User.findById(req.user.id).populate("tasks")
    res.status(200).json(user.tasks)
  }
  catch(err)
  {
    res.send(err)
  }
};

export const getUserIssues = async (req, res, next) => {
  const user = await User.findById(req.user.id).populate("issues")
    const issues = []
    await Promise.all(user.issues.map(async (issue) => {
      await Issue.findById(issue.id).then((issue) => {
        issues.push(issue)
      }).catch((err) => {
        next(err)
      })
    })).then(() => {
      res.status(200).json(issues)
    }).catch((err) => {
      next(err)
    })

};



//find project id from user and get it from projects collection and send it to client
export const getUserProjects = async (req, res, next) => {
  try
  {
    console.log("I am in get projects");
    const user = await User.findById(req.user.id).populate("projects")
    const projects = []
    await Promise.all(user.projects.map(async (project) => {
      await Project.findById(project).populate("members.id", "_id  name email img").then((project) => {
        projects.push(project)
      }).catch((err) => {
        next(err)
      })
    })).then(() => {
      res.status(200).json(projects)
    }).catch((err) => {
      next(err)
    })
  } catch (err) {
    next(err);
  }
}

//find team id from user and get it from teams collection and send it to client
export const getUserTeams = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("teams")
    const teams = []
    await Promise.all(user.teams.map(async (team) => {
      await Teams.findById(team.id).then((team) => {
        teams.push(team)
      }).catch((err) => {
        next(err)
      })
    })).then(() => {
      res.status(200).json(teams)
    }).catch((err) => {
      next(err)
    })
  } catch (err) {
    next(err);
  }
}

export const findUserByEmail = async (req, res, next) => {
  const email = req.params.email;
  try {
    await User.find({email: { $regex: email, $options: "i" }},{name:1,email:1}).then((users) => {
      if(users.length!=0)
      {
        res.status(200).json(users);
      }else{
        res.status(201).json({message:"User not found"});
      }
    }).catch((err) => {
      next(err)
    })
  } catch (err) {
    next(err);
  }
}