const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.set('useFindAndModify', false);

const fixturesSchema = new Schema({
    team1 : {
        name: String,
        players : {}
    },
    team2 : {
        name: String,
        players : {},
        hola: String
    },
    location : String,
    time : Number
})

module.exports = mongoose.model('fixtures', fixturesSchema);