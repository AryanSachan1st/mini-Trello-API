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
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        completed: {
            type: Boolean,
            default: false
        }
    },
    {timestamps: true}
)

export const Task = model("Task", TaskSchema)