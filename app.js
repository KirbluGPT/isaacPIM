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
  db.select('p.id', 'p.nombre', 'p.idObjetoInicial', 'p.vida', 'p.imagen')
      .from('personajes as p')
      .then(function (data) {
        result = {};
        result.personajes = data;
        res.json(result);
      });
})

app.get('/api/personajes/:id', function (req, res) {
  let personaje = parseInt(req.params.id);
  db.select('p.id', 'p.nombre', 'p.idObjetoInicial', 'p.vida', 'p.imagen')
  .from('personajes as p')
      .where('p.id', personaje)
  .then(function (data) {
    res.json(data);
  })
})

app.get('/api/personajesPlus', function (req, res) {
    db.select('p.id', 'p.nombre', 'p.idObjetoInicial', 'p.vida', 'p.imagen', 'o.nombre as objetoNombre', 'o.imagen as objeto')
        .from('personajes as p')
        .leftJoin('objetos as o', 'p.idObjetoInicial', 'o.id')
        .then(function (data) {
            result = {};
            result.personajes = data;
            res.json(result);
        });
})

app.get('/api/objetos', function (req, res) {
  db.select('o.id', 'o.nombre', 'o.activo', 'o.imagen','o.idSala')
      .from('Objetos as o')
      .then(function (data) {
          result = {};
          result.objetos = data;
          res.json(result);
      })
})

app.get('/api/objetos/:id', function (req, res) {
    let objeto = parseInt(req.params.id);
    db.select('o.id', 'o.nombre', 'o.activo', 'o.imagen', 'o.idSala')
    .from('objetos as o')
        .where('o.id', objeto)
    .then(function (data) {
        res.json(data);
    })
})

app.get('/api/habitaciones', function (req, res) {
    db.select('h.id', 'h.nombre', 'h.imagen')
    .from('habitaciones as h')
    .then(function (data) {
        result = {};
        result.habitaciones = data;
        res.json(result);
    })
})

app.get('/api/habitaciones/:id', function (req, res) {
    let habitacion = parseInt(req.params.id);
    db.select('h.id', 'h.nombre', 'h.imagen')
    .from('habitaciones as h')
    .where('h.id', habitacion)
    .then(function (data) {
        res.json(data);
    })
})


// TODOS LOS DELETES

app.delete('/api/personajes/:id', function (req, res) {
    let personaje = parseInt(req.params.id)

    db.delete()
        .from('personajes')
        .where('id', personaje)
        .then(function (data) {
            res.json(data)
        })
})

app.delete('/api/objetos/:id', function (req, res) {
    let objeto = parseInt(req.params.id)

    db.delete()
        .from('objetos')
        .where('id', objeto)
        .then(function (data) {
            res.json(data)
        })
})

app.delete('/api/habitaciones/:id', function (req, res) {
    let habitacion = parseInt(req.params.id)

    db.delete()
        .from('habitaciones')
        .where('id', habitacion)
        .then(function (data) {
            res.json(data)
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
