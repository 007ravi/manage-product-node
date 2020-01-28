var currentUserId = getCurrentUser();
var users=getUsers();
var products = getProducts(); //console.log(products);
var carts = getCarts();
var cartArrayIndex = findCartIndex(currentUserId);
var cart = getCart(); //findCart(currentUserId);
var users=getUsers();
var divProductList = document.getElementById("divProductList");



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

function getCart()
{
    return carts[cartArrayIndex].cart;
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

function deleteElementById(targetId)
{
    var target = document.getElementById(targetId);
    target.parentNode.removeChild(target);
    products.splice(findProductIndexById(id),1);
    saveProducts(products);
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

function checkQuantity(i,id)
{
    var currentCartQuantity = 0; var cartIndex = findProductInCart(id);
    if(cartIndex>=0) currentCartQuantity = cart[cartIndex].quantity;
    var maxValue = products[i].quantity - currentCartQuantity;
    var inputValue = document.getElementById('quantity'+id).value;
    var error = document.getElementById('error'+id);
    if(inputValue>maxValue) error.innerHTML = "Input exceeds the quantity available";
    else if(inputValue<0) error.innerHTML = "Invalid Input";
    else error.innerHTML = "";
}

function addToCart(id)
{
    var inputValue = document.getElementById('quantity'+id).value;
    var error = document.getElementById('error'+id);
    if(inputValue==0) { error.innerHTML="Invalid Input"; return; }
    if(error.innerHTML=="")
    {
        var cartIndex = findProductInCart(id);
        if(cartIndex == -1) 
        {
            var obj = new Object();
            obj.id = id; 
            obj.quantity = parseInt(inputValue);
            cart.push(obj);
        }
        else
        {
            cart[cartIndex].quantity = (parseInt(cart[cartIndex].quantity) + parseInt(inputValue));
        }
        saveCarts(cart);        
    }
}

displayUserInfo();

for(var i=0;i<products.length;i++)
{
        var product = document.createElement('div');
        var id = products[i].id;
        
        product.setAttribute('id',id);
        product.setAttribute('padding','20px');
        
        var text = document.createTextNode("Name: "+products[i].name);
        product.appendChild(text);
        insertBlankLine(product);
        
        text = document.createTextNode("Price: "+products[i].price);
        product.appendChild(text);
        insertBlankLine(product);

        text = document.createTextNode("Description: "+products[i].description);
        product.appendChild(text);
        insertBlankLine(product);

        var inputQuantity = document.createElement('input');
        inputQuantity.setAttribute('type','number');
        inputQuantity.setAttribute('id','quantity'+id);
        inputQuantity.setAttribute('placeholder','Enter Product Quantity');
        inputQuantity.setAttribute('style','width:170px;');
        inputQuantity.setAttribute('onkeyup','checkQuantity('+i+',"'+id+'")');
        inputQuantity.setAttribute('min','1');
        inputQuantity.setAttribute('max',''+products[i].quantity+'');
        product.appendChild(inputQuantity);       

        var btnAddToCart = document.createElement('button');
        btnAddToCart.innerHTML = "Add to Cart";
        btnAddToCart.setAttribute("style",'margin:10px;');
        btnAddToCart.setAttribute("onclick",'addToCart("'+id+'")');
        product.appendChild(btnAddToCart);

        var divError = document.createElement('div');
        divError.setAttribute('id','error'+id);
        divError.setAttribute('style','color: red;');
        divError.innerHTML = "";        

        product.appendChild(divError);

        insertBlankLine(product);      
        insertBlankLine(product);       
          
        divProductList.appendChild(product);
}