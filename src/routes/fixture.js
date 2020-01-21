const express = require('express');
const router = express.Router();
const Fixture = require('../models/fixture');

// const { utilsModels } = require('../models/utils');


getFixtureByTeams = async function(team1, team2){
    const partido = await Fixture.find({'team1.name': team1, 'team2.name': team2}); //.sort({nombre: 'asc'});
    if(partido.length){
        return partido[0]._id;
    }
    return false;
}


/** registra un nuevo partido.
    http://localhost:3000/fixture 
    post params : 
                    team1 : nombre del equipo local
                    team2 : nombre del equipo visitante
                    location : nombre de el estadio
                    time : hora que inicia el partido
*/
router.post('/', async (req,res) => {
    const { team1, team2, location, time} = req.body;
    let idFixture = await getFixtureByTeams(team1, team2);
    if(idFixture) {
        await Fixture.findByIdAndUpdate(idFixture, {location: location, time: time?time:new Date().getTime()});
        res.send(idFixture);
    } else {
        const fixture = new Fixture();
        fixture.team1 = {name : team1};
        fixture.team2 = {name : team2},
        fixture.location = location;
        fixture.time = time?time:new Date().getTime();
        await fixture.save((err, response) => {
            res.send(response._id);
        })
    }
})

/** Registra a un nuevo jugador de un equipo
    http://localhost:3000/fixture/team/player
    post params :   id_fixture : id de el partido
                    team : nombre del equipo
                    player : nombre del jugador
*/
router.post('/team/player', async (req,res) => {
    const { id_fixture, team, player } = req.body;
    const partido = await Fixture.findById(id_fixture);
    let equipo = partido.team1.name == team?partido.team1:partido.team2;
    if(!equipo.players) equipo.players = {};
    if(!equipo.players[player]){
        //goles, roja y amarilla son arrays, donde sus elementos seran el timestamp en que se produjo el evento.
        equipo.players[player] = { goles : [], roja : [], amarilla: []}
    }

    await Fixture.findByIdAndUpdate(id_fixture, partido);
    res.send('ok');
})

/** Registra el gol de un jugador de un equipo
 *  http://localhost:3000/fixture/team/player/gol
 *  post params :   id_fixture : id de el partido
 *                  team : nombre del equipo
 *                  player : nombre del jugador
 *                  time : timestamp del gol
 */
router.post('/team/player/gol', async (req,res) => {
    const { id_fixture, team, player, time } = req.body;
    const partido = await Fixture.findById(id_fixture);
    let equipo = partido.team1 == team?partido.team1:partido.team2;
    equipo.players[player]['goles'].push(time?time:new Date().getTime());
    await Fixture.findByIdAndUpdate(id_fixture, partido);
    res.send('ok');
})

/** Registra una tarjeta roja de un jugador de un equipo
 *  http://localhost:3000/fixture/team/player/roja
 *  post params :   id_fixture : id de el partido
 *                  team : nombre del equipo
 *                  player : nombre del jugador
 *                  time : timestamp de la tarjeta
 */
router.post('/team/player/roja', async (req,res) => {
    const { id_fixture, team, player, time } = req.body;
    const partido = await Fixture.findById(id_fixture);
    let equipo = partido.team1 == team?partido.team1:partido.team2;
    equipo.players[player]['roja'].push(time?time:new Date().getTime());
    await Fixture.findByIdAndUpdate(id_fixture, partido);
    res.send('ok');
})

/** Registra una tarjeta amarilla de un jugador de un equipo
 *  http://localhost:3000/fixture/team/player/amarilla
 *  post params :   id_fixture : id de el partido
 *                  team : nombre del equipo
 *                  player : nombre del jugador
 *                  time : timestamp de la tarjeta
 */
router.post('/team/player/amarilla', async (req,res) => {
    const { id_fixture, team, player, time } = req.body;
    const partido = await Fixture.findById(id_fixture);
    let equipo = partido.team1 == team?partido.team1:partido.team2;
    equipo.players[player]['amarilla'].push(time?time:new Date().getTime());
    await Fixture.findByIdAndUpdate(id_fixture, partido);
    res.send('ok');
})



router.get('/', async (req,res) => {
    const { id_fixture } = req.query;
    const partido = await Fixture.findById(id_fixture);

    // res.send(partido);
    res.render('index', {
        team1 : partido.team1.name,
        team2 : partido.team2.name,
    });

})

router.get('/team1', async (req,res) => {
    const { id_fixture } = req.query;
    const partido = await Fixture.findById(id_fixture);

    let salida = "";
    for(let i in partido.team1.players){
        salida+=`<div>${i}</div>`;
    }

    res.send(salida);
})

router.get('/team2', async (req,res) => {
    const { id_fixture } = req.query;
    const partido = await Fixture.findById(id_fixture);

    let salida = "";
    for(let i in partido.team2.players){
        salida+=`<div>${i}</div>`;
    }

    res.send(salida);
})


//retorna un array de los jugadores que han marcado y el timestamp del gol
router.get('/goles', async (req,res) => {
    const { id_fixture } = req.query;
    const partido = await Fixture.findById(id_fixture);

    const goles = [];
    let jugadores = partido.team1.players;
    for(let i in jugadores){
        for(let ii in jugadores[i].goles){
            goles.push({player: i, time: jugadores[i].goles[ii]});
        }
    }
    jugadores = partido.team2.players;
    for(let i in jugadores){
        for(let ii in jugadores[i].goles){
            goles.push({player: i, time: jugadores[i].goles[ii]});
        }
    }

    res.send(goles);

})

//retorna un array de los jugadores que tengan tarjetas amarillas y el timestamp
router.get('/amarillas', async (req,res) => {
    const { id_fixture } = req.query;
    const partido = await Fixture.findById(id_fixture);

    const amarilla = [];
    let jugadores = partido.team1.players;
    for(let i in jugadores){
        for(let ii in jugadores[i].amarilla){
            amarilla.push({player: i, time: jugadores[i].amarilla[ii]});
        }
    }
    jugadores = partido.team2.players;
    for(let i in jugadores){
        for(let ii in jugadores[i].amarilla){
            amarilla.push({player: i, time: jugadores[i].amarilla[ii]});
        }
    }
    res.send(amarilla);

})

//retorna un array de los jugadores que tengan tarjetas rojas y el timestamp
router.get('/rojas', async (req,res) => {
    const { id_fixture } = req.query;
    const partido = await Fixture.findById(id_fixture);

    const roja = [];
    let jugadores = partido.team1.players;
    for(let i in jugadores){
        for(let ii in jugadores[i].roja){
            roja.push({player: i, time: jugadores[i].roja[ii]});
        }
    }
    jugadores = partido.team2.players;
    for(let i in jugadores){
        for(let ii in jugadores[i].roja){
            roja.push({player: i, time: jugadores[i].roja[ii]});
        }
    }
    res.send(roja);

})

module.exports = router;