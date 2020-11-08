const ORDER_ASC_BY_COST = "cost -> COST"
const ORDER_DESC_BY_COST = "COST -> cost"
const ORDER_DESC_BY_SOLD_COUNT = "SOLDCOUNT -> soldcount"

var productsArray = [];

var precioMin = undefined;
var precioMax = undefined;
var buscador = undefined

function sortProducts(criterio, array) {
    let result = [];

    if (criterio === ORDER_ASC_BY_COST) {
        result = array.sort(function (a, b) {
            if (a.cost < b.cost) { return -1; }
            if (a.cost > b.cost) { return 1; }
            return 0;
        });
    }
    else if (criterio === ORDER_DESC_BY_COST) {
        result = array.sort(function (a, b) {
            if (a.cost > b.cost) { return -1; }
            if (a.cost < b.cost) { return 1; }
            return 0;
        });
    }
    else if (criterio === ORDER_DESC_BY_SOLD_COUNT) {
        result = array.sort(function (a, b) {
            let asoldCount = parseInt(a.soldCount);
            let bsoldCount = parseInt(b.soldCount);

            if (asoldCount > bsoldCount) { return -1; }
            if (asoldCount < bsoldCount) { return 1; }
            return 0;
        });
    }
    return result;
}

function showProductsList(array) {

    let htmlContentToAppend = "";
    for (let i = 0; i < array.length; i++) {
        let product = array[i];

        if (((precioMin == undefined) || (precioMin !== undefined && parseInt(product.cost) >= precioMin)) &&
            ((precioMax == undefined) || (precioMax !== undefined && parseInt(product.cost) <= precioMax))) {

            if (buscador == undefined || product.name.toLowerCase().indexOf(buscador) != -1) {
                htmlContentToAppend += `
                <div class="col-lg-4 col-md-6 mb-4">
                    <a href="product-info.html" class="card mb-4 shadow-sm custom-card">
                        <img class="bd-placeholder-img card-img-top" src="` + product.imgSrc + `" >
                        <h4 class="m-3">`+ product.name + `</h4>
                        <small class="text-muted" style="text-align: right;">` + product.soldCount + ` artículos</small>
                        <div class="card-body">
                            <p class="card-text">`+ product.description + `</p>
                            <p class="card-text">`+ product.cost + ` `+ product.currency + `</p>
                        </div>  
                    </a>
                </div>
  
            `
            }


            document.getElementById("mod-1").innerHTML = htmlContentToAppend;
        }
    }
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.

document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            productsArray = resultObj.data;
            productsArray = sortProducts(ORDER_ASC_BY_COST, productsArray)
            showProductsList(productsArray);
        }
    });

    document.getElementById("precioAsc").addEventListener("click", function () {

        productsArray = sortProducts(ORDER_ASC_BY_COST, productsArray)

        showProductsList(productsArray);
    });

    document.getElementById("precioDesc").addEventListener("click", function () {

        productsArray = sortProducts(ORDER_DESC_BY_COST, productsArray)

        showProductsList(productsArray);
    });

    document.getElementById("countDesc").addEventListener("click", function () {

        productsArray = sortProducts(ORDER_DESC_BY_SOLD_COUNT, productsArray)

        showProductsList(productsArray);
    });

    document.getElementById("añadir").addEventListener("click", function () {

        precioMin = document.getElementById("precio-min").value;
        precioMax = document.getElementById("precio-máx").value;

        if ((precioMin !== undefined) && (precioMin !== "") && (parseInt(precioMin)) >= 0) {
            precioMin = parseInt(precioMin)
        }
        else {
            precioMin = undefined
        }

        if ((precioMax !== undefined) && (precioMax !== "") && (parseInt(precioMax)) >= 0) {
            precioMax = parseInt(precioMax)
        }
        else {
            precioMax = undefined
        }

        showProductsList(productsArray);

    });


    document.getElementById("borrar").addEventListener("click", function () {
        document.getElementById("precio-min").value = "";
        document.getElementById("precio-máx").value = "";

        precioMin = undefined;
        precioMax = undefined;

        showProductsList(productsArray);

    });

    document.getElementById("buscador").addEventListener("input", function () {
        buscador = document.getElementById("buscador").value.toLowerCase();
        showProductsList(productsArray);
    });

    document.getElementById("limpBuscador").addEventListener("click", function () {
        document.getElementById("buscador").value = "";

        buscador = undefined;

        showProductsList(productsArray);
    })

});