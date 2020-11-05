
function resaltarEstrellas(calificacion) {

    let estrellas = '';
    let pintadas = 0;
    
    while (pintadas < calificacion) {
        estrellas += '<span class="fa fa-star checked"></span>';
        pintadas += 1;
    }
    while (5-pintadas > 0) {
        estrellas += '<span class="fa fa-star faded"></span>';
        pintadas += 1;
    }
    return estrellas;
}


function mostrarComentariosFijos(array) {
    
    let htmlContentToAppend = '';
    for (let comentario of array) {

        numeroEstrellas = resaltarEstrellas(comentario.score);
        
        htmlContentToAppend += 
            `<div><br>` + numeroEstrellas + `</div>
            <div>`+ comentario.description + `</div>
            <small class='text-muted'>Publicado por <a href='' style='color:#db608f'>` + comentario.user + `</a> el ` + comentario.dateTime+`</small>`
    } 
        document.getElementById('seccion-comentarios').innerHTML += htmlContentToAppend; 
}


function mostrarRelacionados(productosRelacionados, numeroProductos) {

    let htmlContentToAppend = '';
    for (let item of numeroProductos) {

        htmlContentToAppend += 
        
        `<a href="product-info.html" class="list-group-item-action">
            <div class='caja'>
                <h5><strong>` + productosRelacionados[item].name + `</strong></h5>
                <p style='float:left; text-align: justify'>
                    <img class="img-fluid img-thumbnail related" src="` + productosRelacionados[item].imgSrc + `" alt="">`
                    + productosRelacionados[item].description +`<br><br>
                    <strong>`+ productosRelacionados[item].currency + ' ' + productosRelacionados[item].cost + `</strong></p>
            </div>
        </a>`    
    }
        document.getElementById('productos-relcionados').innerHTML += htmlContentToAppend;       
}


var posicionImagen = 0;
function pasarImagen() {
    posicionUltimaImagen = producto.images.length - 1;
    
    if (posicionImagen > posicionUltimaImagen) {
        posicionImagen = 0;    
    }
    if (posicionImagen < 0) {
        posicionImagen = posicionUltimaImagen;
    }
    ubicacion = document.getElementById('contenedor-imagen');
    ubicacion.setAttribute('src', producto.images[posicionImagen])
    nroImagen = posicionImagen + 1;
    document.getElementById('contador-imagen').innerHTML = 'Imagen ' + nroImagen + ' de ' + producto.images.length;
}

function next() {
    posicionImagen +=1;
    pasarImagen();
}

function prev() {
    posicionImagen -=1;
    pasarImagen();
}


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.

document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCT_INFO_URL).then(function(resultObj){
        if (resultObj.status === "ok") {

            producto = resultObj.data;
    
            let nombreProducto  = document.getElementById("nombre-producto");
            let descripcionProducto = document.getElementById("descripcion-producto");
            let encabezadoProducto = document.getElementById("encabezado-producto");
            let precioProducto = document.getElementById("precio-producto");
            
            nombreProducto.innerHTML = producto.name
            descripcionProducto.innerHTML = producto.description;
            encabezadoProducto.innerHTML = `Categorías > `+ producto.category +` > `+ producto.name +`<span style='float:right'>`+ producto.soldCount + ` vendidos</span>`;
            precioProducto.innerHTML = producto.currency +' '+ producto.cost

            pasarImagen();
        }
    });
    
    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function(resultObj){
        if (resultObj.status === "ok"){

            comentariosFijos = resultObj.data;
            mostrarComentariosFijos(comentariosFijos); 
        }
    });

    getJSONData(PRODUCTS_URL).then(function(resultObj){
        if (resultObj.status === "ok") {
           
            listaProductos = resultObj.data; 
            mostrarRelacionados(listaProductos, producto.relatedProducts);   
        }

    });
    
    var comentariosExtra = []
    document.getElementById("enviar-comentario").addEventListener("click", function(){
        
        contenidoComentario = document.getElementById('comentario-nuevo').value;
        puntuacion = document.getElementById('calificacion-producto').value;
        estrellasResaltadas = resaltarEstrellas(puntuacion);

        today = new Date();
        fechaYHora = today.getFullYear() + '-' + '0'+(today.getMonth()+1) + '-' + today.getDate() +' '+ today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds(); 
        
        comentarioCompleto = `<div><br>` + estrellasResaltadas + `</div><div>`+ contenidoComentario + `</div>
        <small class='text-muted'>Publicado por <a href='' style='color:#db608f'>` + sessionStorage.getItem('user') + ` </a>el ` + fechaYHora +`</small>`;

        comentariosExtra.push(comentarioCompleto); //Voy guardando los comentarios nuevos que se van haciendo.
        document.getElementById('seccion-comentarios').innerHTML= '';
       
        //Recorro la lista de atrás para adelante así los comentarios más viejos quedan más abajo y los nuevos arriba.
        for (let i = comentariosExtra.length-1; i >= 0 ; i--) {
        document.getElementById('seccion-comentarios').innerHTML += comentariosExtra[i];
    }
        document.getElementById('comentario-nuevo').value = '';
        mostrarComentariosFijos(comentariosFijos); //Esto es para que los comentarios del json queden abajo de todo.
    });
    
});