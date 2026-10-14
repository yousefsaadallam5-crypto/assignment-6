import { Router } from "express"
import * as service from "./collection.service.js"

const router = Router()

router.post("/books", service.createBooksCollection)

router.post("/authors", service.createAuthorsImplicit)

router.post("/logs/capped", service.createLogsCapped)

router.post("/books/index", service.createBooksTitleIndex)

export default router
