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

ProjectSchema.index({title: 1, owner: 1}, {unique: true}) // project is unique to an owner, not globally

export const Project = model("Project", ProjectSchema)
Project.syncIndexes();