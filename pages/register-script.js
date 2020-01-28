var users = []
getUsers();
var carts = getCarts();
var error = 0;

function saveCurrentUser(id, name) {
    sessionStorage.setItem("currentUser", JSON.stringify({
        id: id,
        name: name
    }));
}

function saveUser(user) {
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/register");
    xhttp.setRequestHeader('Content-type', 'application/json')
    xhttp.send(JSON.stringify(user));
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            user.id = xhttp.responseText
            saveCurrentUser(user.id, user.name)
            alert("Account Created");
            window.location.href = "viewproducts";
        }
    }
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

function cancel() {
    window.location.href = "login";
}

function emailNotAlreadyTaken(email) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].email == email) return false;
    }
    return true;
}

function register() {
    error = 0;
    var nameInput = document.getElementById("Name");
    var emailInput = document.getElementById("Email");
    var passInput = document.getElementById("EnterPass");
    var confirmPassInput = document.getElementById("ConfirmPass");
    var mobileInput = document.getElementById("Mobile");
    if (nameInput.value == "") {
        nameInput.setAttribute("placeholder", "Enter the name please");
        nameInput.setAttribute("style","color:red");
       // errName.innerHTML = "Name is Required";
        error = 1;
    } else {
        if (!/^[a-zA-Z ]*$/.test(nameInput.value)) {
            nameInput.setAttribute("style", "color:red;");
            error = 1;
        } else {
            nameInput.setAttribute("style", "color:green;");
            var name = nameInput.value;
        }
    }
    if (emailInput.value == "") {
        emailInput.setAttribute("style", "color:red;");
        error = 1;
    } else {
        if (!/[a-zA-Z0-9._-]{3,}@[a-zA-Z0-9._-]{3,}[.]{1}[a-zA-Z0-9._-]{2,}/.test(emailInput.value)) {
            emailInput.setAttribute("style", "color:red;");
            error = 1;
        } else {
            if (emailNotAlreadyTaken(emailInput.value)) {
                var email = emailInput.value;
                emailInput.setAttribute("style", "color:green;");
            } else {
                emailInput.setAttribute("placeholder", "Email already taken");
                error = 1;
            }
        }
    }
    if (passInput.value == "") {
        passInput.setAttribute("placeholder", "please Enter password");
        error = 1;
    } else {
        if (!/[a-zA-Z0-9._@]{4,}/.test(passInput.value)) {
            passInput.setAttribute("style", "color:red;");
          //  passInput.setAttribute("style", "color:red;");
          alert("password must have 4 character");
            error = 1;
        } else {
            passInput.setAttribute("style", "color:green;");
            var tempPass = passInput.value;
        }
    }
    if (confirmPassInput.value == "") {
      //  errCPass.innerHTML = "Retype your Password";
      confirmPassInput.setAttribute("placeholder", "Please confirm password ");
        error = 1;
    } else {
        if (tempPass != confirmPassInput.value) {
              confirmPassInput.setAttribute("style", "color:red;");
            error = 1;
        } else {
            confirmPassInput.setAttribute("style", "color:green;");
            var password = tempPass;
        }
    }
    if (mobileInput.value == "") {
        mobileInput.setAttribute("placeholder", "Please Enter input");
        error = 1;
    } else {
        if (!/[0-9]{10,11}/.test(mobileInput.value)) {
            mobileInput.setAttribute("style", "color:red;");
            error = 1;
        } else {
            mobileInput.setAttribute("style", "color:green;");
            var mobile = mobileInput.value;
        }
    }

    if (error == 0) {
        var user = new Object();
        user.id = "temp"
        user.name = name;
        user.email = email;
        user.password = password;
        user.mobile = mobile;

        saveUser(user);
    }

}