const mongoose = require('mongoose');
const app = require('./app');
const PORT = process.env.PORT || 3001;

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB...');
    app.listen(PORT, () => {
        console.log(`Servidor en puerto ${PORT}`);
    });
});
