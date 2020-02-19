const express = require('express');
const router = express.Router();

const pool = require('../database')
const {isLoggedIn} = require('../lib/auth')

router.get('/nuevo', (req, res) =>{
    res.render('mensajes/nuevo');
})

router.post('/nuevo', isLoggedIn, async (req, res) => {
    const{ nombre, direccion, descripcion} = req.body;
    const newPropiedad = {
        nombre,
        direccion,
        descripcion,
        user_id: req.user.id
    }
    console.log(newPropiedad);

    await pool.query('INSERT INTO propiedades set ?', [newPropiedad]);
    req.flash('success', 'propiedad saved succesfuly')
    res.redirect('/propiedades');
})

router.get('/', isLoggedIn,  async(req,res) => {
    const mensajes = await pool.query('SELECT * FROM mensajes WHERE user_id = ?', [req.user.id] )
    
    res.render('mensajes/list', {mensajes})
});

module.exports = router;