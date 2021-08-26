import express from "express";
import test from "./test";
import user from "./user";
import project from "./project";
import data from "./data";
import docker from "./docker";

const router = express.Router();

router.use("/", test);
router.use("/user", user);
router.use("/project", project);
router.use("/data", data);
router.use("/docker", docker);

export default router;
