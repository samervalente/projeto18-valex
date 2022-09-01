import { Router } from "express";
import schemaValidator from "../middlewares/schemaValidator"
import * as cardSchema from "../schemas/CardSchema"
import validateAPIKey from "../middlewares/cardMiddleware"
import * as cardController from "../controllers/cardController"


const routes = Router()

routes.post("/card", schemaValidator(cardSchema.createCardSchema), validateAPIKey, cardController.createCard)
routes.post("/card/ativate", schemaValidator(cardSchema.activateCardSChema), cardController.activateCard)

export default routes