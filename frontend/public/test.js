$(document).ready(function() {
  console.log("ready!");
  
  if (localStorage.getItem('xrp-cart-id') == null)
    localStorage.setItem('xrp-cart-id', generateUuid());
  refreshCartCheckout();
  
  $("body").on("click", ".xrpcart-checkout", async function () {
    window.location.href = "http://localhost:1337/xrp-cart/payment-page?id=" + localStorage.getItem('xrp-cart-id');
  });

  $("body").on("click", ".xrpcart-add-item", async function (e) {
    const data = $(this).data();
    data.xrpId = localStorage.getItem('xrp-cart-id');
    await fetchAPI('/xrp-cart/add-to-cart', {
      method: "post",
      body: JSON.stringify(data),
    });
    await refreshCartCheckout();
  });
});

async function refreshCartCheckout() {
  const myId = localStorage.getItem('xrp-cart-id');
  const storage = await fetchAPI('/xrp-cart/my-cart?id=' + myId);
  const totalPrice = storage.reduce((total, o) => total + o.itemPrice, 0);
  $(".xrpcart-total-price").text("$" + parseFloat(totalPrice).toFixed(2));
}

function getStrapiURL(path) {
  return "http://localhost:1337" + `${path}`;
}

// Helper to make GET requests to Strapi
async function fetchAPI(path, options = {}) {
  const requestUrl = getStrapiURL(path);
  const response = await fetch(requestUrl, options);
  const data = await response.json();
  return data;
}

function generateUuid(){
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid;
}