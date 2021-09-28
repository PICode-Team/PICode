import express from "express";
import docker from "./docker";
import network from "./network";
import visualization from "./visualization";

const router = express.Router();

router.use("/", docker);
router.use("/network", network);
router.use("/visualization", visualization);

export default router;
