const socket = io();

socket.on('products', (products) => handleProducts(products));

socket.on('messages', (messages) => {
  showMessages(messages);
});

const addProductForm = document.getElementById('formAddProduct');
addProductForm.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log(addProductForm[1].value);
  const product = {
    nombre: addProductForm[0].value, // document.getElementById('txtNombre').value
    precio: addProductForm[1].value, // document.getElementById('txtApellido').value
    imagen: addProductForm[2].value,
  };

  socket.emit('newProduct', product);

  addProductForm.reset();
});

async function handleProducts(products) {
  const recursoRemoto = await fetch('views/index.handlebars');
  const layoutText = await recursoRemoto.text();
  const functionTemplate = Handlebars.compile(layoutText);
  const html = functionTemplate({ products });
  document.getElementById('products').innerHTML = html;
}

function showMessages(messages) {
  const authorsSchema = new normalizr.schema.Entity('authors');
  const messagesSchema = new normalizr.schema.Entity('messages', { author: authorsSchema }, { idAttribute: '_id' });
  const denormalizedMessages = normalizr.denormalize(messages.result, [messagesSchema], messages.entities);

  console.log(denormalizedMessages, messages);

  const mensajesParaMostrar = denormalizedMessages.map(({ author, text }) => {
    return `<li style="width:100%"><strong style="color:blue;display:inline;">${author.id}</strong> - <p style='color:brown;display:inline;'>${author.nombre} ${author.apellido} </p> <div style="width:35px;heght:35px"><img class="img-thumbnail " src=${author.avatar} alt='sin avatar'></div><i style='color:green;display: block; overflow-wrap: break-word'>${text}</i></li>\n`;
  });

  const show = mensajesParaMostrar.join(`\n`);
  const listaMensajes = document.getElementById('messages');
  listaMensajes.innerHTML = show;

  const showCompressionDiv = document.getElementById('compresion')
  // console.log('normalizado :',JSON.stringify(messages).length, 'Desnorm :', JSON.stringify(denormalizedMessages).length)
}

const sendButton = document.getElementById('send');

sendButton.addEventListener('click', (e) => {
  e.preventDefault();

  const inputEmail = document.getElementById('inputEmail');
  const inputMessage = document.getElementById('inputMessage');
  const inputNombre = document.getElementById('inputNombre');
  const inputApellido = document.getElementById('inputApellido');
  const inputEdad = document.getElementById('inputEdad');
  const inputAvatar = document.getElementById('inputAvatar');

  if (inputEmail.value && inputMessage.value) {
    const message = {
      author: {
        id: inputEmail.value,
        nombre: inputNombre.value,
        apellido: inputApellido.value,
        edad: inputEdad.value,
        avatar: inputAvatar.value,
      },
      text: inputMessage.value,
    };
    socket.emit('newMessage', message);
  } else {
    alert('ingrese algun mensaje');
  }
});
