const mongoose = require('mongoose');
require('dotenv').config();

const InitiateMongoServer = async () => {
    try {
        await mongoose.connect(process.env.DATABASE, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        });
        console.log("Database is connected !!");
    } catch (e) {
        console.log(`Not connected to the database ! ${e.message}`);
    }
};


module.exports = InitiateMongoServer;
