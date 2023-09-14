function gestionarPresupuestoViaje() {
  
  var presupuestoViaje = parseFloat(prompt("Ingrese su presupuesto total para el viaje:"));

  if (!isNaN(presupuestoViaje) && presupuestoViaje >= 0) {
    var gastosPorCategoria = {};

    var continuarRegistrando = true;
    while (continuarRegistrando) {
      var categoria = prompt("Ingrese la categoría del gasto (comida, pasajes, alojamiento, etc.), o ingrese 'fin' para detenerse:");
      if (categoria === null) {
        // El usuario presionó "Cancelar"
        continuarRegistrando = false;
      } else if (categoria.toLowerCase() === 'fin') {
        // El usuario ingresó "fin" para detenerse
        continuarRegistrando = false;
      } else if (categoria.trim() === '') {
        // El usuario no ingresó ninguna categoría
        alert("Por favor, ingrese una categoría válida.");
      } else {
        var gasto = parseFloat(prompt("Ingrese el monto del gasto en la categoría '" + categoria + "':"));
        if (!isNaN(gasto)) {
          if (gastosPorCategoria[categoria]) {
            gastosPorCategoria[categoria] += gasto;
          } else {
            gastosPorCategoria[categoria] = gasto;
          }
        } else {
          alert("Por favor, ingrese un monto válido.");
        }
      }
    }

    var gastoTotalViaje = 0;
    for (var categoria in gastosPorCategoria) {
      gastoTotalViaje += gastosPorCategoria[categoria];
    }

    if (gastoTotalViaje > presupuestoViaje) {
      var excesoGastos = gastoTotalViaje - presupuestoViaje;
      alert("¡Cuidado! Tus gastos durante el viaje han excedido tu presupuesto por $" + excesoGastos.toFixed(2));
    } else {
      var ahorroViaje = presupuestoViaje - gastoTotalViaje;
      alert("¡Excelente! Has logrado viajar dentro de tu presupuesto y has ahorrado $" + ahorroViaje.toFixed(2) + ".");
    }
  } else {
    alert("Por favor, ingrese un presupuesto válido para el viaje.");
  }
}

gestionarPresupuestoViaje();


function mostrarRecomendaciones(seleccionado) {
    var recomendacionesTexto = '';

    if (seleccionado === 'aventura') {
        recomendacionesTexto = '¡Prepárate para emocionantes actividades de aventura!';
    } else if (seleccionado === 'relajacion') {
        recomendacionesTexto = 'Disfruta de destinos tranquilos y relajantes.';
    } else if (seleccionado === 'cultura') {
        recomendacionesTexto = 'Explora la rica cultura de tus destinos.';
    } else {
        recomendacionesTexto = 'Selecciona una opción válida: aventura, relajación o cultura.';
    }

    alert(recomendacionesTexto);
}

// Obtener la selección del usuario
var seleccionado = prompt("Seleccione una opción: aventura, relajación o cultura");

// Invocar la función con la selección del usuario
mostrarRecomendaciones(seleccionado);