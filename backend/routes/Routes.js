import express from "express";
import { register, login } from "../controllers/UserController.js";
import { iniciarSimulacao } from "../controllers/GameController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/iniciar-simulacao", iniciarSimulacao);

export default router;
