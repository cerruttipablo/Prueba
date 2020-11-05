const ORDER_ASC_BY_PRICE = "Precio Ascendente";
const ORDER_DESC_BY_PRICE = "Precio Descendente";
const ORDER_BY_SOLD_COUNT = "Relevancia";
var minCount = undefined;
var maxCount = undefined;

function sortProducts(criteria, array){
    
    let result = [];
    if (criteria === ORDER_ASC_BY_PRICE)
    {
        result = array.sort(function(a, b) {
            if ( a.cost < b.cost ){ return -1; }
            if ( a.cost > b.cost ){ return 1; }
            return 0;
        });
    } else if (criteria === ORDER_DESC_BY_PRICE){
        result = array.sort(function(a, b) {
            if ( a.cost > b.cost ){ return -1; }
            if ( a.cost < b.cost ){ return 1; }
            return 0;
        });
    } else if (criteria === ORDER_BY_SOLD_COUNT){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }

    return result;
}


function showProductsList(array){

    document.getElementById("lista-de-productos").innerHTML =
    `<h4 class='text-muted' style='text-align: center; margin: 120px auto'>NO SE ENCONTRARON RESULTADOS</h4>`;

    let htmlContentToAppend = "";
    for(let i = 0; i < array.length; i++){
        let product = array[i];

        if (((minCount == undefined) || (minCount != undefined && parseInt(product.cost) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(product.cost) <= maxCount))) {

         htmlContentToAppend += `
         <a href="product-info.html" class="list-group-item-action">
         <div class="list-group-item list-group-item-action">
            <div class="row">
                
                    <img src="` + product.imgSrc + `" class="img-thumbnail">
                
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <h4 class="mb-1">`+ product.name +`</h4>
                        <small class="text-muted">` + product.soldCount + ` vendidos</small>
                    </div>
                   <div>`+ product.description +`</div><br>
                   <h4 style="text-align: right">`+ product.currency +` `+ product.cost +`</h4>
                </div>
            </div>
         </div>
         </a>
         `
         document.getElementById("lista-de-productos").innerHTML = htmlContentToAppend;  
        }
    }
}


function busqueda(array) {  

    textoIngresado = document.getElementById("barra-buscador").value.toLowerCase();
    lista = [];
        
        for (let producto of array) {
            
            nombre = producto.name.toLowerCase();
            descripcion = producto.description.toLowerCase();

            if (nombre.indexOf(textoIngresado) > -1 || descripcion.indexOf(textoIngresado) > -1) {
                lista.push (producto);             
            }
        }
        showProductsList(lista);
    }

showSpinner();
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCTS_URL).then(function(resultObj){
        
        if (resultObj.status === "ok") {
            productsArray = resultObj.data;
            listaOrdenada = resultObj.data;
            showProductsList(productsArray);
        } 
        hideSpinner();
    });
    
    document.getElementById("precioAsc").addEventListener("click", function(){
        listaOrdenada = sortProducts(ORDER_ASC_BY_PRICE, productsArray);
       // showProductsList(listaOrdenada);
       busqueda(listaOrdenada);
    });

    document.getElementById("precioDesc").addEventListener("click", function(){
        listaOrdenada = sortProducts(ORDER_DESC_BY_PRICE, productsArray);
        //showProductsList(listaOrdenada);
        busqueda(listaOrdenada);
    });

    document.getElementById("relevanciaDesc").addEventListener("click", function(){
        listaOrdenada = sortProducts(ORDER_BY_SOLD_COUNT, productsArray);
        //showProductsList(listaOrdenada);
        busqueda(listaOrdenada);
    });

    document.getElementById("clearPriceFilter").addEventListener("click", function(){
        document.getElementById("filterPriceMin").value = "";
        document.getElementById("filterPriceMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        //showProductsList(listaOrdenada);
        busqueda(listaOrdenada);
    });

    document.getElementById("filterPrice").addEventListener("click", function(){
        minCount = document.getElementById("filterPriceMin").value;
        maxCount = document.getElementById("filterPriceMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
            minCount = parseInt(minCount);
        } else {
            minCount = undefined;
        }
        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
            maxCount = parseInt(maxCount);
        } else {
            maxCount = undefined;
        }

        //showProductsList(listaOrdenada);
        busqueda(listaOrdenada);
    });

    document.getElementById("buscador").addEventListener("keyup", function(){
       busqueda(listaOrdenada); 
    });

   document.getElementById("cancelar-busqueda").addEventListener("click", function() {
        document.getElementById('buscador').value = '';
        showProductsList(listaOrdenada);      
    });
});