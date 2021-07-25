import express from "express";
import temp from "./temp";

const router = express.Router();

router.use("/", temp);

export default router;
