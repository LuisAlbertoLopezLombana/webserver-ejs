 const express = require('express');
 const path = require('path');
 const ejs = require('ejs');
 const app = express();
 const Container = require("typedi").Container;
 const uuid = require('node-uuid');
 const { LoggerController } = require('./controller/LoggerController');
 const pinoMultiStream = require('./config/pinoMultiStream');

 var loggerController = Container.get(LoggerController);

 console.log(pinoMultiStream);

 loggerController.logger.build('App', pinoMultiStream);

 app.use(addIdRequest());
 app.engine('.html', ejs.__express);
 app.set('views', path.join(__dirname, '/../views'));
 app.set('view engine', 'html');

 app.use(loggerController.logger.requestMid());
 app.use(loggerController.logger.afterResponseMid());

 let users = [
     { name: 'Sebastian', email: 'Sebastian@ejs.com' },
     { name: 'Ivan', email: 'Ivan@ejs.com' },
     { name: 'Luis Alberto', email: 'Luis@ejs.com' }
 ];


 app.get('/', (req, res) => {
     let response = { users, title: 'Ciclo en EJS', header: 'Usuarios' }
     res.status(200).render('users', response);
 });


 function addIdRequest() {
     return (req, res, next) => {
         req.id = uuid.v4();
         next();
     };
 }


 const port = process.env.PORT || 3000;

 app.set('port', port);
 const server = app.listen(app.get('port'), () => {
     console.log(`Express running → PORT ${server.address().port}`);
 });