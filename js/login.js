//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    document.getElementById("enviar").addEventListener("click", function(e) {
        let ingEmail = document.getElementById("ingEmail");
        let ingContraseña = document.getElementById("ingContraseña");
        let datosCompletos = true;

        if (ingEmail.value === "") {
            ingEmail.classList.add("invalid");
            datosCompletos = false;
        }

        if (ingContraseña.value === "") {
            ingContraseña.classList.add("invalid");
            datosCompletos = false;
        }

        if (datosCompletos) {

            if (ingEmail.value, ingContraseña.value) {
                window.location = 'inicio2.html';
            }
            else {
                alert("Usuario o contraseña incorrectas!")
            }
        }
        else {
            alert("Debes ingresar los datos!")
        }
    });
});
