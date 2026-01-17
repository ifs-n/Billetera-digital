

const EMAIL_VALIDO = "admin@gmail.com";
const PASSWORD_VALIDO = "12345";


function login(event){
        
    event.preventDefault();
    const email = $("#email").val();
    const password = $("#password").val();

    if (email === EMAIL_VALIDO && password === PASSWORD_VALIDO){
        alerta("Usuario Correcto - redirigiendo...", "success");
        localStorage.setItem("usuario", email);

        setTimeout(() => {
            window.location.href = "menu.html";
        }, 1500);
    } 
    else {
        alerta("Usuario o contraseña inválido", "danger");
    }
}

function depositar(){

    const inputMonto = document.getElementById("depositAmount").value;
    const monto = parseInt(inputMonto);
    
// esto hace que solo se pueda ingresar un numero >0, en caso contrario muestra un mensaje. //

    if (!inputMonto || isNaN(monto) || monto <= 0) {
        alerta("Por favor ingrese un monto válido", "warning");
        return;
    }

    let saldoGuardado = localStorage.getItem("Saldo");

    let saldo = parseInt(saldoGuardado);
    if(isNaN(saldo)) {
        saldo = 0;
    }
    
    saldo += monto;

    localStorage.setItem("Saldo", saldo);
    
    alerta("Su depósito de $"+ monto +" fue realizado con éxito", "success");

    setTimeout(() => {
            window.location.href = "menu.html";
        }, 1500);
    
}

function mostrarSaldo(){
    let saldo = parseInt(localStorage.getItem("Saldo"));

    if(isNaN(saldo)) {
        saldo = 0;
    }


    $("#saldo").text("$" + saldo);
}

function saldoActual(){
    let saldo = parseInt(localStorage.getItem("Saldo"));

    if(isNaN(saldo)) {
        saldo = 0;
    }


    $("#saldo").text("Su saldo actual es: $" + saldo);
}

// FUNCIONES PANTALLA SENDMONEY.HTML //

function abrirFormulario(){
    document.getElementById("nuevoContactoForm").style.display = "block";

}

function cerrarFormulario(){
    document.getElementById("nuevoContactoForm").style.display = "none";
}

function guardarContacto(){
 
    let nombre = $("#nombre").val();
    let ncta = $("#ncta").val();
    let alias = $("#alias").val();
    let banco = $("#banco").val();

    if (nombre === "" || banco === "" || ncta == "") {
        alerta("Nombre, número de cuenta, y Banco son requeridos", "danger", "alerta-contacto");
        return;
    }

    

// /^\d{8,12}$/ valida que el numero de cuenta tenga entre 8 y 12 numeros

    let validarNcta = /^\d{8,12}$/;

    if (!validarNcta.test(ncta)) {
        alerta("Ingresa un Numero de cuenta válido (8 a 12 digitos)", "danger", "alerta-contacto")
        return;
    }

    let contacto = {
        nombre,
        ncta,
        alias,
        banco,
    }
    
    contactos.push(contacto);

    localStorage.setItem("contactos", JSON.stringify(contactos));

    cerrarFormulario();
    cargarContacto();
}

let contactos = JSON.parse(localStorage.getItem("contactos")) || [];

// "|| []" hace que si no encuentra nada en localStorage muestre un campo vacío //

let contactoSeleccionado = -1;

function cargarContacto(){
    let lista = document.getElementById("contactList");
    lista.innerHTML = "";

    for (let i = 0; i < contactos.length; i++) {

        let contacto = contactos[i];

        let li = document.createElement("li");
        li.className = "list-group-item";

        li.textContent =
            contacto.nombre + " - " +
            contacto.alias + " (" +
            contacto.banco + ")";

        li.onclick = seleccionar(i);

        lista.appendChild(li);
    }
}

function seleccionar(indice){
    return function () {

        contactoSeleccionado = indice;
        let lista = document.getElementById("contactList");
        let items = lista.getElementsByClassName("list-group-item");
        for (let j = 0; j < items.length; j++) {
            items[j].classList.remove("active");
        }
        items[indice].classList.add("active");
    };

}

function transferencia(){

    if (contactoSeleccionado === -1){
        alerta("Seleccione un contacto de la lista", "warning", "alerta-transferencia");
        return;
    }

    let monto = Number(document.getElementById("monto").value);

    let saldo = parseInt(localStorage.getItem("Saldo")) || 0;
    
    if (monto > saldo) {
        alerta("Saldo insuficiente", "danger", "alerta-transferencia");
        return;
    }
    if (monto < 1) {
        alerta("Ingrese un monto válido", "warning", "alerta-transferencia");
        return;
    }
    
    saldo = saldo - monto;

    localStorage.setItem("Saldo", saldo);

    alerta("Transferencia de $" + monto + " realizada con éxito", "success", "alerta-transferencia");
    return;

    
}


function alerta(mensaje, tipo, idElemento = "alerta") {
    const alerta = document.getElementById(idElemento);

    if (alerta) {
        alerta.className = `alert alert-${tipo}`;
        alerta.textContent = mensaje;
        alerta.classList.remove("d-none");
    }
}