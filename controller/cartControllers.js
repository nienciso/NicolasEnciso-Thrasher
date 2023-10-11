

let cart = {};

function addToCart(productId) {
  console.log(`El producto ${productId} se está agregando al carrito`);

  let cart = JSON.parse(localStorage.getItem('cart')) || {};
  console.log('El carrito actual es:', cart);

  cart[productId] = (cart[productId] || 0) + 1;
  localStorage.setItem('cart', JSON.stringify(cart));

  const cartCount = document.getElementById('cart-count');
  cartCount.innerHTML = Object.values(cart).reduce((a, b) => a + b, 0);
  console.log('El contador de carrito es:', cartCount);

  const productCount = document.getElementById(`product-count-${productId}`);
  if (productCount) {
    productCount.innerHTML = parseInt(productCount.innerHTML) + 1;
  }
  console.log('El contador de producto es:', productCount);
}

const showCart = async (req, res) => {
  try {
    const productos = await Producto.find();
    cart = req.session.cart || {}; // Actualiza el valor de la variable "cart" con los valores almacenados en la sesión
    let cartCount = 0;
    Object.keys(cart).forEach((key) => {
      cartCount += cart[key];
    });
    res.render('cart', { productos, cart, cartCount });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

module.exports = {
  addToCart,
  showCart
};