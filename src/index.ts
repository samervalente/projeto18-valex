import express from "express"
import "express-async-errors"
import cors from "cors"
import dotenv from "dotenv"

import routes from "./routes/cardRouter"
import errorHandler from "./middlewares/errorHandlingMiddleware"

dotenv.config()

const app = express()
const PORT = process.env.PORT

app.use([cors(), express.json()])
app.use(routes)
app.use(errorHandler)

app.listen(PORT, () => console.log(`Funcionando corretamente na porta ${PORT}`))