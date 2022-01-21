// ======= default data =======
const URL ="https://ac-w3-dom-pos.firebaseio.com/products.json"
const menu = document.querySelector("#menu");
const cart = document.querySelector("#cart");
const totalAmount = document.querySelector("#total-amount");
const submitButton = document.querySelector("#submit-button");
let productData = [];
let cartItems=[]
let htmlContentMeun=''
let total=0


// get API 取得菜單資料
axios.get(URL).then(response=>{
  productData=response.data
  displayMeun(productData)
}).catch(error=>{
  console.log(error)
})




// ======= 請從這裡開始 =======
function displayMeun(productData){


productData.forEach((data)=>{
  // for(data in productData){
  
    htmlContentMeun+=`<div class="col-3">
       <div class="card">
          <img src=${data.imgUrl} alt="...">
          <div class="card-body">
            <h5 class="card-title">${data.name}</h5>
            <p class="card-text">${data.price}</p>
            <a href="#" id="${data.id}" class="btn btn-primary" id="${data.id}">加入購物車</a>
          </div>
        </div>
      </div>`
  })
  
  menu.innerHTML=htmlContentMeun
}

//加入購物車
function addOrder(event){
  let target=event.target
  //取得產品id
  const id=target.id
  // 在productData裡找資料，找到相同id的產品，將資訊加入cartItems
  const addedproduct=productData.find(data=>data.id===id)
  const name=addedproduct.name
  const price=addedproduct.price
  // 加入購物車變數cartItems分：有+過、沒+過
  const targetItems=cartItems.find(data=>data.id===id)
  if(targetItems){
    targetItems.quantity+=1 
    const targetItemsQuantity=targetItems.quantity
    cartItems.forEach(data=>{
      if(data.id===targetItems.id){
        data.quantity===targetItemsQuantity
      }
    })
  }else {
    cartItems.push({
      id:id,
      name:name,
      price:price,
      quantity:1
    })
  }

  
//     if(cartItems.some(data=>data.id===id)){ 
//       console.log(cartItems.quantity)
//     return cartItems.quantity+=1  
    
//     } else {
//     cartItems.push({
//       id:id,
//       name:name,
//       price:price,
//       quantity:1
//     })
  
//     }
  
  //   畫面顯示購物車清單
  cart.innerHTML=cartItems.map(item=>`<li class="list-group-item">${item.name} X ${item.quantity}  小計：${item.price*item.quantity}</li>`).join('')
  
  // 計算總金額
  totalPrice(price)
}






// 計算總金額
function totalPrice(amount){
  total+=amount
  totalAmount.innerText=total
}

function submitOrder(event){
  if(totalPrice>0){
    alert(`感謝購買！\n總金額：${totalPrice}`)
  }else  {
    alert(`購物車是空的喔！趕快手刀購買！`)
    }
  cart.innerHTML=''
  totalAmount.innerHTML='--'
}


  

menu.addEventListener('click',addOrder)
submitButton.addEventListener('click',submitOrder)