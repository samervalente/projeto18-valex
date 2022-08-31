import { Router } from "express";
import validator from "../middlewares/schemaValidator"
import schemas from "../schemas/createCardSchema"

const routes = Router()

routes.post("/card", validator(schemas))

export default routes