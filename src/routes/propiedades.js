const express = require('express');
const router = express.Router();

const pool = require('../database')
const {isLoggedIn} = require('../lib/auth')

const path = require('path');
const multer = require('multer');

router.get('/nuevo',isLoggedIn, (req, res) =>{
    res.render('propiedades/nuevo');
})

router.post('/nuevo', isLoggedIn, async (req, res) => {
    const{ nombre, direccion, descripcion, ambientes, dormitorios, mts2, image} = req.body;
    const newPropiedad = {
        nombre,
        direccion,
        descripcion,
        ambientes,
        dormitorios,
        mts2,
        user_id: req.user.id
    }
    
    console.log(newPropiedad);

    uploadImage(req, res, (err) => {
        if (err) {
            err.message = 'The file is so heavy for my service';
            return res.send(err);
        }
        console.log(req.file);
    });

    await pool.query('INSERT INTO propiedades set ?', [newPropiedad]);
    req.flash('success', 'propiedad saved succesfuly')
    res.redirect('/propiedades');
})

router.get('/', isLoggedIn,  async(req,res) => {
    const propiedades = await pool.query('SELECT * FROM propiedades WHERE user_id = ?', [req.user.id] )
    
    res.render('propiedades/list', {propiedades})
});

router.get('/delete/:id', async (req, res) => {
    const{id} = req.params;
    await pool.query('DELETE FROM propiedades WHERE ID = ?', [id]);
    req.flash('success', 'Propiedad removida satisfactoriamente')
    res.redirect('/propiedades');
})

router.get('/editar/:id', async (req, res) =>{
    const { id } = req.params;
    const propiedades = await pool.query('SELECT * FROM propiedades WHERE id = ? AND user_id = ?', [id], [req.user.id])
    console.log(propiedades[0])
    res.render('propiedades/editar',{propiedad : propiedades[0]})
})

router.post('/editar/:id',async (req, res) =>{
    const {id} = req.params;
    const { nombre, descripcion, direccion } = req.body;
    const newPropiedad = {
        nombre,
        descripcion,
        direccion,
        user_id: req.user.id
    }
    await pool.query('UPDATE propiedades set ? WHERE id = ?', [newPropiedad, id])
    req.flash('success', 'propiedad editarado satisfactoriamente')
    res.redirect('/propiedades')
})

// ---  Images logic: "multer"  ---
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/uploads'),
    filename:  (req, file, cb) => {
        cb(null, file.originalname);
    }
})

const uploadImage = multer({
    storage,
    limits: {fileSize: 1000000}
}).single('image')


// ---end:  Images logic: "multer"  ---

module.exports = router;