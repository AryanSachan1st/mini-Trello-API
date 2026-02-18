import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/AsyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"

const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(400, "Unauthorized request, please login to continue")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESSTOKEN_SECRET)

        if (!decodedToken) {
            throw new ApiError(400, "Invalid Token")
        }

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(404, "User not found, token expired")
        }

        req.user = user
        next()
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})

export { verifyJWT }