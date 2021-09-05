import express from "express";
import visualization from "./visualization";

const router = express.Router();

router.use("/", visualization);

export default router;
