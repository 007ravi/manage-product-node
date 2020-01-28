var currentUserId = getCurrentUser();
if (currentUserId != "") window.location.href = "viewproducts";
var users = []

getUsers();



function getCurrentUser() {
    if (!sessionStorage.getItem("currentUser")) {
        sessionStorage.setItem("currentUser", "");
    }
    return sessionStorage.getItem("currentUser");
}

function saveCurrentUser(id, name) {
    sessionStorage.setItem("currentUser", JSON.stringify({
        id: id,
        name: name
    }));
}

function getUsers() {
    let xhttp = new XMLHttpRequest()
    xhttp.open("GET", "/getUsers");
    xhttp.send();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            users = JSON.parse(xhttp.responseText)
        }
    }
}

function findUserIndexByEmail(email) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].email == email) return i;
    }
    return -1;
}

function login() {
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    if(email.value=="mishra007ravi@gmail.com"&&password.value=="ravi")
    window.location.href="manageproducts";
   else if (currentUserId != "") window.location.href = "viewproducts";
    else {
        var email = document.getElementById("email");
        var errEmail = document.getElementById("errEmail");
        var errPass = document.getElementById("errPass");
        var password = document.getElementById("password");
        var userIndex = findUserIndexByEmail(email.value);

        if (email.value == "") {
            email.setAttribute("placeholder","Enter the Email please");
            //errPass.innerHTML = "";
            error = 1;
        } else if (!/[a-zA-Z0-9._-]{3,}@[a-zA-Z0-9._-]{3,}[.]{1}[a-zA-Z0-9._-]{2,}/.test(email.value)) {
            email.setAttribute("style", "color:red;");
            errPass.innerHTML = "";
            error = 1;
        } else if (userIndex < 0) {
            //errEmail.innerHTML = "Account doesn't exists";
            alert("Account dont exist");
            errPass.innerHTML = "";
            error = 1;
        } else errEmail.innerHTML = "";

        if (password.value == "") {
            //errPass.innerHTML = "Enter Password";
            password.setAttribute("placeholder", "Enter password please");
            error = 1;
        } else if (users[userIndex].password != password.value) password.setAttribute("style", "color:red;");
        else {
            currentUserId = users[userIndex].id;
            saveCurrentUser(currentUserId, users[userIndex].name);
            window.location.href = "viewproducts";
        }

    }
}