import app from "./app";
import db from "./database/configdb";

// Load environment variables from .env file
(async () => {
  try {
    const port = process.env.PORT || 3000;
      await db.connect();

    app.listen(port, () => console.log(`http://localhost:${port}`));
  } catch (e) {
    console.error("Failed to start:", e);
    process.exit(1);
  }
})();