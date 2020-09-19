var product = {};
var productsArray = [];
var comentariosArray = [];

function showRelProd(productsArray, relacionadosArray) {
    let product = productsArray;
    let cont = "";

    relacionadosArray.forEach(function (i) {

      cont += `
      <div class="list-group-item list-group-item-action">
      <div class="row">
          <div class="col-3">
              <img src="` + product[i].imgSrc + `" alt="` + product[i].description + `" class="img-thumbnail">
          </div>
          <div class="col">
              <div class="d-flex w-100 justify-content-between">
                  <div class="mb-1">    
                  <h4>`+ product[i].name + `</h4>
                  <p >`+ product[i].description + `</p>
                  <p>`+ product[i].cost + `</p>
                  <p>`+ product[i].currency + `</p>
                  <a href="product-info.html"> Ver producto </a>
                  </div>
                  <small class="text-muted">` + product[i].soldCount + ` artículos</small>
              </div>
          </div>
      </div>
      </div>
      `
    });

    document.getElementById("relacionados").innerHTML = cont;
}

function showInfo(array, comentariosArray) {
    let product = array;

    let informacion = ""
    let imagenes = ""
    let comentarios = ""

    informacion += '<h3>' + product.name + '</h3>' + '<hr class="my-3"><dl>';
    informacion += '<dt>Descripción</dt>' + '<dd><p>' + product.description + '</p></dd>'
    informacion += '<dt>Costo</dt>' + '<dd><p>' + product.cost + '</p></dd>'
    informacion += '<dt>Moneda</dt>' + '<dd><p>' + product.currency + '</p></dd>'
    informacion += '<dt>Cantidad de productos vendidos</dt>' + '<dd><p>' + product.soldCount + '</p></dd>'
    informacion += '<dt>Categoria:</dt>' + '<dd><p>' + product.category + '</p></dd>';

    imagenes += `
    <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
    <ol class="carousel-indicators">
      <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
      <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
      <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
      <li data-target="#carouselExampleIndicators" data-slide-to="3"></li>
      <li data-target="#carouselExampleIndicators" data-slide-to="4"></li>
    </ol>
    <div class="carousel-inner">
      <div class="carousel-item active">
        <img src="img/prod1.jpg" class="d-block" alt="...">
      </div>
      <div class="carousel-item">
        <img src="img/prod1_1.jpg" class="d-block" alt="...">
      </div>
      <div class="carousel-item">
        <img src="img/prod1_2.jpg" class="d-block" alt="...">
      </div>
      <div class="carousel-item">
        <img src="img/prod1_3.jpg" class="d-block" alt="...">
      </div>
      <div class="carousel-item">
        <img src="img/prod1_4.jpg" class="d-block" alt="...">
      </div>
    </div>
    <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="sr-only">Previous</span>
    </a>
    <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="sr-only">Next</span>
    </a>
  </div>
    `

    comentariosArray.forEach(function (comentario) {
        let calificación = "";

        for (let i = 1; i <= comentario.score; i++) {
            calificación += `<span class="fa fa-star checked"></span>`
        }
        for (let i = comentario.score + 1; i <= 5; i++) {
            calificación += `<span class="fa fa-star"></span>`
        }
        comentarios += '<div style="text-align right;">' + calificación + '</div>';

        comentarios += `
        <p>${comentario.description}</p>
        <strong>${comentario.user}</strong><br>
        <small class="text-muted">${comentario.dateTime}</small><br><br><hr>
        `
    })
    document.getElementById("información").innerHTML = informacion;
    document.getElementById("imagenes").innerHTML = imagenes;
    document.getElementById("comentarios").innerHTML = comentarios;
}
//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    let userLogged = localStorage.getItem("User-Logged");
    if (userLogged) {
        document.getElementById("nuevoComentario").style = "display: inline-block";
    }

    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            comentariosArray = resultObj.data;
        }
    });

    getJSONData(PRODUCT_INFO_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            product = resultObj.data;
            showInfo(product, comentariosArray);
        }
    });


    document.getElementById("enviarCom").addEventListener("click", function () {

        let hoy = new Date();

        let dateTime = `${hoy.getFullYear()}-0${(hoy.getMonth() + 1)}-${hoy.getDate()} `;
        dateTime += `${hoy.getHours()}:${+ hoy.getMinutes()}:${hoy.getSeconds()}`

        let nuevo = {
            score: calificación(),
            description: document.getElementById("comentar").value,
            user: JSON.parse(localStorage.getItem('User-Logged')).email,
            dateTime: dateTime
        };

        comentariosArray.push(nuevo);

        showInfo(productsArray, comentariosArray)

    })

    getJSONData(PRODUCTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            productsArray = resultObj.data;

            showRelProd(productsArray, product.relatedProducts);
        }
    });

})
