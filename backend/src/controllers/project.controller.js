import { Project } from "../models/project.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const createProject = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const { title, desc } = req.body

    if (!userId) {
        throw new ApiError(400, "Unauthorized request, pleae login first")
    }

    if (!title) {
        throw new ApiError(400, "Project title is must")
    }

    const projectExists = await Project.findOne(
        {
            title: title,
            owner: userId
        }
    )

    if (projectExists) {
        throw new ApiError(400, "You already created this project")
    }
    
    const project = await Project.create(
        {
            title: title,
            ...(desc && ({ desc })),
            owner: userId
        }
    )

    return res.status(200).json(
        new ApiResponse(200, project, "Project created successfully")
    )
})
const getAProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params

    if (!mongoose.isValidObjectId(projectId)) {
        throw new ApiError(400, "Invalid project id")
    }

    const project = await Project.findById(projectId)

    if (!project) {
        throw new ApiError(404, `Project with id: ${projectId} does not exists`)
    }

    return res.status(200).json(
        new ApiResponse(200, project, "Project fetched successfully")
    )
})
const getAllProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find()

    return res.status(200).json(
        new ApiResponse(200, projects, "Fetched all projects succeddfully")
    )
})
const updateProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params
    const userId = req.user._id
    const { title, desc, completed} = req.body

    if (!userId) {
        throw new ApiError(400, "Unauthorized request, pleae login first")
    }

    if (!mongoose.isValidObjectId(projectId)) {
        throw new ApiError(400, "Invalid project id")
    }

    const updatedProject = await Project.findOneAndUpdate(
        {
            _id: projectId,
            owner: userId
        },
        {
            $set: {
                ...(title && ({ title })),
                ...(desc && ({ desc })),
                ...(completed && ({ completed }))
            }
        },
        {
            new: true,
            runValidators: true
        }
    )

    if (!updatedProject) {
        throw new ApiError(404, `Either project: ${projectId} does not exists or you are not authorized to update this project`)
    }

    return res.status(200).json(
        new ApiResponse(200, updatedProject, "Project updated successfully")
    )

    
})
const deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params
    const userId = req.user._id

    if (!userId) {
        throw new ApiError(400, "Unauthorized request, pleae login first")
    }

    if (!mongoose.isValidObjectId(projectId)) {
        throw new ApiError(400, "Invalid project id")
    }

    const deletedProject = await Project.findOneAndDelete(
        {
            _id: projectId,
            owner: userId
        }
    )

    if (!deletedProject) {
        throw new ApiError(404, `Either project: ${projectId} does not exists pr you are not authorized to delete this project`)
    }

    return res.status(200).json(
        new ApiResponse(200, deletedProject, "Project Deleted Successfully")
    )

})

export { createProject, getAllProjects, getAProject, updateProject, deleteProject }