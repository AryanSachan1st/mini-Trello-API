import { Task } from "../models/task.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";
import { Project } from "../models/project.model.js"

const createTask = asyncHandler(async (req, res) => {
    const { projectId } = req.params
    const userId = req.user._id
    const { title, content } = req.body

    if (!userId) {
        throw new ApiError(400, "Unauthorized request, pleae login first")
    }

    if (!mongoose.isValidObjectId(projectId)) {
        throw new ApiError(400, "Invalid project Id")
    }

    const project = await Project.findOne(
        {
            _id: projectId,
            owner: userId
        }
    )

    if (!project) {
        throw new ApiError(404, "Project does not exists or you are not authorized to add tasks to this project")
    }

    if (!content) {
        throw new ApiError(400, "Task content is missing")
    }

    const task = await Task.create(
        {
            ...(title && { title }),
            content: content,
            project: projectId
        }
    )

    const addTaskToProject = await Project.findByIdAndUpdate(
        projectId,
        {
            $push: {
                tasks: task
            },
            $set: {
                completed: false
            }
        },
        {
            new: true,
            runValidators: true // run schema validation
        }
    )

    return res.status(201).json(
        new ApiResponse(201, task, "Task created successfully")
    )
})
const updateTask = asyncHandler(async (req, res) => {
    const { projectId, taskId } = req.params
    const { title, content, completed } = req.body
    const userId = req.user._id

    if (!userId) {
        throw new ApiError(400, "Unauthorized request, pleae login first")
    }

    if (!mongoose.isValidObjectId(projectId) || !mongoose.isValidObjectId(taskId)) {
        throw new ApiError(400, "Invalid project id or task id")
    }

    const project = await Project.findOne(
        {
            _id: projectId,
            owner: userId
        }
    )

    if (!project) {
        throw new ApiError(404, "Project does not exists or you are not authorized to add tasks to this project")
    }

    const taskExistsInProject = await Task.findOne(
        {
            _id: taskId,
            project: projectId
        }
    )

    if (!taskExistsInProject) {
        throw new ApiError(400, `This task: ${taskId} does not belong to this project: ${projectId}`)
    }

    const task = await Task.findOneAndUpdate(
        {
            _id: taskId
        },
        {
            $set: {
                ...(title && ({ title })),
                ...(content && ({ content })),
                ...(completed && ({ completed }))
            }
        },
        {
            new: true
        }
    )

    if (!task) {
        throw new ApiError(404, "Task does not exists")
    }

    return res.status(200).json(
        new ApiResponse(200, task, "Task updated successfully")
    )
})
const deleteTask = asyncHandler(async (req, res) => {
    const { projectId, taskId } = req.params
    const userId = req.user._id

    if (!userId) {
        throw new ApiError(400, "Unauthorized request, pleae login first")
    }

    if (!mongoose.isValidObjectId(projectId) || !mongoose.isValidObjectId(taskId)) {
        throw new ApiError(400, "Invalid project id or task id")
    }

    const project = await Project.findOne(
        {
            _id: projectId,
            owner: userId
        }
    )

    if (!project) {
        throw new ApiError(404, "Project does not exists or you are not authorized to add tasks to this project")
    }

    const task = await Task.findOne(
        {
            _id: taskId,
            project: projectId
        }
    )

    if (!task) {
        throw new ApiError(404, `Either task (${taskId}) does not exists or task does not belong to this project (${projectId})`)
    }

    const deletedTask = await Task.findByIdAndDelete(taskId)

    if (!deletedTask) {
        throw new ApiError(404, `Task (${taskId}) does not exists`)
    }

    return res.status(200).json(
        new ApiResponse(200, deletedTask, "Task deleted successfully")
    )
})

export { createTask, updateTask, deleteTask }