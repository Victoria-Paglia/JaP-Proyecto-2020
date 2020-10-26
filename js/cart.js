var articlesArray = [];

function calcPreCostUnit(preUnit, currency) {
    let preUYU = 0;
    if (currency == "USD") {
        preUYU = preUnit * 40;
    }
    else {
        preUYU = preUnit;
    }
    return preUYU;
}

function calcEnvio() {
    let total = parseInt(document.getElementById("precioTotal").innerHTML);
    let envio;

    let articles = document.getElementsByName("costEnvio");
    for (var i = 0; i < articles.length; i++) {
        if (articles[i].checked) {
            envio = parseInt(articles[i].value);
        }
    }

    let totalEnvio = total / 100 * envio;
    let precioFinal = total + totalEnvio;

    let contenido = `
        <tr>
            <td>${total}</td>

            <td>${envio}%</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <td>Precio final</td>
            <td>${precioFinal}</td>
        </tr>
    </tfoot>
    `

    document.getElementById("precioFinal").innerHTML = contenido;
}

function calcPreTotal() {
    let costos = document.getElementsByClassName('costo');
    let costoTotal = 0;
    for (let i = 0; i < costos.length; i++) {
        costoTotal += parseInt(costos[i].innerHTML);
    }
    document.getElementById("precioTotal").innerHTML = costoTotal;
    calcEnvio();
}


function calcPreArticle(preUnit, currency, i) {

    let count = document.getElementById('count' + i).value;
    let costo = 0;
    costo = calcPreCostUnit(preUnit, currency) * parseInt(count);
    $('#costo' + i).html(costo);
    calcPreTotal();
}

function showArticles(articlesArray) {
    let articles = '';


    for (let i = 0; i < articlesArray.length; i++) {
        let article = articlesArray[i];

        let costo = calcPreCostUnit(article.unitCost, article.currency) * article.count;

        articles += `
            <tr>
                <td><img class="img-thumbnail" src="${article.src}" alt="${article.name}" width="150" height="150"></td>
                <td>${article.name}</td>
                <td>
                <input id="count${i}" type="number" value="${article.count}" min="1" 
                onchange="calcPreArticle(${article.unitCost}, '${article.currency}', ${i})"
                >
                </td>
                <td>${article.unitCost} ${article.currency}</td>
                <td><span class="costo" id="costo${i}">${costo}</span></td>
                <td><button class="btn btn-primary" onclick="borrar(${i})">Eliminar</button></td>
            </tr>
        `;
        document.getElementById('artCarrito').innerHTML = articles;
    }
    calcPreTotal()
    calcEnvio();
}

function borrar(i){
    if (articlesArray.articles.length > 1){
        articlesArray.articles.splice(i, 1);
        showArticles(articlesArray.articles);
    } else {
        document.getElementById("información").innerHTML = `
        <h3>No hay articulos en el carrito!</h3>
        <p>Puede elegir articulos en nuestro menú de <a href="products.html">productos</a></p>
        `
    }
}

function selectMetPago() {
    var formaPago = document.getElementsByName("formaPago");
    for (var i = 0; i < formaPago.length; i++) {

        if (formaPago[i].checked && (formaPago[i].value) == "1") {
            document.getElementById("infoTar").classList.remove("d-none");
            document.getElementById("infoTransBanc").classList.add("d-none");
        } else if (formaPago[i].checked && (formaPago[i].value) == "2") {
            document.getElementById("infoTar").classList.add("d-none");
            document.getElementById("infoTransBanc").classList.remove("d-none")
        }
    }
}

function valido() {
    let tipoTarj = document.getElementById('tipoTarj').value;
    let numTarj = document.getElementById('numTarj').value;
    let tipoTrans = document.getElementById('tipoTransBanc').value;
    let numCuen = document.getElementById('numCuen').value;
    let formaPago = document.getElementsByName('formaPago');
    let validar = true;

    for (var i = 0; i < formaPago.length; i++) {
        if (formaPago[i].checked && (formaPago[i].value) == "1") {
            if (numTarj == "" || tipoTarj == "") {
                validar = false;
            } else {
                validar = true;
            }

        } else if (formaPago[i].checked && (formaPago[i].value) == "2") {
            if (tipoTrans == "" || numCuen == "") {
                validar = false
            } else {
                validar = true;
            }
        }
    }

    return validar;
}



//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {

    getJSONData(CART_INFO_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            articlesArray = resultObj.data;

            showArticles(articlesArray.articles);
            calcEnvio();
        }
    });

    let articles = document.getElementsByName("costEnvio");
    for (var i = 0; i < articles.length; i++) {
        articles[i].addEventListener("change", function () {
            calcEnvio();
        })
    }

    let formaPago = document.getElementsByName("formaPago");
    for (var i = 0; i < formaPago.length; i++) {
        formaPago[i].addEventListener("change", function () {
            selectMetPago();
        })
    }

    let form = document.getElementById('validar');

    form.addEventListener('submit', function (e) {
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
            if (valido()) {
                document.getElementById("metPago").classList.remove("btn-primary");
                document.getElementById("metPago").classList.remove("btn-danger");
                document.getElementById("metPago").classList.add("btn-success");
                document.getElementById("elección").innerHTML = ` 
            <br>
            <div class="alert alert-success alert-dismissible show" role="alert">
            Forma de pago seleccionada correctamente!
            </div>
            `;
            } else {
                e.preventDefault();
                e.stopPropagation();
                document.getElementById("metPago").classList.remove("btn-primary");
                document.getElementById("metPago").classList.remove("btn-success");
                document.getElementById("metPago").classList.add("btn-danger");
                document.getElementById("comprar").classList.remove("btn-primary");
                document.getElementById("comprar").classList.remove("btn-success");
                document.getElementById("comprar").classList.add("btn-danger");
                document.getElementById("elección").innerHTML = `
            <br>
            <div class="alert alert-danger alert-dismissible show" role="alert">
            Debe seleccionar un metodo de pago!
            </div>
            `;
            }
        } else {
            if (valido()) {
                document.getElementById("información").innerHTML = `
            <br>
            <div class="alert alert-success alert-dismissible show" role="alert">
            Su compra fue realizada con exito!
            </div>
            <div>
             <h3>Se le envio un correo electronico con los datos de envio!</h3>
             <p>Gracias por su compra!</p>
            </div>
            `
            } else {
                e.preventDefault();
                e.stopPropagation();
                document.getElementById("comprar").classList.remove("btn-primary");
                document.getElementById("comprar").classList.remove("btn-danger");
                document.getElementById("comprar").classList.add("btn-success");
                document.getElementById("elección").innerHTML = `
        <br>
        <div class="alert alert-danger alert-dismissible show" role="alert">
        Debe ingresar datos de envio!
        </div>
        `;
            }
        }


        form.classList.add('was-validated');
    });



    document.addEventListener("DOMContentLoaded", function () {
        let userLogged = localStorage.getItem('User-Logged');
        if (!userLogged) {
            localStorage.setItem('login-need', JSON.stringify({
                from: "cart.html",
                msg: "Inicia sesión para realizar la compra"
            }))
            window.location = "index.html";
        }
    })

})