const express = require('express');
const path = require('path');
const ejs = require('ejs');
const app = express();

const port = process.env.PORT || 3000;

app.engine('.html', ejs.__express);
app.set('views', path.join(__dirname, '/../views'));
app.set('view engine', 'html');

let users = [
    { name: 'Sebastian', email: 'Sebastian@ejs.com' },
    { name: 'Ivan', email: 'Ivan@ejs.com' },
    { name: 'Luis Alberto', email: 'Luis@ejs.com' }
];


app.use('/', function(req, res) {
    return res.render('users', { users, title: 'Ciclo en EJS', header: 'Usuarios' });
});

app.listen(port, () => {
    console.log(`Escuchando peticiones en el puerto ${port}`);
});