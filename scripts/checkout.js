import {products} from '../data/products.js'
let sumShipCost = {};

//---------------------------------------------------------
// 1) Load cart data
let cart = '';
loadCartData() 


// 2) Load orders based on cart info
const orderGrid = document.querySelector('.order-summary')
loadOrderSummary()


// 3) Update item quantity - header & Order Summary Box
updateItemQty()


// 4) Calculate cost summary
printCostSummary()

// 5) Add event listener 
//   [a] click delete, remove order from page & cart update
const deleteOrderLink = document.querySelectorAll('.delete-quantity-link')
clickDelete()



//   [b] clicked update, request user-input for latest quantity
const updateQtyLink = document.querySelectorAll('.update-quantity-link')
clickUpdate()


//   [c] clicked save, display saved quantity & update cart
const saveQtyLink = document.querySelectorAll('.save-quantity-link')
clickSave()


//   [d] click delivery options, update delivery date & calculation
const radioButton = document.querySelectorAll('.delivery-option-input') 
clickRadioButton()


// Scripts -------------------------------------------------


function loadCartData(){
  const savedData = localStorage.getItem('cart')

  if(savedData){
    cart = JSON.parse(savedData); 
  } else {
    
  } 
}

function loadOrderSummary(){
  let orderList = '';

cart.forEach((item)=>{
  
  // From item ID, get product details
  let productDetail = getProductDetail(item.productId)
    
  //Generate order HTML list
  orderList +=  
   `<div class="cart-item-container js-select-${item.productId}">

      <div class="delivery-date display-delivery-${item.productId}">
        Delivery date: Tuesday, June 21
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
        src="${productDetail.image}">

        <div class="cart-item-details">
            <div class="product-name">
              ${productDetail.name}
            </div>
            <div class="product-price">
              $${(productDetail.priceCents/100).toFixed(2)}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label hide-${item.productId} 
                quantity-${item.productId} show">
                ${item.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary hide-${item.productId} show"
              data-product-id=${item.productId}>
                Update
              </span>
                            
              <select class="quantity-input link-primary edit-panel-${item.productId} 
              selector-${item.productId}">
                  <option value="1">1</option>
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

              <span class="save-quantity-link link-primary edit-panel-${item.productId}"
              data-product-id=${item.productId}>
                Save
              </span>
              
              <span class="delete-quantity-link link-primary" 
              data-product-id=${item.productId}>
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>

            <div class="delivery-option">
              <input type="radio" checked
                class="delivery-option-input"
                name="delivery-option-${item.productId}"
                data-product-id="${item.productId}"
                data-delivery-date="Tuesday, June 21"
                data-shipping-cost= 0
                >
              <div>
                <div class="delivery-option-date">
                  Tuesday, June 21
                </div>
                <div class="delivery-option-price">
                  FREE Shipping
                </div>
              </div>
            </div>

            <div class="delivery-option">
              <input type="radio"
                class="delivery-option-input"
                name="delivery-option-${item.productId}"
                data-product-id="${item.productId}"
                data-delivery-date="Wednesday, June 15"
                data-shipping-cost= 499
                >
              <div>
                <div class="delivery-option-date">
                  Wednesday, June 15
                </div>
                <div class="delivery-option-price">
                  $4.99 - Shipping
                </div>
              </div>
            </div>

            <div class="delivery-option">
              <input type="radio"
                class="delivery-option-input"
                name="delivery-option-${item.productId}"
                data-product-id="${item.productId}"
                data-delivery-date="Monday, June 13"
                data-shipping-cost= 999
                >
              <div>
                <div class="delivery-option-date">
                  Monday, June 13
                </div>
                <div class="delivery-option-price">
                  $9.99 - Shipping
                </div>
              </div>
            </div>

          </div>

      </div>
  </div>`

  // Set default shipping cost to zero
  sumShipCost[item.productId] = 0;
})

orderGrid.innerHTML = orderList
}

function removeOrder(currentProductID){

  for(let i=0; i<cart.length ; i++){
    if(cart[i].productId === currentProductID){

      // Remove order from cart
      cart.splice(i,1);

      // Remove order from page
      document.querySelector(`.js-select-${currentProductID}`).remove();

      // Delete detail from sumShipCost
      delete sumShipCost[currentProductID];

      // Save latest cart data to local storage
      localStorage.setItem ('cart',JSON.stringify(cart));

      break;
    }
  }
}

function updateItemQty(){

  let countCart = 0
  cart.forEach((item) => {countCart+=item.quantity})
  
  // Update item quantity @ payment-summary
  document.querySelector('.update-qty-2').innerHTML = `Items(${countCart}):`

  // Update item quantity @ header-checkout
  countCart ? document.querySelector('.update-qty-1').innerHTML = `${countCart} items` :
              document.querySelector('.update-qty-1').innerHTML = 'No item'
    
}

function clickDelete(){

  deleteOrderLink.forEach((link) => {
    link.addEventListener('click',() => {
      
      const {productId} = link.dataset;
      removeOrder(productId)
      updateItemQty()
      printCostSummary()
    })
  })
}

function clickUpdate(){

  updateQtyLink.forEach((link)=>{
    link.addEventListener('click', ()=> {
  
      const {productId} = link.dataset;

      // Set dropdown selector value per actual quantity instead of 1
      const qtySelector = document.querySelector(`.selector-${productId}`)
      const qtyActual = document.querySelector(`.quantity-${productId}`)

      qtySelector.value = qtyActual.innerText
      
      
      // Show quantity edit panel
      document.querySelectorAll(`.edit-panel-${productId}`).forEach((element) => {
        element.classList.add('show')
      })
      
      // Hide, current quantity no. & Update link
      document.querySelectorAll(`.hide-${productId}`).forEach((element) => {
        element.classList.remove('show')
      })

    })
  })
}

function clickSave(){

  saveQtyLink.forEach((link)=>{
    link.addEventListener('click', ()=> {
  
      const {productId} = link.dataset;

      // Update page quantity
      const qtySelector = document.querySelector(`.selector-${productId}`)
      const qtyActual = document.querySelector(`.quantity-${productId}`)

      qtyActual.innerText = qtySelector.value

      // Update cart quantity
      saveNewQty(productId,Number(qtySelector.value))

      // Update quantity @ header & order-summary
      updateItemQty()

      // Hide quantity edit panel
      document.querySelectorAll(`.edit-panel-${productId}`).forEach((element) => {
        element.classList.remove('show')
      })
      
      // Re-appear, current quantity no. & Update link
      document.querySelectorAll(`.hide-${productId}`).forEach((element) => {
        element.classList.add('show')
      })

      // Recalculate cost
      printCostSummary()
  
    })
  })

}

function saveNewQty(currentProductID,newQty){
  
  for(let i=0; i<cart.length ; i++){
    if(cart[i].productId === currentProductID){

      // Update quantity in cart item
      cart[i].quantity = newQty
      // Save latest cart data to local storage
      localStorage.setItem ('cart',JSON.stringify(cart))
      break;
    }
  }
}

function clickRadioButton(){
  radioButton.forEach((button) => {
    button.addEventListener('click', ()=> {
  
      const {productId, deliveryDate, shippingCost} = button.dataset
      
      // Update selected delivery date
      const displayDelivery = document.querySelector(`.display-delivery-${productId}`)
      displayDelivery.innerText = `Delivery date: ${deliveryDate}`

      // Update cost in sumShipCost object
      sumShipCost[productId] = Number(shippingCost)

      //Recalculate cost
      printCostSummary()
    })
  })
}

function getProductDetail(currentProductID){
  //Using the current Product ID, search matching product in product.js
  //Return: product object will contains product details

  let productDetail;
  for(let i=0; i<products.length ; i++){

    if (products[i].id === currentProductID){
      productDetail = products[i];
      return productDetail;
    }
  }

}

function toDollar(cents){
  return (cents/100).toFixed(2)
}

function printCostSummary(){

  let costItems = 0;
  let costShipping = 0;
  let costItemShip = 0;
  let costTax = 0;
  let costTotal = 0;

  cart.forEach((item) => {

    // From item ID, get product details
    let productDetail = getProductDetail(item.productId);
 
    costItems    += productDetail.priceCents *  item.quantity;
    costShipping += sumShipCost[item.productId]
    
  })

  costItemShip = costItems + costShipping
  costTax   = Math.floor(costItemShip / 10)
  costTotal = costItemShip + costTax

  // Display cost summary on page
  document.querySelector('.cost-items').innerText     = `$${toDollar(costItems)}`;
  document.querySelector('.cost-shipping').innerText  = `$${toDollar(costShipping)}`;
  document.querySelector('.cost-item-ship').innerText = `$${toDollar(costItemShip)}`;
  document.querySelector('.cost-tax').innerText       = `$${toDollar(costTax )}`;
  document.querySelector('.cost-total').innerText     = `$ ${toDollar(costTotal)}`;
}

