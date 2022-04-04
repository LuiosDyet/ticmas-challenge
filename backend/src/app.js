const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const credentials = require('./middleware/credentials');
const JWT = require('./middleware/JWT');

require('dotenv').config();
const PORT = process.env.PORT || 3001;

app.use(credentials);
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../public')));

// Register and login User
app.use('/user', require('./routes/userRoutes'));
// Create, Update, Delete, Read TODOS
app.use('/todos', JWT, require('./routes/todosRoutes'));

app.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
});
