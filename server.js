import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';

import mongoString from './mongoDb.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(
  session({
    store: MongoStore.create({ mongoUrl: mongoString }),
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 500000,
    },
  })
);


app.post('/login', (req, res) =>{
  const user = req.body.userName
  req.session.user = user
  res.send(`Bienvenido ${req.session.user}`)
})

app.get('/', (req, res)=>{
  if (!req.session.userName) res.redirect('/login')
   else res.status(200).send('OK')
})

app.get('/logout', (req, res)=>{
  
})




// app.use(express.static('public'));



const connectedServer = app.listen(8080, () => {
  console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`);
});

connectedServer.on('error', (error) => console.log(`Error en servidor ${error}`));
