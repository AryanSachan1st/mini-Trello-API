import { Router } from "express";
import { createProject, updateProject, deleteProject, getAProject, getAllProjects } from "../controllers/project.controller.js"
import { verifyJWT } from "../middlerwares/auth.middleware.js";

const projectRouter = Router()

projectRouter.route("/:projectId").get(getAProject).patch(verifyJWT, updateProject).delete(verifyJWT, deleteProject)
projectRouter.route("/").get(getAllProjects)
projectRouter.route("/create-project").post(verifyJWT, createProject)

export { projectRouter }