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
            </tr>
        `;
        document.getElementById('artCarrito').innerHTML = articles;
    }
    calcPreTotal()
    calcEnvio();
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
});
