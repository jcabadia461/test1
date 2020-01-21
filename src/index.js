const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const app = express();

require('./database');
app.set('port', process.env.port || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');


app.use(express.urlencoded({extended: false}));
app.use((req, res, next) => {
    // console.log(console.log(req.body));
    next();
})


app.use('/', require('./routes/index'));
app.use('/fixture', require('./routes/fixture'));



app.listen(app.get('port'), () => {
    console.log('hola');
});



