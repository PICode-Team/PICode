import express from "express";
import network from "./network";

const router = express.Router();

router.use("/", network);

export default router;
