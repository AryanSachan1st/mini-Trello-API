import { model, Schema } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        refreshToken: {
            type: String
        }
    },
    {timestamps: true}
)

UserSchema.pre("save", async function () {
    if (!this.isModified("password")) return

    this.password = await bcrypt.hash(this.password, 10)
})

UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

UserSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        process.env.ACCESSTOKEN_SECRET,
        {
            expiresIn: process.env.ACCESSTOKEN_EXPIRY
        }
    )
}

UserSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESHTOKEN_SECRET,
        {
            expiresIn: process.env.REFRESHTOKEN_EXPIRY
        }
    )
}
export const User = model("User", UserSchema)