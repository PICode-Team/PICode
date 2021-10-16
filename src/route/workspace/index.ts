import express from "express";
import workspace from "./workspace";
import exportWork from "./export";

const router = express.Router();

router.use("/", workspace);
router.use("/export", exportWork);

export default router;
