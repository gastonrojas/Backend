import { faker } from '@faker-js/faker';
faker.locale = 'es'

export default function generateProduct() {
  return {
    nombre: faker.commerce.productName(),
    precio: faker.random.numeric(5),
    image: faker.image.abstract(),
  }
}