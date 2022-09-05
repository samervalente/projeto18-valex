import { Router } from "express";
import schemaValidator from "../middlewares/schemaValidator"
import * as cardSchema from "../schemas/CardSchema"
import validateCardData from "../middlewares/cardMiddleware"
import * as cardController from "../controllers/cardController"
import * as rechargeMiddleware from "../middlewares/rechargeMiddleware"
import * as rechargeController from "../controllers/rechargeController"

import * as paymenteMiddleware from "../middlewares/paymentMiddleware"
import * as paymentController from "../controllers/paymentController"


const routes = Router()

routes.post("/card", schemaValidator(cardSchema.createCardSchema), validateCardData, cardController.createCard)
routes.post("/card/activate", schemaValidator(cardSchema.activateCardSChema), cardController.activateCard)
routes.get("/card/transactions/:id", cardController.getCardTransactions )
routes.post("/card/lock", schemaValidator(cardSchema.blockAndUnblockCardSchema), cardController.lockCard) 
routes.post("/card/unlock", schemaValidator(cardSchema.blockAndUnblockCardSchema), cardController.unlockCard) 
routes.post("/card/recharge/:id", schemaValidator(cardSchema.rechargeCardSChema), rechargeMiddleware.validateRechargeData, rechargeController.rechargeCard)

routes.post("/card/purchase", schemaValidator(cardSchema.purchaseSchema), paymenteMiddleware.validatePurchaseData, paymentController.paymentInPOS )
export default routes