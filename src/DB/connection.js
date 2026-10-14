import {MongoClient} from "mongodb"

const client = new MongoClient("mongodb://127.0.0.1:27017")

export const db =client.db("assignment7")

export const connectDB =async () =>{
  try {
    await client.connect()
    console.log("DB connected successfully")
  } catch (error) {
    console.error("DB connection failed", error)
    process.exit(1)
  }
}
