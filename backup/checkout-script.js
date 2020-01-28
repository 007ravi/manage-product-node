var currentUserId = getCurrentUser();
var users=getUsers();
//if(currentUserId!="") window.location.href="viewproducts.html";
var carts = getCarts();
var cartArrayIndex = findCartIndex(currentUserId);
var cart = carts[cartArrayIndex].cart;
var products = getProducts();
var total = 0;
var divProductsTable = document.getElementById("divProductsTable");
var productTable = document.getElementById("productTable");
var tableBody = document.getElementById("tableBody");

function saveCarts(cart)
{    
    carts[cartArrayIndex].cart = cart;
    localStorage.carts = JSON.stringify(carts);
}

function getCarts()
{
    if(!localStorage.carts)
    {
        localStorage.carts = JSON.stringify([]);
    }
    return JSON.parse(localStorage.carts);
}

function findCart(userId)
{    
    for(var i=0;i<carts.length;i++)
    {
        if(carts[i].id==userId)  return carts[i].cart;
    }
    //var empty = [];
    return [];
}

function findCartIndex(userId)
{
    for(var i=0;i<carts.length;i++)
    {
        if(carts[i].id==userId)  return i;
    }
    return -1;
}

function displayUserInfo()
{    
    if(currentUserId!="")
    {        
        var userInfo = document.getElementById("userInfo");
        userInfo.setAttribute('style','text-align:right;font-size:20px;');
        userInfo.innerHTML = 'Hello <b>'+users[findUserIndexById(currentUserId)].name.toUpperCase()+'</b> ! ';
        var Logout = document.createElement("button");
        Logout.setAttribute("onclick","logout()");
        Logout.innerHTML="LOGOUT";
        userInfo.appendChild(Logout);
    } 
    else
    {
        window.location.href="login.html";
    }
}

function logout()
{
    currentUserId = "";
    saveCurrentUser(currentUserId);
    window.location.href="login.html";
}

function saveCurrentUser(id)
{
    localStorage.setItem("currentUser",id);
}

function getCurrentUser()
{
    return localStorage.getItem("currentUser");
}

function findUserIndexById(id)
{
    for(var i=0;i<users.length;i++)
    {
        if(users[i].id==id) return i;
    }
    return -1;
}

function getUsers()
{
    if(!localStorage.users)
    {
        localStorage.users = JSON.stringify([]);
    }
    return JSON.parse(localStorage.users);
}


function insertBlankLine(targetElement)
{
	var br = document.createElement("br");
    targetElement.appendChild(br);
}

function updateTotal()
{
    divTotal.innerHTML = '<b>'+total+'</b>';
}

function deleteElementById(targetId)
{
    var target = document.getElementById(targetId);
    target.parentNode.removeChild(target);
}

function deleteRowById(targetId)
{
    var target = document.getElementById('row'+targetId);
    target.parentNode.removeChild(target);
    
    var cartIndex = findProductInCart(targetId);
    var productIndex = findProductIndexById(targetId);
    
    total -= cart[cartIndex].quantity*products[productIndex].price;
    divTotal.innerHTML = '<b>'+total+'</b>';

    if(total<=0) productTable.setAttribute('style','visibility:hidden;');
    
    cart.splice(cartIndex,1);
    saveProducts(products);
    saveCarts(cart);
}

function findProductIndexById(id)
{
    for(var i=0;i<products.length;i++)
    {
        if(products[i].id == id) 
        {
            return i;
        }
    }
    return -1;
}

function findProductInCart(id)
{
    for(var i=0;i<cart.length;i++)
    {
        if(cart[i].id == id) 
        {
            return i;
        }
    }
    return -1;
}

function saveProducts(products)
{
    localStorage.products = JSON.stringify(products);
}

function getProducts()
{
    if(!localStorage.products)
    {
        localStorage.products = JSON.stringify([]);
    }
    return JSON.parse(localStorage.products);
}

function getCart()
{
    return carts[cartArrayIndex].cart;
}

function getOrders()
{
    if(!localStorage.orders)
    {
        localStorage.orders = JSON.stringify([]);
    }
    return JSON.parse(localStorage.orders);
}

function saveOrders(orders)
{
    localStorage.orders = JSON.stringify(orders);
}

function sendForOrder()
{
    var orders = getOrders(); 
    var today = new Date();
    var timestamp = today.getDate()+'-'+today.getMonth()+'-'+today.getFullYear()+' '+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    
    var order = new Object();
    order.id = currentUserId;
    order.timestamp = timestamp;
    order.cart = cart;
    
    orders.push(order);
    saveOrders(orders);
}

function checkAvailability()
{
    var flag = true;
    for(var i=0;i<cart.length;i++)
    {
        var productIndex = findProductIndexById(cart[i].id);
        if(products[productIndex].quantity < cart[i].quantity)
        {
            var divError = document.createElement('div');
            divError.setAttribute('id','error'+cart[i].id);
            divError.setAttribute('style','color: red;');
            divError.innerHTML = "Current Quantity<br>not in Stock"; 
            var targetCell = document.getElementById('quantity'+cart[i].id);
            targetCell.appendChild(divError);
            flag=false;
        }       
    }
    return flag;
}

function checkout()
{
    if(total<=0) 
    { 
        alert("Cart is Empty !!!");
        return; 
    }    

    if(!checkAvailability()) return;
    
    sendForOrder();
    for(var i=0;i<cart.length;i++)
    {
        var productIndex = findProductIndexById(cart[i].id);
        products[productIndex].quantity -= cart[i].quantity;        
    }
    saveProducts(products);
    cart=[];
    saveCarts(cart);
    continueShopping();
}

function continueShopping()
{
    window.location.href = "viewproducts.html";
}

function checkQuantity(id)
{
    var productIndex = findProductIndexById(id);
    var maxValue = products[productIndex].quantity;
    var inputValue = document.getElementById('quantityIP'+id).value;
    var error = document.getElementById('error'+id);
    if(inputValue>maxValue) error.innerHTML = "Input exceeds the<br> quantity available";
    else if(inputValue<0) error.innerHTML = "Invalid Input";
    else 
    {
        error.innerHTML = "";
        document.getElementById('cost'+id).innerHTML = '<b>'+inputValue*products[productIndex].price+'</b>';
        divTotal.innerHTML = '<b>'+parseInt(total+(inputValue-cart[findProductInCart(id)].quantity)*products[productIndex].price)+'</b>';
    }
}

function inputSubmit(productIndex)
{
    var cartIndex = findProductInCart(products[productIndex].id);
    var inputValue = document.getElementById('quantityIP'+cart[cartIndex].id).value;
    var error = document.getElementById('error'+cart[cartIndex].id);
    if(inputValue==0) { error.innerHTML="Invalid Input"; return; }
    if(error.innerHTML=="")
    {              
        cart[cartIndex].quantity = parseInt(inputValue);
        saveCarts(cart);        
        document.getElementById('cost'+cart[cartIndex].id).innerHTML = '<b>'+cart[cartIndex].quantity*products[productIndex].price+'</b>';
        total += cart[cartIndex].quantity*products[productIndex].price;
        updateTotal();

        deleteElementById('quantityIP'+cart[cartIndex].id);
        deleteElementById('error'+cart[cartIndex].id);

        document.getElementById('quantity'+cart[cartIndex].id).innerHTML = cart[cartIndex].quantity;
        document.getElementById('quantity'+cart[cartIndex].id).setAttribute('onclick','editQuantity("'+cart[cartIndex].id+'",'+productIndex+','+cartIndex+')');
    }
}

function nothing() { return; }

function editQuantity(id)
{  
    var productIndex = findProductIndexById(id);
    var cartIndex = findProductInCart(id);
    var targetCell = document.getElementById('quantity'+id);
    targetCell.setAttribute('onclick','nothing()');
    targetCell.innerHTML = "";
    var quantityInput = document.createElement('input');
    quantityInput.setAttribute('id','quantityIP'+id);
    quantityInput.setAttribute('type','number');
    quantityInput.setAttribute('style','font-size:14px;width:50px;height:30px;text-align:center;border:none;');
    quantityInput.setAttribute('onkeyup','checkQuantity("'+id+'")');
    quantityInput.setAttribute('onblur','inputSubmit('+productIndex+')');
    quantityInput.setAttribute('value',cart[cartIndex].quantity);
    targetCell.appendChild(quantityInput);

    var divError = document.createElement('div');
    divError.setAttribute('id','error'+id);
    divError.setAttribute('style','color: red;');
    divError.innerHTML = ""; 
    targetCell.appendChild(divError);
}

function changeRowBG(rowId,flag)
{
    if(flag==1) document.getElementById(rowId).setAttribute('bgcolor','#e0e0e0');
    else document.getElementById(rowId).setAttribute('bgcolor','#ffffff');
}

function showProductTable()
{
    productTable.setAttribute('style','border-collapse:collapse;visibility:visible;');
    total = 0; 
    var productData,productRow;
    for(var i=0;i<cart.length;i++)
    {
        var id = cart[i].id;
        var productIndex = findProductIndexById(id);
    
        productRow = document.createElement("tr");    
        productRow.setAttribute('id','row'+id);
        productRow.setAttribute('onmouseover','changeRowBG("row'+id+'",1)');
        productRow.setAttribute('onmouseleave','changeRowBG("row'+id+'",0)');
    
        productData = document.createElement("td");    
        productData.innerHTML = products[productIndex].name;
        productRow.appendChild(productData);

        productData = document.createElement("td");
        productData.setAttribute('style','text-align:center;');
        productData.innerHTML = products[productIndex].price;
        productRow.appendChild(productData);    

        productData = document.createElement("td");
        productData.setAttribute('style','text-align:center;');
        productData.setAttribute('id','quantity'+id);
        productData.setAttribute('onclick','editQuantity("'+id+'")');
        productData.innerHTML = cart[i].quantity;
        productRow.appendChild(productData);  
    
        productData = document.createElement("td");        
        productData.setAttribute('id','cost'+id);
        productData.setAttribute('style','text-align:center;');
        productData.innerHTML = '<b>'+products[productIndex].price*cart[i].quantity+'</b>';
        productRow.appendChild(productData);    

        productData = document.createElement("td");
        productData.setAttribute('style','text-align:center;');
        var btnDelete = document.createElement('button');
        btnDelete.innerHTML = "Delete";
        btnDelete.setAttribute("onclick",'deleteRowById("'+id+'")');
        productData.appendChild(btnDelete);
        productRow.appendChild(productData);

        tableBody.appendChild(productRow);

        total += products[productIndex].price * cart[i].quantity;
    }
    if(total==0) 
    {
        productTable.setAttribute('style','visibility:hidden;');
        return;
    }

    productRow = document.createElement("tr");        
    productData = document.createElement("td"); 
    productData.setAttribute('colspan','3'); 
    productData.setAttribute('style','text-align:right;border:none;font-size:20px;'); 
    productData.innerHTML = "TOTAL<b>:</b>";
    productRow.appendChild(productData);

    productData = document.createElement("td"); 
    productData.setAttribute('id','divTotal');
    productData.setAttribute('style','text-align:center;border:none;font-size:20px;');
    productData.innerHTML = '<b>'+total+'</b>';
    productRow.appendChild(productData);

    productTable.appendChild(productRow);
}

displayUserInfo();
showProductTable();
if(total>0) var divTotal = document.getElementById("divTotal");
else productTable.setAttribute('style','visibility:hidden;');




