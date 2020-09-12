var productsArray = [];
var comentariosArray = [];

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


    imagenes += '<img class="img-fluid img-thumbnail" src="img/prod1.jpg" alt="">' +
        '<img class="img-fluid img-thumbnail" src="img/prod1_1.jpg" alt="">' + '<img class="img-fluid img-thumbnail" src="img/prod1_2.jpg" alt="">' +
        '<img class="img-fluid img-thumbnail"src="img/prod1_3.jpg" alt="">' + '<img class="img-fluid img-thumbnail" src="img/prod1_4.jpg" alt=""></dl>';


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
            productsArray = resultObj.data;
            showInfo(productsArray, comentariosArray);
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
})
