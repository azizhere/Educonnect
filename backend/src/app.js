import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import path from "path";
import routes from "./routes/index.js";
import courseRoutes from "./routes/course.routes.js";
import { fileURLToPath } from "url";
import session from "express-session";
import { toastMiddleware } from "./middleware/toast.middleware.js";
import "./models/User.model.js";
import "./models/Course.model.js";
import "./models/Class.model.js";
import "./models/ClassTeacher.model.js";
import "./models/ClassStudents.model.js";
import "./models/CourseMaterials.model.js";
import "./models/Assignment.model.js";
import "./models/Enrollment.model.js";
// import "./models/Submission.model.js";
import "./models/Timetable.model.js";
import "./models/Attendance.model.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import indexRoutes from "./routes/index.js";



const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Make logged in user available as req.user
app.use((req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user;
    }
  next();
});
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});


// Toast middleware
app.use(toastMiddleware);

// Static files


// app.get("/download/:type/:filename", (req, res) => {
//   const { type, filename } = req.params;
//   const folder = ["materials", "assignments", "course-materials"].includes(type) ? type : null;
//   if (!folder) return res.status(404).send("Invalid folder type");

//   const filePath = path.join(__dirname, `../uploads/${folder}`, filename);
//   res.download(filePath, filename, (err) => {
//     if (err) res.status(404).send("File not found");
//   });
// });

app.get("/uploads/:type/:filename", (req, res) => {
  const { type, filename } = req.params;
  const folderMap = {
    materials: "materials",
    assignments: "assignments",
    "course-materials": "course-materials",
  };

  const folder = folderMap[type];
  if (!folder) return res.status(404).send("Invalid folder type");

  const filePath = path.join(__dirname, `../uploads/${folder}`, filename);

  // Force download
  res.download(filePath, filename, (err) => {
    if (err) {
      console.log(err);
      res.status(404).send("File not found");
    }
  });
});

// Set pug
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
// Body parser
app.use("/", indexRoutes);

export default app;
     