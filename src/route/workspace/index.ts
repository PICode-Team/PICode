import express from "express";
import workspace from "./workspace";

const router = express.Router();

router.use("/", workspace);

export default router;
