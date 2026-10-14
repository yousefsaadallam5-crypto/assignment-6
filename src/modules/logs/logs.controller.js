import { Router } from "express"
import * as service from "./logs.service.js"

const router = Router()

router.post("/", service.insertLog)

export default router
