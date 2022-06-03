import Router from 'express';

import generateProduct from '../fakerProducts/fakerPorducts.js';
const productsTest = new Router


productsTest.get('/', (req, res)=>{
    const productsToShow = []
    for (let i = 0; i <= 4; i++){
        productsToShow.push(generateProduct())
    }

    res.send(productsToShow)
})

export default productsTest

