import express from "express";
import docker from "./docker";
import network from "./network";

const router = express.Router();

router.use("/", docker);
router.use("/network", network);

export default router;
