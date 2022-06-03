import mongoose from 'mongoose';
const mongoose = require('mongoose')

await mongoose.connect('mongodb+srv://root:mongoatlaspassword@productos.txyub.mongodb.net/?retryWrites=true&w=majority');

class MongodbContainer {
  constructor(collection, schema) {
    this.db = mongoose.model(collection, schema);
  }

  async save(name, description, image, price) {
    const allProdcts = await this.getAll();
    await this.db.create({
      id: !allProdcts.length ? 1 : parseInt(allProdcts[allProdcts.length - 1].id) + 1,
      nombre: name || `caja`,
      descripcion: description || `misteriosa`,
      foto: image || `https://eldiadehoy.net/wp-content/uploads/2016/09/caja-simpsons.jpg`,
      precio: price || 45000,
      stock: 420,
    });
  }

  async getAll() {
    return await this.db.find({}, { _id: 0, __v: 0 });
  }

  async getById(i) {
    return await this.db.findOne({ id: i }, { _id: 0, __v: 0 });
  }

  async deleteById(id) {
    const toDelete = await this.getById(id)
    if(!toDelete)return false
    await this.db.deleteOne({ id: id });
    return true
  }

  async updateProduct(id, name, description, image, price, stock) {
    const toUpdate = await this.getById(id);
    if(!toUpdate) return false
    await this.db.updateOne(
      { id: id },
      {
        $set: {
          id: id,
          nombre: name || toUpdate.nombre,
          descripcion: description || toUpdate.descripcion,
          foto: image || toUpdate.foto,
          precio: price || toUpdate.precio,
          stock: stock || toUpdate.stock,
        },
      }
    );
    return true
  }

  async deleteAll() {
    await this.db.deleteMany();
  }
  async addNewCart() {
    const allCarts = await this.getAll();

    await this.db.create({
      id: !allCarts.length ? 1 : parseInt(allCarts[allCarts.length - 1].id) + 1,
      productos: [],
    });
  }

  async addToCart(id, idProduct) {
    const productsCollection = await mongoose.model('productos')
  
    const productToAdd = await  productsCollection.findOne({ id: idProduct }, { _id: 0, __v: 0 });

    if(!productToAdd) return 'Ups... no encontramos el producto que deseas agregar...'
    const cartToUpdate = await this.getById(id);
    if(!cartToUpdate) return 'Ups... no encontramos el carrito!!! oh por dias!'
    cartToUpdate.productos.push(productToAdd);

    await this.db.updateOne(
      { id: id },
      {
        $set: {
          productos: cartToUpdate.productos,
        },
      }
    );
    return true
  }

  async getCartProducts(id) {
    const cartProducts = await this.getById(id);
    return cartProducts.productos;
  }

  async deleteProductFromCart(id, idProduct) {
    const cart = await this.getById(id);
    
    if (!cart) return `Ups! No encontramos el carrito que buscas...`;
    const productIndex = cart.productos.findIndex((prod) => prod.id == idProduct);
    if (productIndex > -1) {
      cart.productos = cart.productos.slice(0, productIndex).concat(cart.productos.slice(productIndex + 1));
    } else if (productIndex === -1) return `Ups! No encontramos ese producto en tu carrito`;

    await this.db.updateOne(
      { id: id },
      {
        $set: {
          productos: [...cart.productos],
        },
      }
    );
    return true
  }

  async emptyCart(id){
    const cartToEmpty = await this.getById(id)
    if(!cartToEmpty) return 'Ups... no encontramos ese carrito che'
    await this.db.updateOne(
        { id: id },
        {
          $set: {
            productos: [],
          },
        }
      );
      return true
  }
}

const products = new MongodbContainer('productos', {
    
})