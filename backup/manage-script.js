var products = getProducts(); //console.log(products);
var aAddProduct = document.getElementById("aAddProduct");
var divProductList = document.getElementById("divProductList");

var divForm = document.getElementById("divForm");
var count = getCount() ;
divForm.setAttribute('style','visibility:hidden');



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

function updateFormValues(id)
{    
    showForm("edit");

    var productIndex = findProductIndexById(id);
    var formNodes = divForm.childNodes;
    
    formNodes[2].setAttribute('value',products[productIndex].name);
    formNodes[8].setAttribute('value',products[productIndex].quantity);
    formNodes[5].setAttribute('value',products[productIndex].price);
    formNodes[11].setAttribute('value',products[productIndex].description);
    
    var btnUpdate = document.createElement('button');
    btnUpdate.innerHTML = "UPDATE";
    btnUpdate.addEventListener("click",function(){                
        changeValuesById(id);
    });

    divForm.appendChild(btnUpdate);
}

function updateArray(productIndex)
{
    products[productIndex].name = document.getElementById("productName").value;
    products[productIndex].quantity = parseInt(document.getElementById("productQuantity").value);
    products[productIndex].price = parseInt(document.getElementById("productPrice").value);
    products[productIndex].description = document.getElementById("productDescription").value;
    saveProducts(products);
}

function changeValuesById(id)
{
    var productNodes = document.getElementById(id).childNodes;

    var productIndex = findProductIndexById(id);   

    updateArray(productIndex);

    productNodes[0].nodeValue = "Name: "+products[productIndex].name;
    productNodes[2].nodeValue = "Price: "+products[productIndex].price;
    productNodes[4].nodeValue = "Quantity: "+products[productIndex].quantity;
    productNodes[6].nodeValue = "Description: "+products[productIndex].description;

    while(divForm.firstChild)
    {
        divForm.removeChild(divForm.firstChild);
    }
    divForm.setAttribute('style','visibility:hidden');
    aAddProduct.setAttribute('style','visibility:visible');
}

function showForm(formType)
{
    aAddProduct.setAttribute('style','visibility:hidden');
    divForm.setAttribute('style','visibility:visible');
    //divProductList.setAttribute('style','visibility:hidden');
    while(divForm.firstChild)
    {
        divForm.removeChild(divForm.firstChild);
    }
    var text = document.createElement("h2");    
    //text.innerHTML = "Add New Product";
    if(formType=="add") text.innerHTML = "Add New Product";
    else text.innerHTML = "Edit Product";
    divForm.appendChild(text);
    insertBlankLine(divForm);   
    
    
    var inputName = document.createElement('input');
    inputName.setAttribute('type','text');
    inputName.setAttribute('id','productName');
    inputName.setAttribute('placeholder','Enter Product Name');
    inputName.setAttribute('style','height:30px;width:250px;');
    divForm.appendChild(inputName);

    insertBlankLine(divForm); insertBlankLine(divForm);

    var inputPrice = document.createElement('input');
    inputPrice.setAttribute('type','number');
    inputPrice.setAttribute('id','productPrice');
    inputPrice.setAttribute('placeholder','Enter Product Price');
    inputPrice.setAttribute('style','height:30px;width:250px;');
    divForm.appendChild(inputPrice);

    insertBlankLine(divForm); insertBlankLine(divForm);

    var inputQuantity = document.createElement('input');
    inputQuantity.setAttribute('type','number');
    inputQuantity.setAttribute('id','productQuantity');
    inputQuantity.setAttribute('placeholder','Enter Product Quantity');
    inputQuantity.setAttribute('style','height:30px;width:250px;');
    divForm.appendChild(inputQuantity);

    insertBlankLine(divForm); insertBlankLine(divForm);

    var inputDescription = document.createElement('input');    
    inputPrice.setAttribute('type','text');
    inputDescription.setAttribute('placeholder','Enter Product Description');
    inputDescription.setAttribute('id','productDescription');
    inputDescription.setAttribute('style','height:70px;width:320px;');
    divForm.appendChild(inputDescription);
    
    insertBlankLine(divForm); insertBlankLine(divForm);

        
    var btnCancel = document.createElement('button');
    btnCancel.setAttribute('id','btnCancel');
    btnCancel.innerHTML='CANCEL';
    btnCancel.addEventListener("click",function(){
        while(divForm.firstChild)
        {
            divForm.removeChild(divForm.firstChild);
        }
        divForm.setAttribute('style','visibility:hidden');
        aAddProduct.setAttribute('style','visibility:visible');
        //divProductList.setAttribute('style','visibility:visible');
    });           
    
    divForm.appendChild(btnCancel);
}

function saveProducts(products)
{
    localStorage.products = JSON.stringify(products);
    localStorage.setItem("count",count);
}

function getCount()
{
    return localStorage.getItem("count");
}

function getProducts()
{
    if(!localStorage.products)
    {
        localStorage.products = JSON.stringify([]);
    }
    return JSON.parse(localStorage.products);
}

aAddProduct.addEventListener("click",function(){      
    
    showForm("add");  
    var name = document.getElementById('productName');
    var price = document.getElementById('productPrice');
    var quantity = document.getElementById('productQuantity');
    var description = document.getElementById('productDescription');

        var btnSubmit = document.createElement('button');
        btnSubmit.setAttribute('id','btnSubmit');
    
        btnSubmit.innerHTML='SUBMIT';
        btnSubmit.addEventListener("click",function(){
     
        var product = document.createElement('div');
        var id = "product"+count;
        currentId = id;
        product.setAttribute('id',id);
        product.setAttribute('padding','20px');
        
        var text = document.createTextNode("Name: "+name.value);
        product.appendChild(text);
        insertBlankLine(product);
        
        text = document.createTextNode("Price: "+price.value);
        product.appendChild(text);
        insertBlankLine(product);
        
        text = document.createTextNode("Quantity: "+quantity.value);
        product.appendChild(text);
        insertBlankLine(product);

        text = document.createTextNode("Description: "+description.value);
        product.appendChild(text);
        insertBlankLine(product);    

        var btnDelete = document.createElement('button');
        btnDelete.innerHTML = "Delete";
        btnDelete.setAttribute("onclick",'deleteElementById("'+id+'")');
        product.appendChild(btnDelete);

        var btnEdit = document.createElement('button');
        btnEdit.innerHTML = "Edit";
        btnEdit.setAttribute("onclick",'updateFormValues("'+id+'")');
        product.appendChild(btnEdit);

        insertBlankLine(product); insertBlankLine(product);
          
        if(name.value!="" && price.value>0 && quantity.value>0 && description.value!="")
         {  divProductList.appendChild(product);
            
            var obj = new Object();
            obj.id = id; count++;
            obj.name = name.value;
            obj.price = parseInt(price.value);
            obj.quantity = parseInt(quantity.value);
            obj.description = description.value;
            products.push(obj);
            saveProducts(products);      
         }   

        });     
        
        divForm.appendChild(btnSubmit);        
    
});



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
        
        text = document.createTextNode("Quantity: "+products[i].quantity);
        product.appendChild(text);
        insertBlankLine(product);

        text = document.createTextNode("Description: "+products[i].description);
        product.appendChild(text);
        insertBlankLine(product);    

        var btnDelete = document.createElement('button');
        btnDelete.innerHTML = "Delete";
        btnDelete.setAttribute("onclick",'deleteElementById("'+id+'")');
        product.appendChild(btnDelete);

        var btnEdit = document.createElement('button');
        btnEdit.innerHTML = "Edit";
        btnEdit.setAttribute("onclick",'updateFormValues("'+id+'")');
        product.appendChild(btnEdit);

        insertBlankLine(product);
        insertBlankLine(product);
          
        divProductList.appendChild(product);
}