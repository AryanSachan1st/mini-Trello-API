import { Router } from "express";
import { createTask, updateTask, deleteTask } from "../controllers/task.controller.js"
import { verifyJWT } from "../middlerwares/auth.middleware.js";

const taskRouter = Router({ mergeParams: true })

taskRouter.use(verifyJWT)

taskRouter.route("/create-task").post(createTask)
taskRouter.route("/:taskId").patch(updateTask).delete(deleteTask)

export { taskRouter }