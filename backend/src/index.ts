import express from "express"
import dotenv from "dotenv"
import db from "./database/configdb"
import routes from "./routes/user.routes"; 

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(express.json());        

(async () => {
  try {
    await db.connect();         
    app.use(routes);            

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`http://localhost:${port}`));
  } catch (e) {
    console.error("Failed to start:", e);
    process.exit(1);
  }
})();