import express from "express";
import openGraph from "./openGraph";

const router = express.Router();

router.use("/", openGraph);

export default router;
