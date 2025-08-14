export interface Product{
    id : number
    title : string
    price : string
    description : string
    image : string
}

const products = [
  {
    id: 1,
    title: 'Shoes',
    price: '200 PKR',
    description: 'Hi I am here',
    image: "Product1.png",
  },
  {
    id: 2,
    title: 'T-Shirt',
    price: '500 PKR',
    description: 'Nice cotton fabric',
    image: 'Product2.png',
  },
  {
    id: 3,
    title: 'Cap',
    price: '100 PKR',
    description: 'Cool summer cap',
    image: 'Product3.png',
  },
  {
    id: 4,
    title: 'Watch',
    price: '999 PKR',
    description: 'Stylish wristwatch',
    image: 'Product4.png',
  },
];
export default products;