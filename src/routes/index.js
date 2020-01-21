const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
    res.render('instrucciones');
    // const team = new Teams();
    // team.name = 'nada2';
    // team.save( (a,b)=>{
    //     console.log(a);
    //     console.log(b);
    // });
})


module.exports = router;