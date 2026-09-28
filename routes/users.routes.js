import{Router} from "express" // {} es un objeto en js, tambien se usa para funciones.
import {getUsers, getUser, postUser, putUser, deleteUser} from "../controllers/users.controllers.js" // importando funciones de otro archivo

const router = Router() 

router.get("/users", getUsers)
router.get("/users/:id", getUser)
router.post("/users", postUser)
router.put("/users/:id", putUser)
router.delete("/users/:id", deleteUser) // solo existen dentro de este metodo las variables

export default router