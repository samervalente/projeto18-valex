import { Router } from "express";
import cardRouter from "./cardRouter"


const routes = Router()

routes.use(cardRouter);


export default routes;