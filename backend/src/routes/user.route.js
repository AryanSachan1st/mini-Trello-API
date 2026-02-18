import { Router } from "express"
import { verifyJWT } from "../middlerwares/auth.middleware.js"
import { registerUser, loginUser, logoutUser, deleteUser } from "../controllers/user.controller.js"

const userRouter = Router()

userRouter.route("/register-user").post(registerUser)
userRouter.route("/login").post(loginUser)
userRouter.route("/logout").post(verifyJWT, logoutUser)
userRouter.route("/delete-user").post(verifyJWT, deleteUser)

export { userRouter }