import express from "express";
import path from "path";
import routes from "./routes/index.js";
import { fileURLToPath } from "url";
import session from "express-session";
import { toastMiddleware } from "./middleware/toast.middleware.js";
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Body parser

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "mysupersecretkey",
  resave: false,
  saveUninitialized: true
}));

// Toast middleware
app.use(toastMiddleware);

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Set pug
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Use routes
app.use("/", routes);

export default app;
