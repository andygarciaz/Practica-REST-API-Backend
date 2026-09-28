// archivo pricipal
import "dotenv/config"

import express from "express"
import morgan from "morgan"
import cors from "cors"
import indexRoutes from "./routes/index.routes.js"
import loginRoutes from "./routes/login.routes.js"
import usersRoutes from "./routes/users.routes.js"
const app = express()
app.use(cors())
app.use(express.json())
// aqui estan middlewares, que son funciones que se ejecutan antes de llegar a la ruta
app.use(morgan("dev"))

app.use(indexRoutes)
app.use(loginRoutes)
app.use(usersRoutes)

const PORT = 4000

app.listen(PORT, console.log("http://localhost:" + PORT))

