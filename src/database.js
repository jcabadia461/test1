const mongoose = require('mongoose');
const { mongodb } = require('./config');


mongoose.connect(mongodb.URI, {useUnifiedTopology: true, useNewUrlParser: true}).then(() => {
    console.log('db conectada');

}).catch((err) => {
    console.log(err);
    console.log('hay un error en la base de datos');
})