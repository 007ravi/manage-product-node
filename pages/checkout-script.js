var currentUser = getCurrentUser();
//if(currentUser.id!="") window.location.href="viewproducts";
var products = [];
var cart = [];
getCart();
//getProducts();
var total = 0;
var flag = false;
var divProductsTable = document.getElementById("divProductsTable");
var productTable = document.getElementById("productTable");
var tableBody = document.getElementById("tableBody");

displayUserInfo();
if (total > 0) var divTotal = document.getElementById("divTotal");
else productTable.setAttribute("style", "visibility:hidden;");

function saveCart(arr) {
  let xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/viewproducts?id=" + currentUser.id);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(arr));
}

async function getProducts(f) {
  let xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/getProducts");
  xhttp.send();
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      products = JSON.parse(xhttp.responseText);
      if (f == "checkout") {
        if (!flag) return;
        if (total <= 0) {
          alert("Cart is Empty !!!");
          return;
        }
        let f = checkAvailability();
        if (f === true) sendForOrder();
      } else {
        showProductTable();
        flag = true;
      }
    }
  };
}

function getCart() {
  let xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/getCart?id=" + currentUser.id);
  xhttp.send();
  xhttp.onreadystatechange = async () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      cart = JSON.parse(xhttp.responseText);
      await getProducts(flag);
    }
  };
}

function getCurrentUser() {
  if (sessionStorage.getItem("currentUser") == "")
    window.location.href = "login.html";
  return JSON.parse(sessionStorage.getItem("currentUser"));
}

function displayUserInfo() {
  if (currentUser != "") {
    var userInfo = document.getElementById("userInfo");
    userInfo.setAttribute("style", "text-align:right;font-size:20px;");
    userInfo.innerHTML =
      "Hello <b>" + currentUser.name.toUpperCase() + "</b> ! ";
    var Logout = document.createElement("button");
    Logout.setAttribute("onclick", "logout()");
    Logout.innerHTML = "LOGOUT";
    userInfo.appendChild(Logout);
  } else {
    window.location.href = "login.html";
  }
}

function logout() {
  currentUser = "";
  sessionStorage.setItem("currentUser", "");
  window.location.href = "login.html";
}

function insertBlankLine(targetElement) {
  var br = document.createElement("br");
  targetElement.appendChild(br);
}

function updateTotal() {
  let divTotal = document.getElementById("divTotal");
  divTotal.innerHTML = "<b>" + total + "</b>";
}

function deleteElementById(targetId) {
  var target = document.getElementById(targetId);
  target.parentNode.removeChild(target);
}

function deleteRowById(targetId) {
  let divTotal = document.getElementById("divTotal");
  var target = document.getElementById("row" + targetId);
  target.parentNode.removeChild(target);

  var cartIndex = findProductInCart(targetId);
  var productIndex = findProductIndexById(targetId);

  total -= cart[cartIndex].quantity * products[productIndex].price;
  divTotal.innerHTML = "<b>" + total + "</b>";

  if (total <= 0) productTable.setAttribute("style", "visibility:hidden;");

  cart.splice(cartIndex, 1);
  saveCart(cart);
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
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].product_id == id) {
      return i;
    }
  }
  return -1;
}

function sendForOrder() {
  for (var i = 0; i < cart.length; i++) {
    var productIndex = findProductIndexById(cart[i].product_id);
    if (productIndex < 0) {
      cart.splice(i, 1);
      continue;
    }
    products[productIndex].quantity -= cart[i].quantity;
  }
  //saveProducts(products);
  var today = new Date();
  var timestamp =
    today.getDate() +
    "-" +
    today.getMonth() +
    "-" +
    today.getFullYear() +
    " " +
    today.getHours() +
    ":" +
    today.getMinutes() +
    ":" +
    today.getSeconds();

  var order = new Object();
  order.user_id = currentUser.id;
  order.timestamp = timestamp;
  order.cart = cart;

  let xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/checkout");
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(order));

  xhttp.onreadystatechange = async () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      cart = [];
      await getProducts(flag);
      alert("Order Placed");
      continueShopping();
    }
  };
}

function checkAvailability() {
  var f = true;
  for (var i = 0; i < cart.length; i++) {
    var productIndex = findProductIndexById(cart[i].product_id);
    if (products[productIndex].quantity < cart[i].quantity) {
      var divError = document.createElement("div");
      divError.setAttribute("id", "error" + cart[i].product_id);
      divError.setAttribute("style", "color: red;");
      if (products[productIndex].quantity <= 0)
        divError.innerHTML = "Out of Stock";
      else
        divError.innerHTML =
          "Only " +
          products[productIndex].quantity +
          " units <br>left in Stock";
      var targetCell = document.getElementById("quantity" + cart[i].product_id);
      targetCell.appendChild(divError);
      f = false;
    }
  }
  flag = f;
  return f;
}

async function checkout() {
  await getProducts("checkout");
}

function continueShopping() {
  "";
  window.location.href = "viewproducts.html";
}

function nothing() {
  return;
}

function changeRowBG(rowId, flag) {
  if (flag == 1)
    document.getElementById(rowId).setAttribute("bgcolor", "#e0e0e0");
  else document.getElementById(rowId).setAttribute("bgcolor", "#ffffff");
}

function showProductTable() {
  if (tableBody.innerHTML != "") return;
  productTable.setAttribute(
    "style",
    "border-collapse:collapse;visibility:visible;"
  );
  total = 0;
  var productData, productRow;
  for (var i = 0; i < cart.length; i++) {
    var id = cart[i].product_id;
    var productIndex = findProductIndexById(id);
    if (productIndex < 0) {
      cart.splice(i, 1);
      continue;
    }
    productRow = document.createElement("tr");
    productRow.setAttribute("id", "row" + id);
    productRow.setAttribute("onmouseover", 'changeRowBG("row' + id + '",1)');
    productRow.setAttribute("onmouseleave", 'changeRowBG("row' + id + '",0)');

    productData = document.createElement("td");
    productData.innerHTML = products[productIndex].name;
    productRow.appendChild(productData);

    productData = document.createElement("td");
    productData.setAttribute("style", "text-align:center;");
    productData.innerHTML = products[productIndex].price;
    productRow.appendChild(productData);

    productData = document.createElement("td");
    productData.setAttribute("style", "text-align:center;");
    productData.setAttribute("id", "quantity" + id);
    productData.innerHTML = cart[i].quantity;
    productRow.appendChild(productData);

    productData = document.createElement("td");
    productData.setAttribute("id", "cost" + id);
    productData.setAttribute("style", "text-align:center;");
    productData.innerHTML =
      "<b>" + products[productIndex].price * cart[i].quantity + "</b>";
    productRow.appendChild(productData);

    productData = document.createElement("td");
    productData.setAttribute("style", "text-align:center;");
    var btnDelete = document.createElement("button");
    btnDelete.innerHTML = "Delete";
    btnDelete.setAttribute("onclick", 'deleteRowById("' + id + '")');
    productData.appendChild(btnDelete);
    productRow.appendChild(productData);

    tableBody.appendChild(productRow);

    total += products[productIndex].price * cart[i].quantity;
  }
  if (total == 0) {
    productTable.setAttribute("style", "visibility:hidden;");
    return;
  }

  productRow = document.createElement("tr");
  productData = document.createElement("td");
  productData.setAttribute("colspan", "3");
  productData.setAttribute(
    "style",
    "text-align:right;border:none;font-size:20px;"
  );
  productData.innerHTML = "TOTAL<b>:</b>";
  productRow.appendChild(productData);

  productData = document.createElement("td");
  productData.setAttribute("id", "divTotal");
  productData.setAttribute(
    "style",
    "text-align:center;border:none;font-size:20px;"
  );
  productData.innerHTML = "<b>" + total + "</b>";
  productRow.appendChild(productData);

  productTable.appendChild(productRow);
}