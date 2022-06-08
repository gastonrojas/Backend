import  express, { json }  from 'express';
import http from 'http'
import {Server} from 'socket.io'
import mongoose from 'mongoose';
import { normalize, denormalize, schema }from 'normalizr';
import util from 'util'



import productsTest from './src/routes/products-test.js';
import connectionString from './mongoDb.js'



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
 const productos = await productsDb.find({}, { _id: 0, __v: 0 }); 
  socket.emit('products', productos);
  // console.log(productos)
  const messages = await messagesDb.find().lean()
  const authorsSchema = new schema.Entity('authors')
  const messagesSchema = new schema.Entity('messages', { author: authorsSchema }, {idAttribute: '_id'})

  const normalizedMessages = normalize(messages, [messagesSchema])
  const messagesLength = JSON.stringify(messages).length
  const normalizedLength = JSON.stringify(normalizedMessages).length
  console.log(messagesLength, normalizedLength)

  console.log(util.inspect(normalizedMessages, false, 12, true))
// console.log(messages)
  socket.emit('messages', normalizedMessages);
  
    


  socket.on('newProduct', async (newProduct) => {
    await productsDb.create(newProduct)
    const productos =  await productsDb.find({}, { _id: 0, __v: 0 })
    io.sockets.emit('products', productos);
  });

  socket.on('newMessage', async(newMessage)=>{
    await messagesDb.create(newMessage)
    const messages = await messagesDb.find().lean()
    const normalizedMessages = normalize(messages, [messagesSchema])

    io.sockets.emit('messages', normalizedMessages)

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
