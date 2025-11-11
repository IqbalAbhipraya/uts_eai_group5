require("dotenv").config();

const express = require("express");
const app = express();
const db = require("./models");
const port = process.env.PORT || 3000;
const cors = require("cors");

app.use(cors());

// Serve static files from public directory
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function testDbConnection() {
  try {
    await db.sequelize.authenticate();
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

testDbConnection();

// routes
const studentRoutes = require("./routes/student.routes");
const courseRoutes = require("./routes/course.routes");
const gradeRoutes = require("./routes/grade.routes");

app.use("/api/v1/student", studentRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/grade", gradeRoutes);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, () =>
  console.log(`Server Started in http://localhost:${port}`)
);
