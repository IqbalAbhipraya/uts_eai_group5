require('dotenv').config();

const express = require('express');
const app = express();
const db = require('./models');
const port = process.env.PORT || 3000;
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const yaml = require('yaml');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const file = fs.readFileSync('./swagger/educonnect-api.yaml', 'utf8');
const swaggerDocument = yaml.parse(file);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

async function testDbConnection() {
    try {
        await db.sequelize.authenticate();
        console.log('Database connected');
    } catch (error) {
        console.error('Database connection failed:', error);
    }
}

testDbConnection();

// routes
const studentRoutes = require('./routes/student.routes');
const courseRoutes = require('./routes/course.routes');
const gradeRoutes = require('./routes/grade.routes');

app.use('/api/v1/student', studentRoutes);
app.use('/api/v1/course', courseRoutes);
app.use('/api/v1/grade', gradeRoutes);

app.get('/', (req,res) => {
    res.send('Hello World');
});

app.listen(port, () => console.log(`Server Started in http://localhost:${port}`));