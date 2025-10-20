import express from "express"
import dotenv from "dotenv"
import db from "./database/configdb"
import routes from "./routes/user.routes"; // 👈 importe seu router


// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(express.json());        // 👈 body parser primeiro

(async () => {
  try {
    await db.connect();         // 👈 espere conectar ao Mongo
    app.use(routes);            // 👈 monte as rotas (/auth/register etc.)

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`http://localhost:${port}`));
  } catch (e) {
    console.error("Failed to start:", e);
    process.exit(1);
  }
})();