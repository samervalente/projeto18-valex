import express from 'express'
import cors from "cors"
import dotenv from "dotenv"
import routes from "./routes/cardRouter"

const app = express()

dotenv.config()
app.use([cors(), express.json()])

const PORT = process.env.PORT

app.use(routes)

app.listen(PORT, () => console.log(`Funcionando corretamente na porta ${PORT}`))