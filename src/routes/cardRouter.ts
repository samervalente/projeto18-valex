import { Router } from "express";
import schemaValidator from "../middlewares/schemaValidator"
import cardSchema from "../schemas/createCardSchema"
import validateAPIKey from "../middlewares/cardMiddleware"
import createCard from "../controllers/cardController"


const routes = Router()

routes.post("/card", schemaValidator(cardSchema), validateAPIKey, createCard)

export default routes