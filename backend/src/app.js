import express from "express"
import cookieParser from "cookie-parser"

const app = express()
export { app }

// middlewares
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.json({ limit: "16kb" }))
app.use(cookieParser())

// routes
// api health route
import { apiHealthRouter } from "./routes/apiHealth.route.js"
app.use("/", apiHealthRouter)

// user routes
import { userRouter } from "./routes/user.route.js"
app.use("/api/v1/users", userRouter)

// project routes
import { projectRouter } from "./routes/project.route.js"
app.use("/api/v1/projects", projectRouter)

// task routes
import { taskRouter } from "./routes/task.route.js"
app.use("/api/v1/projects/:projectId/tasks", taskRouter)


// global error handler
/*
The if-else block acts as a Translation Layer. It takes messy, internal, and inconsistent errors from the database or system and translates them into a standardized, safe, and user-friendly API response.
*/
app.use((err, req, res, next) => {
    const errorCode = err.code || 500
    const errorMessage = err.message || "Internal Server Error"

    if (err.name === "CastError") {
        errorCode = 400
        errorMessage = "Resource not found, invalid parameter"
    } else if (err.code === 11000) {
        errorCode = 409
        errorMessage = "Duplicate field values entered"
    } else if (err.name === "ValidationError") { // can contains multiple errors, so combine them in one sentence
        errorCode = 400
        errorMessage = Object.values(err.errors || {}).map((error) => error.message).join(", ")
    }

    return res.status(errorCode).json(
        {
            success: false,
            errorCode: errorCode,
            errorMessage: errorMessage,
            errors: err.errors || [],
            stack: process.env.NODE_ENV === "Development" ? err.stack : undefined
        }
    )
})