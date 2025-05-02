import express from "express";
import { register, login } from "../controllers/UserController.js";
import { finalizarSimulacao, iniciarSimulacao, pausarSimulacao, retomarSimulacao } from "../controllers/GameController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/iniciar-simulacao", iniciarSimulacao);
router.post("/pausar-simulacao", pausarSimulacao);
router.post("/finalizar-simulacao", finalizarSimulacao);
router.post("/retomar-simulacao", retomarSimulacao);

export default router;
