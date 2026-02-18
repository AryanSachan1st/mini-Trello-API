import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js"

const apiHealth = asyncHandler(async (_, res) => {
    res.status(200).json(
        new ApiResponse(200, {}, "Trello API is healthy and running")
    )
})

export { apiHealth }