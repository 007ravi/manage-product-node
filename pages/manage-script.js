var count = 0;
var products = []; //console.log(products);
var aAddProduct = document.getElementById("aAddProduct");
var divProductList = document.getElementById("divProductList");
var divForm = document.getElementById("divForm");

divForm.setAttribute("style", "visibility:hidden");
getProducts();

function insertBlankLine(targetElement) {
  var br = document.createElement("br");
  targetElement.appendChild(br);
}

function deleteElementById(targetId) {
  var target = document.getElementById(targetId);
  target.parentNode.removeChild(target);
  let productIndex = findProductIndexById(targetId);
  saveProduct(products[productIndex], "delete");
  products.splice(products[productIndex], 1);
}

function findProductIndexById(id) {
  for (var i = 0; i < products.length; i++) {
    if (products[i].id == id) {
      return i;
    }
  }
  return -1;
}

function updateFormValues(id) {
  showForm("edit");

  var productIndex = findProductIndexById(id);
  var formNodes = divForm.childNodes;

  formNodes[2].setAttribute("value", products[productIndex].name);
  formNodes[8].setAttribute("value", products[productIndex].quantity);
  formNodes[5].setAttribute("value", products[productIndex].price);
  formNodes[11].setAttribute("value", products[productIndex].description);

  var btnUpdate = document.createElement("button");
  btnUpdate.innerHTML = "UPDATE";
  btnUpdate.addEventListener("click", function() {
    changeValuesById(id);
  });

  divForm.appendChild(btnUpdate);
}

function updateArray(productIndex) {
  products[productIndex].name = document.getElementById("productName").value;
  products[productIndex].quantity = parseInt(
    document.getElementById("productQuantity").value
  );
  products[productIndex].price = parseInt(
    document.getElementById("productPrice").value
  );
  products[productIndex].description = document.getElementById(
    "productDescription"
  ).value;
  saveProduct(products[productIndex], "update");
}

function changeValuesById(id) {
  var productNodes = document.getElementById(id).childNodes;
  var productIndex = findProductIndexById(id);

  updateArray(productIndex);

  productNodes[0].nodeValue = "Name: " + products[productIndex].name;
  productNodes[2].nodeValue = "Price: " + products[productIndex].price;
  productNodes[4].nodeValue = "Quantity: " + products[productIndex].quantity;
  productNodes[6].nodeValue =
    "Description: " + products[productIndex].description;

  while (divForm.firstChild) {
    divForm.removeChild(divForm.firstChild);
  }
  divForm.setAttribute("style", "visibility:hidden");
  aAddProduct.setAttribute("style", "visibility:visible");
}

function showForm(formType) {
  aAddProduct.setAttribute("style", "visibility:hidden");
  divForm.setAttribute("style", "visibility:visible");
  //divProductList.setAttribute('style','visibility:hidden');
  while (divForm.firstChild) {
    divForm.removeChild(divForm.firstChild);
  }
  var text = document.createElement("h2");
  //text.innerHTML = "Add New Product";
  if (formType == "add") text.innerHTML = "Add New Product";
  else text.innerHTML = "Edit Product";
  divForm.appendChild(text);
  insertBlankLine(divForm);

  var inputName = document.createElement("input");
  inputName.setAttribute("type", "text");
  inputName.setAttribute("id", "productName");
  inputName.setAttribute("placeholder", "Enter Product Name");
  inputName.setAttribute("style", "height:30px;width:250px;");
  divForm.appendChild(inputName);

  insertBlankLine(divForm);
  insertBlankLine(divForm);

  var inputPrice = document.createElement("input");
  inputPrice.setAttribute("type", "number");
  inputPrice.setAttribute("id", "productPrice");
  inputPrice.setAttribute("placeholder", "Enter Product Price");
  inputPrice.setAttribute("style", "height:30px;width:250px;");
  divForm.appendChild(inputPrice);

  insertBlankLine(divForm);
  insertBlankLine(divForm);

  var inputQuantity = document.createElement("input");
  inputQuantity.setAttribute("type", "number");
  inputQuantity.setAttribute("id", "productQuantity");
  inputQuantity.setAttribute("placeholder", "Enter Product Quantity");
  inputQuantity.setAttribute("style", "height:30px;width:250px;");
  divForm.appendChild(inputQuantity);

  insertBlankLine(divForm);
  insertBlankLine(divForm);

  var inputDescription = document.createElement("input");
  inputPrice.setAttribute("type", "text");
  inputDescription.setAttribute("placeholder", "Enter Product Description");
  inputDescription.setAttribute("id", "productDescription");
  inputDescription.setAttribute("style", "height:70px;width:320px;");
  divForm.appendChild(inputDescription);

  insertBlankLine(divForm);
  insertBlankLine(divForm);

  var btnCancel = document.createElement("button");
  btnCancel.setAttribute("id", "btnCancel");
  btnCancel.innerHTML = "CANCEL";
  btnCancel.addEventListener("click", function() {
    while (divForm.firstChild) {
      divForm.removeChild(divForm.firstChild);
    }
    divForm.setAttribute("style", "visibility:hidden");
    aAddProduct.setAttribute("style", "visibility:visible");
    //divProductList.setAttribute('style','visibility:visible');
  });

  divForm.appendChild(btnCancel);
}

function saveProduct(product, action) {
  let xhttp = new XMLHttpRequest(),
    alreadyExist = product.id == "temp" ? false : true;
  xhttp.open("POST", "/manageproducts?action=" + action);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(product));

  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200 && !alreadyExist) {
      product.id = xhttp.responseText;
      products.push(product);
      addProductToDOM(product);
    }
  };
}

function updateCount() {
  if (products.length == 0) count = 1;
  else count = parseInt(products[products.length - 1].id.substring(7)) + 1;
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

function addProductToDOM(obj) {
  var product = document.createElement("div");
  var id = obj.id;
  currentId = id;
  product.setAttribute("id", id);
  product.setAttribute("padding", "20px");
  product.setAttribute("style","height:100px");
  product.setAttribute("style","border:ridge");
 

  var text = document.createTextNode("Name: " + obj.name);
  product.appendChild(text);
  insertBlankLine(product);

  text = document.createTextNode("Price: " + obj.price);
  product.appendChild(text);
  insertBlankLine(product);

  text = document.createTextNode("Quantity: " + obj.quantity);
  product.appendChild(text);
  insertBlankLine(product);

  text = document.createTextNode("Description: " + obj.description);
  product.appendChild(text);
  insertBlankLine(product);

  var btnDelete = document.createElement("button");
  btnDelete.innerHTML = "Delete";
  btnDelete.setAttribute("onclick", 'deleteElementById("' + id + '")');
  product.appendChild(btnDelete);

  var btnEdit = document.createElement("button");
  btnEdit.innerHTML = "Edit";
  btnEdit.setAttribute("onclick", 'updateFormValues("' + id + '")');
  product.appendChild(btnEdit);

  insertBlankLine(product);
  insertBlankLine(product);

  divProductList.appendChild(product);
}

aAddProduct.addEventListener("click", function() {
  showForm("add");
  var name = document.getElementById("productName");
  var price = document.getElementById("productPrice");
  var quantity = document.getElementById("productQuantity");
  var description = document.getElementById("productDescription");

  var btnSubmit = document.createElement("button");
  btnSubmit.setAttribute("id", "btnSubmit");

  btnSubmit.innerHTML = "SUBMIT";
  btnSubmit.addEventListener("click", function() {
    if (
      name.value != "" &&
      price.value > 0 &&
      quantity.value > 0 &&
      description.value != ""
    ) {
      var obj = new Object();
      obj.id = "temp";
      obj.name = name.value;
      obj.price = parseInt(price.value);
      obj.quantity = parseInt(quantity.value);
      obj.description = description.value;

      saveProduct(obj, "insert");
    }

    while (divForm.firstChild) {
      divForm.removeChild(divForm.firstChild);
    }
    divForm.setAttribute("style", "visibility:hidden");
    aAddProduct.setAttribute("style", "visibility:visible");
  });

  divForm.appendChild(btnSubmit);
});

function renderProducts() {
  while (divProductList.firstChild) {
    divProductList.removeChild(divProductList.firstChild);
  }

  for (var i = 0; i < products.length; i++) {
    var product = document.createElement("div");
    var id = products[i].id;

    product.setAttribute("id", id);
    product.setAttribute("padding", "20px");
    product.setAttribute("style","height:100px,width:100px");
    product.setAttribute("style","border:ridge");
    
    var text = document.createTextNode("Name: " + products[i].name);
    product.appendChild(text);
    insertBlankLine(product);

    text = document.createTextNode("Price: " + products[i].price);
    product.appendChild(text);
    insertBlankLine(product);

    text = document.createTextNode("Quantity: " + products[i].quantity);
    product.appendChild(text);
    insertBlankLine(product);

    text = document.createTextNode("Description: " + products[i].description);
    product.appendChild(text);
    insertBlankLine(product);

    var btnDelete = document.createElement("button");
    btnDelete.innerHTML = "Delete";
    btnDelete.setAttribute("onclick", 'deleteElementById("' + id + '")');
    product.appendChild(btnDelete);

    var btnEdit = document.createElement("button");
    btnEdit.innerHTML = "Edit";
    btnEdit.setAttribute("onclick", 'updateFormValues("' + id + '")');
    product.appendChild(btnEdit);

    insertBlankLine(product);
    insertBlankLine(product);

    divProductList.appendChild(product);
  }
}
