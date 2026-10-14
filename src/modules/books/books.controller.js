import { Router } from "express"
import * as service from "./books.service.js"

const router = Router()

router.post("/", service.insertBook)
router.post("/batch", service.insertBooksBatch)

router.get("/title", service.findBookByTitle)
router.get("/year", service.findBooksBetweenYears)
router.get("/genre", service.findBooksByGenre)
router.get("/skip-limit", service.skipLimitBooks)
router.get("/year-integer", service.findBooksYearInteger)
router.get("/exclude-genres", service.excludeGenres)

router.get("/aggregate1", service.aggregate1)
router.get("/aggregate2", service.aggregate2)
router.get("/aggregate3", service.aggregate3)
router.get("/aggregate4", service.aggregate4)

router.delete("/before-year", service.deleteBooksBeforeYear)

router.patch("/:title", service.updateBookYear)

export default router
