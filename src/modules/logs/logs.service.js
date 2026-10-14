import { db } from "../../DB/connection.js"

export const insertLog = async (req, res) =>{
  try {
    const result = await db.collection("logs").insertOne(req.body)
    res.status(201).json(result)
  } catch (error){
    res.status(400).json({message: "Failed to insert log", error: error.message})
  }
}
