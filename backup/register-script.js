
var users = getUsers(); var userCount = getUserCount();
var carts = getCarts();
var error=0;

function saveCurrentUser(id)
{
    localStorage.setItem("currentUser",id);
}

function saveUsers(users)
{
    localStorage.users = JSON.stringify(users);
    localStorage.setItem("userCount",++userCount);
}

function getUserCount()
{
    return localStorage.getItem("userCount");
}

function getUsers()
{
    if(!localStorage.users)
    {
        localStorage.users = JSON.stringify([]);
    }
    return JSON.parse(localStorage.users);
}

function cancel()
{
    window.location.href = "login.html";
}

function emailNotAlreadyTaken(email)
{
    for(var i=0;i<users.length;i++)
    {
        if(users[i].email == email) return false;
    }
    return true;
}

function register()
{
    error = 0;
    var nameInput = document.getElementById("Name");
    var emailInput = document.getElementById("Email");
    var passInput = document.getElementById("EnterPass");
    var confirmPassInput = document.getElementById("ConfirmPass");
    var mobileInput = document.getElementById("Mobile");
    var errName = document.getElementById("errName");
    var errEmail = document.getElementById("errEmail");
    var errEPass = document.getElementById("errEPass");
    var errCPass = document.getElementById("errCPass");
    var errMobile = document.getElementById("errMobile");
    if(nameInput.value=="") { errName.innerHTML = "Name is Required"; error = 1; }
    else
    {
        if(! /^[a-zA-Z ]*$/.test(nameInput.value)){
    		errName.innerHTML="Only Letters are allowed";
    		error = 1;
    	} 
    	else
    	{
            errName.innerHTML = "";
    		var name = nameInput.value;
    	}            
    } 
    if(emailInput.value=="") { errEmail.innerHTML = "Email is Required"; error = 1; }
    else
    {    			
    	if(! /[a-zA-Z0-9._-]{3,}@[a-zA-Z0-9._-]{3,}[.]{1}[a-zA-Z0-9._-]{2,}/.test(emailInput.value)){
    		errEmail.innerHTML="Invalid Email Format";
    		error = 1;
    	} 
		else
		{
            if(emailNotAlreadyTaken(emailInput.value)) { var email = emailInput.value; errEmail.innerHTML = ""; }
            else { errEmail.innerHTML = "Email ID already taken"; error = 1; }
		}
    }
    if(passInput.value=="")
    {
		errEPass.innerHTML ="Password is Required";
		error = 1;
 	}
 	else
 	{				
		if(! /[a-zA-Z0-9._@]{8,}/.test(passInput.value)){
			errEPass.innerHTML="Invalid Password Format ( only '.' , '@' , '_' , a-z , A-z , 0-9 are allowed. Min Length = 8 )";
			error = 1;
		}
		else
		{
            errEPass.innerHTML = "";
			var tempPass =  passInput.value;
		}
	}
	if(confirmPassInput.value=="")
    {
		errCPass.innerHTML ="Retype your Password";
		error = 1;
 	}
 	else
 	{				
		if(tempPass!=confirmPassInput.value){
			errCPass.innerHTML = "Password Mismatch";
			error = 1;
		}
		else
		{
            errCPass.innerHTML = "";
			var password = tempPass;
		}
    }
    if(mobileInput.value=="")
	{
		errMobile.innerHTML = "Mobile No. Required";
		error = 1;
	}
	else
	{
		if(! /[0-9]{10,11}/.test(mobileInput.value)){
			errMobile.innerHTML = "Invalid Mobile Number";
			error = 1;
		}
		else
		{
            errMobile.innerHTML = "";
			var mobile = mobileInput.value;
		}
    }
    
    if(error==0)
    {
        var user = new Object();
        user.id = 'user'+userCount; saveCurrentUser(user.id);
        user.name = name;
        user.email = email;
        user.password = password;
        user.mobile = mobile;
        users.push(user);
        saveUsers(users);
        var cart = new Object();
        cart.id = user.id;
        cart.cart = [];
        carts.push(cart);
        saveCart(carts);
        alert("Account Created");
        window.location.href = "viewproducts.html";
    }    

}

function saveCart(carts)
{
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
    var carts = getCarts();
    for(var i=0;i<carts.length;i++)
    {
        if(carts[i].id==userId)  return carts[i].cart;
    }
    var empty = [];
    return empty;
}

function findCartIndex(userId)
{
    var carts = getCarts();
    for(var i=0;i<carts.length;i++)
    {
        if(carts[i].id==userId)  return i;
    }
    return -1;
}