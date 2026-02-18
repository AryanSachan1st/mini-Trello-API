import { Schema, model } from "mongoose"

const ProjectSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            index: true
        },
        desc: {
            type: String
        },
        tasks: [
            {
                type: Schema.Types.ObjectId,
                ref: "Task"
            }
        ],
        owner: {
            type: String,
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        }
    },
    {timestamps: true}
)

export const Project = model("Project", ProjectSchema)