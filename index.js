import express from "express"
import { connectDB } from "./src/DB/connection.js"
import collectionRouter from "./src/modules/collection/collection.controller.js"
import booksRouter from "./src/modules/books/books.controller.js"
import logsRouter from "./src/modules/logs/logs.controller.js"

const app = express()
const port = 3000

app.use(express.json())

app.use("/collection", collectionRouter)
app.use("/books", booksRouter)
app.use("/logs", logsRouter)

app.use((req, res) =>{
  res.status(404).json({ message: "Route not found" })
})

connectDB().then(() =>{
  app.listen(port, () => console.log(`Server running on port ${port}`))
})
