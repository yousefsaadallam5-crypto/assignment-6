import { db } from "../../DB/connection.js"

export const createBooksCollection = async (req, res) =>{
  try {
    await db.createCollection("books", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["title"],
          properties: {
            title: {
              bsonType: "string",
              minLength: 1,
              description: "title must be a non-empty string",
            },
          },
        },
      },
    })
    res.status(201).json({ok: 1})
  } catch (error){
    res.status(400).json({ message: "Failed to create collection", error: error.message })
  }
}

export const createAuthorsImplicit = async (req, res) =>{
  try {
    const result = await db.collection("authors").insertOne(req.body)
    res.status(201).json(result)
  } catch (error) {
    res.status(400).json({ message: "Failed to insert author", error: error.message })
  }
}

export const createLogsCapped = async (req, res) =>{
  try {
    await db.createCollection("logs", { capped: true, size: 1024 * 1024 })
    res.status(201).json({ ok: 1})
  } catch (error) {
    res.status(400).json({ message: "Failed to create capped collection", error: error.message})
  }
}

export const createBooksTitleIndex = async (req, res) =>{
  try {
    const indexName = await db.collection("books").createIndex({title: 1})
    res.status(201).json(indexName)
  } catch (error) {
    res.status(400).json({ message: "Failed to create index", error: error.message})
  }
}
