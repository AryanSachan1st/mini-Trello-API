import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/AsyncHandler.js";

const cookieOptions = {
    httpOnly: true,
    secure: true
}

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body

    if ([username, email, password].some((field) => field?.trim() === "" || field === undefined)) {
        throw new ApiError(400, "Username, email and password are required")
    }

    const user = await User.create(
        {
            username,
            email,
            password
        }
    )

    return res.status(201).json(
        new ApiResponse(201, {
            username: username,
            email: email
        }, "User created and saved successfully")
    )
})
const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body

    if (!username && !email) {
        throw new ApiError(400, "Provide email or username")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exists")
    }

    if (!await user.isPasswordCorrect(password)) {
        throw new ApiError(400, "Invalid password")
    }

    // just two things are required to login --> generate access token and refresh token
    const accesstoken = user.generateAccessToken()
    const refreshtoken = user.generateRefreshToken()

    user.refreshToken = refreshtoken
    await user.save({ validateBeforeSave: false })

    return res.status(200)
    .cookie("accessToken", accesstoken, cookieOptions)
    .cookie("refreshToken", refreshtoken, cookieOptions)
    .json(
        new ApiResponse(200, {
            user: {
                userid: user._id,
                username: user.username,
                email: user.email
            },
            accesstoken: accesstoken
        }, "Logged in successfully")
    )

})
const logoutUser = asyncHandler(async (req, res) => {
    const userId = req.user?._id

    const logoutUser = await User.findByIdAndUpdate(
        userId,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    return res.status(200).json(
        new ApiResponse(200, {
            userId: logoutUser._id,
            username: logoutUser.username
        }, "Logged out successfully")
    )
})
const deleteUser = asyncHandler(async (req, res) => {
    const userId = req.user._id

    if (!userId) {
        throw new ApiError(400, "User does not exists")
    }

    const deletedUser = await User.findByIdAndDelete(userId)

    return res.status(200).json(
        new ApiResponse(200, {
            userId: deletedUser._id,
            username: deletedUser.username
        }, "User account permanentally deleted")
    )
})

export { registerUser, loginUser, logoutUser, deleteUser }