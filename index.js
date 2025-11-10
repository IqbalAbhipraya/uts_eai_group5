require('dotenv').config();

const express = require('express');
const app = express();
const db = require('./models');
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use('/api/v1/student', studentRoutes);
app.use('/api/v1/course', courseRoutes);

app.get('/', (req,res) => {
    res.send('Hello World');
});

app.listen(port, () => console.log(`Server Started in http://localhost:${port}`));