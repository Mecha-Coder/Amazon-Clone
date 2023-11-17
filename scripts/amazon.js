import {products} from '../data/products.js';

let cart = []
let timerIdList = {};

//-------------------------------------------------------------------

// 1) Load product to page
const productGrid = document.querySelector('.products-grid')
loadProduct()


// 2) Load saved cart data if available |ELSE| use blank cart data
getLatestCart()

// 3) Add event listener - Add-Cart clicked, add to cart 
const addCartButton = document.querySelectorAll('.js-add-to-cart')

addCartButton.forEach((button)=>{
  button.addEventListener('click', () => {

    const {productId} = button.dataset;
    addToCart(productId);
    updateCartHeader()

  })
})

// Scripts ----------------------------------------------------

function loadProduct(){
  // Load all products on the page using products.js file

  let addProduct = ''
  products.forEach((product) => {

    addProduct += `
      <div class="product-container">

        <div class="product-image-container">
          <img class="product-image"
          src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="images/ratings/rating-${product.rating.stars*10}.png">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          $${toDollar(product.priceCents)}
        </div>

        <div class="product-quantity-container">
          <select class=quantity-selector-${product.id}>
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>

        <div class="product-spacer"></div>

        <div class="added-to-cart added-msg-${product.id}">
          <img src="images/icons/checkmark.png">
            Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart"
          data-product-id="${product.id}">
          Add to Cart
        </button>

      </div>`
  })  
  productGrid.innerHTML += addProduct;
}

function getLatestCart(){
  const savedData = localStorage.getItem('cart')

  if(savedData){
    cart = JSON.parse(savedData) 
  }   
  updateCartHeader()
}

function addToCart(currentProductID){

  // Check if product already exit in cart
  let itemMatched;

  for(let i=0 ; i<cart.length ; i++){
    if(cart[i].productId === currentProductID){
      itemMatched = cart[i];
      break;
    }
  }

  // Add product with reqested quantity |OR| update quantity 
  const requestedQty = document.querySelector(`.quantity-selector-${currentProductID}`)

  if (itemMatched) {
    itemMatched.quantity += Number(requestedQty.value)
  } else {
    cart.push(
      {
        productId: currentProductID,
        quantity: Number(requestedQty.value),
      }
    )
  }

  // Reset quantity selector dropdown after item is added to cart
  requestedQty.value = 1;

  //Save latest cart data to local storage
  localStorage.setItem ('cart',JSON.stringify(cart))
  
  // Display added message (with delay animation)
  const addMsg = document.querySelector(`.added-msg-${currentProductID}`)

  addMsg.classList.add('appear') //Change opacity to 1
    
      // Track timer and reset accordingly
      if(timerIdList[currentProductID]){
        clearInterval(timerIdList[currentProductID])
      }

      let timerID = setTimeout(() => {addMsg.classList.remove('appear')},1250)
      timerIdList[currentProductID] = timerID

}

function updateCartHeader(){

  const cartQuantity = document.querySelector('.cart-quantity')
  let countCart = 0
  cart.forEach((item) => {countCart+=item.quantity})
  
  if (countCart){
    cartQuantity.innerText = countCart
  } else
    cartQuantity.innerText = ''
}

function toDollar(cents){
  return (cents/100).toFixed(2)
}