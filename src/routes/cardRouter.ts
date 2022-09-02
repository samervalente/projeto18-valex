import { Router } from "express";
import schemaValidator from "../middlewares/schemaValidator"
import * as cardSchema from "../schemas/CardSchema"
import validateAPIKey from "../middlewares/cardMiddleware"
import * as cardController from "../controllers/cardController"


const routes = Router()

routes.post("/card", schemaValidator(cardSchema.createCardSchema), validateAPIKey, cardController.createCard)
routes.post("/card/activate", schemaValidator(cardSchema.activateCardSChema), cardController.activateCard)
routes.get("/card/transactions/:id", cardController.getCardTransactions )
routes.post("/card/lock", schemaValidator(cardSchema.blockAndUnblockCardSchema), cardController.lockCard) 
routes.post("/card/unlock", schemaValidator(cardSchema.blockAndUnblockCardSchema), cardController.unlockCard) 

export default routes