import  express  from 'express';
import http from 'http'
import {Server} from 'socket.io'
import mongoose from 'mongoose';

import productsTest from './src/routes/products-test.js';
import connectionString from './mongo.js'



const app = express();
const server = http.createServer(app);
const io = new Server(server)


await mongoose.connect(connectionString);

const productsDb = mongoose.model('productos', new mongoose.Schema({
  nombre: String,
  precio: Number,
  imagen: String
}))

const messagesDb = mongoose.model('mensajes', new mongoose.Schema({
  author: Object,
  text: String
}))

io.on('connection', async (socket) => {
 const productos =  await productsDb.find({}, { _id: 0, __v: 0 })
 console.log(productos)
  socket.emit('products', productos);
  
  const messages = await messagesDb.find({}, { _id: 0, __v: 0 })
  socket.emit('messages', messages);
    


  socket.on('newProduct', async (newProduct) => {
    await productsDb.create(newProduct)
    const productos =  await productsDb.find({}, { _id: 0, __v: 0 })
    io.sockets.emit('products', productos);
  });

  socket.on('newMessage', async(newMessage)=>{
    await messagesDb.create(newMessage)
    const mensajes = await messagesDb.find({}, { _id: 0, __v: 0 })
    io.sockets.emit('messages', mensajes)

  })

});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api/productos-test', productsTest)

const connectedServer = server.listen(8080, () => {
  console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`);
});

connectedServer.on('error', (error) => console.log(`Error en servidor ${error}`));
