import express from "express"
import dotenv from "dotenv"
import db from "./database/configdb.js"

// Load environment variables from .env file
dotenv.config();

const app = express()
const port = process.env.PORT || 3000

dotenv.config();
db.connect();

app.use(express.json());

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello World!")
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
