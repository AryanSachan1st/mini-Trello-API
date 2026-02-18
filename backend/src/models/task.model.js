import { Schema, model } from "mongoose"

const TaskSchema = new Schema(
    {
        title: {
            type: String,
        },
        content: {
            type: String,
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project"
        }
    },
    {timestamps: true}
)

export const Task = model("Task", TaskSchema)