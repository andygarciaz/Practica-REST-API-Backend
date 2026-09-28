import{Router} from "express" // {} es un objeto en js, tambien se usa para funciones.
import {hola, ping, abc} from "../controllers/index.controllers.js" // importando funciones de otro archivo

const router = Router() 

router.get("/", hola)
router.get("/ping", ping)
router.get("/a/b/c", abc)
// tener dos rutas iguales es vlaido siempre que el metodo sea diferente

export default router