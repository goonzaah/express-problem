const express = require('express')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
const flash = require('connect-flash') 
const session = require('express-session')
const MySQLStore = require('express-mysql-session')
const passport = require('passport')
const multer = require('multer');

const {database} = require('./keys')

// initializations
const app = express()
require('./lib/passport')

//settings
app.set('port', process.env.PORT || 4000);
app.set('views',path.join(__dirname, 'views'));
app.engine('.hbs',exphbs({
    defaultLayout: 'main',
    layoutDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: 'hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');


// Middlewares
app.use(session({
    secret: 'faztmyssqlnode',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database) 
}));
app.use(flash())
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(multer({
    dest: path.join(__dirname,'public/upload')
}).single('image'));



// Global variables
app.use((req, res,  next) => {
    app.locals.success = req.flash('success')
    app.locals.success = req.flash('message')
    app.locals.user = req.user
    next();
})

// Routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/propiedades',require('./routes/propiedades'));
app.use('/mensajes',require('./routes/mensajes'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Starting the server
app.listen(app.get('port'), () =>{
 console.log('Server on port',app.get('port'));
});