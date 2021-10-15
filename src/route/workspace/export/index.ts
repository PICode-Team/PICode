import express from "express";
import exportWork from "./export";

const router = express.Router();

router.use("/", exportWork);

export default router;
