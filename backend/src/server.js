import app from "./app.js";  // ✅ IMPORT APP HERE
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
