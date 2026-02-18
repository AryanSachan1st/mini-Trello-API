import Router from "express"
import { apiHealth } from "../controllers/apiHealthcheck.controller.js"

const apiHealthRouter = Router()

apiHealthRouter.route("/").get(apiHealth)

export { apiHealthRouter }