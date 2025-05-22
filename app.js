var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var db = require('knex')(
    {client:'sqlite3',
      connection:{
        filename:'isaac.sqlite'
      }}
)

// app.use('/', indexRouter);
// app.use('/users', usersRouter);


// TODOS LOS GETS
app.get('/api/personajes', function (req, res) {
  db.select('p.ID', 'p.Nombre', 'p.ID_ObjetoInicial', 'p.Vida', 'p.Imagen')
      .from('Personajes as p')
      .then(function (data) {
        result = {};
        result.personajes = data;
        res.json(result);
      });
})

app.get('/api/personajes/:id', function (req, res) {
  let personaje = parseInt(req.params.id);
  db.select('p.ID', 'p.Nombre', 'p.ID_ObjetoInicial', 'p.Vida', 'p.Imagen')
  .from('Personajes as p')
      .where('p.ID', personaje)
  .then(function (data) {
    res.json(data);
  })
})

app.get('/api/objetos', function (req, res) {
  db.select('o.ID', 'o.Nombre', 'o.Activo', 'o.Imagen','o.ID_Sala')
      .from('Objetos as o')
      .then(function (data) {
          result = {};
          result.objetos = data;
          res.json(result);
      })
})

app.get('/api/objetos/:id', function (req, res) {
    let objeto = parseInt(req.params.id);
    db.select('o.ID', 'o.Nombre', 'o.Activo', 'o.Imagen', 'o.ID_Sala')
    .from('Objetos as o')
        .where('o.ID', objeto)
    .then(function (data) {
        res.json(data);
    })
})

app.get('/api/habitaciones', function (req, res) {
    db.select('h.ID', 'h.Nombre')
    .from('Habitaciones as h')
    .then(function (data) {
        result = {};
        result.habitaciones = data;
        res.json(result);
    })
})

app.get('/api/habitaciones/:id', function (req, res) {
    let habitacion = parseInt(req.params.id);
    db.select('h.ID', 'h.Nombre')
    .from('Habitaciones as h')
    .where('h.ID', habitacion)
    .then(function (data) {
        res.json(data);
    })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
