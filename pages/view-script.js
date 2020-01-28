var currentUser = getCurrentUser();
var products = [];
var cart = [];
var divProductList = document.getElementById("divProductList");

displayUserInfo();
getProducts();
getCart();

function saveCart(cartItem, productIndex) {
  if (productIndex < 0) cart.push(cartItem);
  else cart[productIndex].quantity += parseInt(cartItem.quantity);

  let xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/viewproducts?id=" + currentUser.id);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(cart));
}

function getProducts() {
  let xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/getProducts");
  xhttp.send();
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      products = JSON.parse(xhttp.responseText);
      renderProducts();
    }
  };
}

function getCart() {
  let xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/getCart?id=" + currentUser.id);
  xhttp.send();
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      cart = JSON.parse(xhttp.responseText);
    }
  };
}

function getCurrentUser() {
  if (sessionStorage.getItem("currentUser") == "")
    window.location.href = "login";
  return JSON.parse(sessionStorage.getItem("currentUser"));
}

function displayUserInfo() {
  if (currentUser != "") {
    var userInfo = document.getElementById("userInfo");
    userInfo.setAttribute("style", "text-align:left;font-size:20px;");
    userInfo.innerHTML =
      "<b> <i>" + currentUser.name.toUpperCase() + "</b> </i> ";
    var Logout = document.createElement("button");
    Logout.setAttribute("onclick", "logout()");
    Logout.innerHTML = "LOGOUT";
    userInfo.appendChild(Logout);
  } else {
    window.location.href = "login";
  }
}

function logout() {
  sessionStorage.setItem("currentUser", "");
  window.location.href = "login";
}

function insertBlankLine(targetElement) {
  var br = document.createElement("br");
  targetElement.appendChild(br);
}

function deleteElementById(targetId) {
  var target = document.getElementById(targetId);
  target.parentNode.removeChild(target);
  products.splice(findProductIndexById(id), 1);
  saveProducts(products);
}

function findProductIndexById(id) {
  for (var i = 0; i < products.length; i++) {
    if (products[i].id == id) {
      return i;
    }
  }
  return -1;
}

function findProductInCart(id) {
  if (cart.length < 0) return -1;
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].product_id == id) {
      return i;
    }
  }
  return -1;
}

function saveProducts(products) {
  localStorage.products = JSON.stringify(products);
}

function checkQuantity(i, id) {
  var currentCartQuantity = 0;
  var cartIndex = findProductInCart(id);
  if (cartIndex >= 0) currentCartQuantity = cart[cartIndex].quantity;
  var maxValue = products[i].quantity - currentCartQuantity;
  var inputValue = document.getElementById("quantity" + id).value;
  var error = document.getElementById("error" + id);
  if (inputValue > maxValue)
    error.innerHTML = "Input exceeds the quantity available";
  else if (inputValue < 0) error.innerHTML = "Invalid Input";
  else error.innerHTML = "";
}

function addToCart(id) {
  var error = document.getElementById("error" + id);
  var inputValue = document.getElementById("quantity" + id);
  if (inputValue.value < 1) error.innerHTML = "Invalid Input";
  if (error.innerHTML != "") {
    return;
  }
  var productIndex = findProductInCart(id);
  var obj = new Object();
  obj.product_id = id;
  obj.quantity = parseInt(inputValue.value);
  inputValue.value = "";

  saveCart(obj, productIndex);
}

function renderProducts() {
  for (var i = 0; i < products.length; i++) {
    var product = document.createElement("div");
    var id = products[i].id;

    product.setAttribute("id", id);
    product.setAttribute("padding", "20px");
    var text = document.createTextNode("Name: " + products[i].name);
    product.appendChild(text);
    insertBlankLine(product);

    text = document.createTextNode("Price: " + products[i].price);
    product.appendChild(text);
    insertBlankLine(product);

    text = document.createTextNode("Description: " + products[i].description);
    product.appendChild(text);
    insertBlankLine(product);

    var inputQuantity = document.createElement("input");
    inputQuantity.setAttribute("type", "number");
    //inputQuantity.setAttribute("onblur", "this.value=''");
    inputQuantity.setAttribute("id", "quantity" + id);
    inputQuantity.setAttribute("placeholder", "Enter Product Quantity");
    inputQuantity.setAttribute("style", "width:170px;");
    inputQuantity.setAttribute(
      "onkeyup",
      "checkQuantity(" + i + ',"' + id + '")'
    );
    inputQuantity.setAttribute("min", "1");
    inputQuantity.setAttribute("max", "" + products[i].quantity + "");
    product.appendChild(inputQuantity);

    var btnAddToCart = document.createElement("button");
    btnAddToCart.innerHTML = "Add to Cart";
    btnAddToCart.setAttribute("style", "margin:10px;");
    btnAddToCart.setAttribute("onclick", 'addToCart("' + id + '")');
    product.appendChild(btnAddToCart);

    var divError = document.createElement("div");
    divError.setAttribute("id", "error" + id);
    divError.setAttribute("style", "color: red;");
    divError.innerHTML = "";

    product.appendChild(divError);

    insertBlankLine(product);
    insertBlankLine(product);

    divProductList.appendChild(product);
  }
}
