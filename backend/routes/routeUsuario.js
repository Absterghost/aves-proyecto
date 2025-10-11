import express from "express";
import { registrarUsuario } from "../controllers/controllerUsuario.js";

const router = express.Router();

router.post("/registro", registrarUsuario);

export default router;
