//import product1 from '../../../public/Products/Masala_Dosa.jpg';
import product2 from '../../images/product-2.jpg';
import product3 from '../../images/product-3.jpg';
import sweet1 from '../../images/sweet3.jpg';
import sweet2 from '../../images/sweet-2.jpg';
import sweet3 from '../../images/sweet-3.jpg';

export const productData = [
  {
    img: process.env.PUBLIC_URL + '/Products/Masala_Dosa.jpg',//product1,
    alt: 'Dosa',
    name: 'Masala Dosa',
    desc:
      'Fresh and crispy dosa with coriendar leaves on the top served with chutney and sambar',
    price: '₹ 35',
    button: 'Add to Cart'
  },
  {
    img: process.env.PUBLIC_URL + '/Products/paneer-butter-masala.jpg',
    alt: 'Panner Butter Masala',
    name: 'Paneer Butter Masala',
    desc:
      ' Juicy Paneer cubes blended with rich kaju gravy and butter! (In Red Gravy)',
    price: '₹ 190',
    button: 'Add to Cart'
  },
  {
    img: process.env.PUBLIC_URL + '/Products/Pav_Bhaji.jpg',
    alt: 'Pav Bhaji',
    name: 'Pav Bhaji',
    desc:
      ' Delicious and Perfectly cooked bhaji served with coriendar leaves, onion and butterful Pav',
    price: '₹ 70',
    button: 'Add to Cart'
  }
];

export const productDataTwo = [
  {
    img: process.env.PUBLIC_URL + '/Products/Apple-Pie.jpg',
    alt: 'Apple Pie',
    name: 'Apple Pie',
    desc:
      'Cake outside Apple taste in the inside!',
    price: '₹ 125',
    button: 'Add to Cart'
  },
  {
    img: process.env.PUBLIC_URL + '/Products/fruit-salad.jpg',
    alt: 'Fruit Salad',
    name: 'Fruit Salad',
    desc:
      'Custad based white cremed fresh fruit mix',
    price: '₹ 110',
    button: 'Add to Cart'
  },
  {
    img: process.env.PUBLIC_URL + '/Products/Guiness_Brownies.jpg',
    alt: 'Chocolate Brownie',
    name: 'Chocolate Brownie',
    desc:
      'Chocolate dressing on the top of fresh & hot cake',
    price: '₹ 140',
    button: 'Add to Cart'
  }
];
