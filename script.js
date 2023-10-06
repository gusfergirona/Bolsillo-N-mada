document.addEventListener("DOMContentLoaded", function () {
    // Variables para almacenar los gastos por categoría
    var gastosComida = [];
    var gastosPasajes = [];
    var gastosAlojamiento = [];

    // Variable para almacenar el presupuesto del viaje
    var presupuestoViaje = 0;

    // Variable para almacenar el nombre del presupuesto
    var nombrePresupuesto = "";

    // Obtener elementos del DOM
    var categoriaSelect = document.getElementById("categoriaSelect");
    var montoInput = document.getElementById("montoInput");
    var nombrePresupuestoInput = document.getElementById("nombrePresupuestoInput");
    var registrarGastoBtn = document.getElementById("registrarGastoBtn");
    var tablaGastos = document.getElementById("tablaGastos");
    var seleccionarPresupuestoInput = document.getElementById("seleccionarPresupuestoInput");
    var presupuestoInput = document.getElementById("presupuestoInput");
    var barraProgreso = document.getElementById("barraProgreso");
    var porcentajeTexto = document.getElementById("porcentajeTexto");
    var gastoTotalElement = document.getElementById("gastoTotal");
    var ahorroElement = document.getElementById("ahorro");
    var gastoExcedidoElement = document.getElementById("gastoExcedido");

    // Función para calcular el gasto total sumando todos los gastos por categoría
    function calcularGastoTotal() {
        var gastoTotal = 0;
        gastoTotal += gastosComida.reduce(function (total, gasto) {
            return total + gasto;
        }, 0);
        gastoTotal += gastosPasajes.reduce(function (total, gasto) {
            return total + gasto;
        }, 0);
        gastoTotal += gastosAlojamiento.reduce(function (total, gasto) {
            return total + gasto;
        }, 0);
        // Agrega más categorías según sea necesario

        return gastoTotal;
    }

    // Función para registrar un gasto en la categoría seleccionada
    function registrarGasto() {
        var categoria = parseInt(categoriaSelect.value);
        var monto = parseFloat(montoInput.value);
    
        // Validar la categoría después de que el usuario la haya seleccionado
        if (isNaN(categoria) || categoria === 0) {
            alert("Seleccione una categoría válida.");
            return; // Salir de la función si la categoría no es válida
        }
    
        if (isNaN(monto) || monto < 0) {
            alert("Ingrese un monto válido.");
            return; // Salir de la función si el monto no es válido
        }
    
        switch (categoria) {
            case 1:
                gastosComida.push(monto);
                break;
            case 2:
                gastosPasajes.push(monto);
                break;
            case 3:
                gastosAlojamiento.push(monto);
                break;
            // Agrega más categorías según sea necesario
        }
    
        // Limpiar campos del formulario después de registrar el gasto
        categoriaSelect.value = "0";
        montoInput.value = "";
    
        actualizarTablaGastos();
    
        var gastoTotalViaje = calcularGastoTotal();
        actualizarResultados(gastoTotalViaje); // Actualizar resultados después de registrar el gasto
    }
    

    // Función para actualizar la tabla de gastos
    function actualizarTablaGastos() {
        var tbody = tablaGastos.querySelector("tbody");

        // Limpiar filas existentes en el tbody
        tbody.innerHTML = "";

        // Crear una fila por cada categoría de gastos
        agregarFilaGasto(tbody, "Comida", gastosComida);
        agregarFilaGasto(tbody, "Pasajes", gastosPasajes);
        agregarFilaGasto(tbody, "Alojamiento", gastosAlojamiento);
        // Agrega más categorías según sea necesario
    }

    // Función para agregar una fila de gasto a la tabla
    function agregarFilaGasto(tbody, categoria, gastos) {
        var fila = document.createElement("tr");

        var categoriaCell = document.createElement("td");
        categoriaCell.textContent = categoria;

        var montoTotal = gastos.reduce(function (total, gasto) {
            return total + gasto;
        }, 0).toFixed(2);

        var montoCell = document.createElement("td");
        montoCell.textContent = "$" + montoTotal;

        fila.appendChild(categoriaCell);
        fila.appendChild(montoCell);

        tbody.appendChild(fila);
    }

    // Función para actualizar los resultados
    function actualizarResultados(gastoTotalViaje) {
        var porcentajeGastado = (gastoTotalViaje / presupuestoViaje) * 100;
        barraProgreso.value = porcentajeGastado;
        porcentajeTexto.textContent = "Hasta el momento llevas gastado un " + porcentajeGastado.toFixed(2) + "%" + " de tu presupuesto";

        gastoTotalElement.textContent = "Gasto total del viaje: $" + gastoTotalViaje.toFixed(2);

        if (gastoTotalViaje > presupuestoViaje) {
            var excesoGastos = gastoTotalViaje - presupuestoViaje;
            ahorroElement.textContent = "¡Cuidado! Tus gastos durante el viaje han excedido tu presupuesto por $" + excesoGastos.toFixed(2);
            gastoExcedidoElement.textContent = "";
        } else {
            var ahorroViaje = presupuestoViaje - gastoTotalViaje;
            ahorroElement.textContent = "¡Excelente! Has logrado viajar dentro de tu presupuesto y has ahorrado $" + ahorroViaje.toFixed(2);
            gastoExcedidoElement.textContent = "";
        }

        // Guardar el presupuesto completo, incluyendo los gastos
        guardarPresupuesto(nombrePresupuesto);
    }

    // Evento al presionar el botón "Registrar Gasto"
    registrarGastoBtn.addEventListener("click", registrarGasto);

    // Evento al cargar la página para obtener el presupuesto
    document.getElementById("guardarPresupuestoBtn").addEventListener("click", function () {
        presupuestoViaje = parseFloat(presupuestoInput.value);
        nombrePresupuesto = nombrePresupuestoInput.value;

        if (!isNaN(presupuestoViaje) && presupuestoViaje >= 0 && nombrePresupuesto) {
            // Restablecer los campos de entrada de gastos
            reiniciarCamposGastos();

            localStorage.setItem("presupuestoViaje", presupuestoViaje);
            guardarPresupuesto(nombrePresupuesto);

            // Agregar el nuevo presupuesto a la lista de selección
            var option = document.createElement("option");
            option.value = nombrePresupuesto;
            option.textContent = nombrePresupuesto;
            seleccionarPresupuestoInput.appendChild(option);

            var gastoTotalViaje = calcularGastoTotal();
            actualizarResultados(gastoTotalViaje);
            actualizarTablaGastos();
        } else {
            alert("Ingrese un presupuesto válido y un nombre de presupuesto para el viaje.");
        }
    });

    // Evento al seleccionar un presupuesto guardado
    seleccionarPresupuestoInput.addEventListener("change", function () {
        nombrePresupuesto = seleccionarPresupuestoInput.value;
        cargarPresupuesto(nombrePresupuesto);
        actualizarTablaGastos();
    });

    // Función para guardar los datos del presupuesto actual en localStorage
    function guardarPresupuesto(nombrePresupuesto) {
        // Guardar tanto el presupuesto como los gastos en el mismo objeto
        var presupuesto = {
            nombre: nombrePresupuesto,
            presupuestoViaje: presupuestoViaje,
            gastos: {
                comida: gastosComida,
                pasajes: gastosPasajes,
                alojamiento: gastosAlojamiento,
                // Agrega más categorías según sea necesario
            }
        };
        localStorage.setItem(nombrePresupuesto, JSON.stringify(presupuesto));
    }

    // Función para cargar los datos de un presupuesto desde localStorage
function cargarPresupuesto(nombrePresupuesto) {
    var presupuestoJSON = localStorage.getItem(nombrePresupuesto);
    if (presupuestoJSON) {
        var presupuesto = JSON.parse(presupuestoJSON);
        presupuestoViaje = presupuesto.presupuestoViaje;

        // Limpiar los arrays de gastos antes de cargar el nuevo presupuesto
        gastosComida = [];
        gastosPasajes = [];
        gastosAlojamiento = [];
        // Agrega más categorías según sea necesario

        // Cargar tanto el presupuesto como los gastos desde el objeto del presupuesto
        cargarGastosDesdePresupuesto(presupuesto.gastos);

        presupuestoInput.value = presupuestoViaje;
        nombrePresupuestoInput.value = nombrePresupuesto; // Establecer el nombre del presupuesto en el input

        var gastoTotalViaje = calcularGastoTotal();
        actualizarResultados(gastoTotalViaje);
    }
}


    // Función para cargar los gastos de un presupuesto
    function cargarGastosDesdePresupuesto(gastos) {
        if (gastos) {
            gastosComida = gastos.comida || [];
            gastosPasajes = gastos.pasajes || [];
            gastosAlojamiento = gastos.alojamiento || [];
            // Agrega más categorías según sea necesario
            actualizarTablaGastos();
        }
    }

    // Función para reiniciar los campos de entrada de gastos
    function reiniciarCamposGastos() {
        categoriaSelect.value = "0";
        montoInput.value = "";
    }

    // Restablecer los campos de entrada de gastos al cargar la página
    reiniciarCamposGastos();
    

    // Cargar la lista de presupuestos disponibles al cargar la página
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (!isNaN(parseFloat(localStorage.getItem(key)))) {
            // Es un presupuesto válido
            var option = document.createElement("option");
            option.value = key;
            option.textContent = key;
            seleccionarPresupuestoInput.appendChild(option);
        }
    }

    // Cargar el presupuesto inicial si está presente en localStorage
    cargarPresupuesto(localStorage.getItem("presupuestoSeleccionado"));
});
