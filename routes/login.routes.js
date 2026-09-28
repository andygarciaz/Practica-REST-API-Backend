import{Router} from "express" // {} es un objeto en js, tambien se usa para funciones.
import {login} from "../controllers/login.controllers.js" // importando funciones de otro archivo

const router = Router() 

router.post("/login", login)

export default router