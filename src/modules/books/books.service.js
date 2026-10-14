import { db } from "../../DB/connection.js"

const books = () => db.collection("books")
const logs = () => db.collection("logs")

const handle = (fn) => async (req, res) =>{
  try {
    await fn(req, res)
  } catch (error){
    res.status(400).json({ message: "Request failed", error: error.message })
  }
}

export const insertBook = handle(async (req, res) =>{
  const result = await books().insertOne(req.body)
  res.status(201).json(result)
})

export const insertBooksBatch = handle(async (req, res) =>{
  if (!Array.isArray(req.body) || req.body.length <3){
    return res.status(400).json({ message: "Send an array with at least 3 books" })
  }
  const result = await books().insertMany(req.body)
  res.status(201).json(result)
})

export const updateBookYear = handle(async (req, res) =>{
  const year = req.body?.year ?? 2022
  const result = await books().updateOne(
    { title: req.params.title },
    { $set: { year } }
  )
  res.status(200).json(result)
})

export const findBookByTitle = handle(async (req, res) =>{
  const book = await books().findOne({ title: req.query.title })
  if (!book) return res.status(404).json({ message: "Book not found" })
  res.status(200).json(book)
})

export const findBooksBetweenYears = handle(async (req, res) =>{
  const from = Number(req.query.from)
  const to = Number(req.query.to)
  const result = await books()
    .find({year: { $gte: from, $lte: to}})
    .toArray()
  res.status(200).json(result)
})

export const findBooksByGenre = handle(async (req, res) =>{
  const result = await books().find({ genres: req.query.genre }).toArray()
  res.status(200).json(result)
})

export const skipLimitBooks = handle(async (req, res) =>{
  const result = await books()
    .find()
    .sort({ year: -1 })
    .skip(2)
    .limit(3)
    .toArray();
  res.status(200).json(result)
})

export const findBooksYearInteger = handle(async (req, res) =>{
  const result = await books().find({ year: { $type: "int" } }).toArray()
  res.status(200).json(result)
})

export const excludeGenres = handle(async (req, res) =>{
  const result = await books()
    .find({genres: { $nin: ["Horror", "Science Fiction"]}})
    .toArray()
  res.status(200).json(result)
})

export const deleteBooksBeforeYear = handle(async (req, res) =>{
  const year = Number(req.query.year);
  const result = await books().deleteMany({year: { $lt: year}})
  res.status(200).json(result)
})

export const aggregate1 = handle(async (req, res) =>{
  const result = await books()
    .aggregate([{$match: {year: { $gt: 2000 }}}, { $sort: {year: -1}}])
    .toArray()
  res.status(200).json(result)
})

export const aggregate2 = handle(async (req, res) =>{
  const result = await books()
    .aggregate([
      { $match: { year: { $gt: 2000 } } },
      { $project: { _id: 0, title: 1, author: 1, year: 1}},
    ])
    .toArray()
  res.status(200).json(result)
})

export const aggregate3 = handle(async (req, res) =>{
  const result = await books()
    .aggregate([
      { $unwind: "$genres" },
      { $project: { _id: 0, title: 1, genres: 1}},
    ])
    .toArray()
  res.status(200).json(result)
})

export const aggregate4 = handle(async (req, res) =>{
  const result = await logs()
    .aggregate([
      {
        $addFields: {
          bookObjectId: {
            $convert: { input: "$book_id", to: "objectId", onError: null, onNull: null},
          },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "bookObjectId",
          foreignField: "_id",
          as: "book_details",
        },
      },
      {
        $project: {
          _id: 0,
          action: 1,
          "book_details.title": 1,
          "book_details.author": 1,
          "book_details.year": 1,
        },
      },
    ])
    .toArray()
  res.status(200).json(result)
})
