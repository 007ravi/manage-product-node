var currentUserId = getCurrentUser();
if(currentUserId!="") window.location.href="viewproducts.html";
var users = getUsers();

function getCurrentUser()
{
    if(!localStorage.getItem("currentUser"))
    {
        localStorage.setItem("currentUser","");
    }
    return localStorage.getItem("currentUser");
}

function saveCurrentUser(id)
{
    localStorage.setItem("currentUser",id);
}

function getUsers()
{
    if(!localStorage.users)
    {
        localStorage.users = JSON.stringify([]);
    }
    return JSON.parse(localStorage.users);
}

function findUserIndexByEmail(email)
{
    for(var i=0;i<users.length;i++)
    {
        if(users[i].email==email) return i;
    }
    return -1;
}

function login()
{
    if(currentUserId!="") window.location.href="viewproducts.html";
    else
    {
        var email = document.getElementById("email");
        var errEmail = document.getElementById("errEmail");
        var errPass = document.getElementById("errPass");
        var password = document.getElementById("password");
        var userIndex = findUserIndexByEmail(email.value);
        
        if(email.value=="") { errEmail.innerHTML="Enter Email"; errPass.innerHTML="";  error=1; }
        else if(!/[a-zA-Z0-9._-]{3,}@[a-zA-Z0-9._-]{3,}[.]{1}[a-zA-Z0-9._-]{2,}/.test(email.value)) { errEmail.innerHTML = "Invalid Email"; errPass.innerHTML=""; error=1; }        
        else if(userIndex<0) { errEmail.innerHTML = "Account doesn't exists"; errPass.innerHTML=""; error=1; }
        else errEmail.innerHTML = "";
        
        if(password.value=="") { errPass.innerHTML="Enter Password"; error=1; } 
        else if(users[userIndex].password!=password.value) errPass.innerHTML="Incorrect Password";
        else 
        {
            currentUserId=users[userIndex].id;
            saveCurrentUser(currentUserId);
            window.location.href = "viewproducts.html";
        }

    }
}