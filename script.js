// Objeto para almacenar los destinos según interés
var destinos = {
  1: ["Nepal", "Costa Rica", "Marruecos"],
  2: ["Bora Bora", "Bali", "Santorini"],
  3: ["Kioto", "Roma", "El Cairo"]
};

// Arrays para almacenar los gastos por categoría
var gastosComida = [];
var gastosPasajes = [];
var gastosAlojamiento = [];

function gestionarPresupuestoViaje() {
  var presupuestoViaje;

  while (true) {
      var presupuestoTexto = prompt("Ingrese su presupuesto total para el viaje:");
      presupuestoViaje = parseFloat(presupuestoTexto);

      if (!isNaN(presupuestoViaje) && presupuestoViaje >= 0) {
          break; // Salir del bucle si el valor es válido
      } else {
          alert("Por favor, ingrese un presupuesto válido para el viaje.");
      }
  }

  var continuarRegistrando = true;
  while (continuarRegistrando) {
      var categoria = prompt("Ingrese la categoría del gasto (comida = 1, pasajes = 2, alojamiento = 3, etc.), o ingrese 'fin' para detenerse:");
      if (categoria === null) {
          // "Cancelar"
          continuarRegistrando = false;
      } else if (categoria.toLowerCase() === 'fin') {
          // "fin"
          continuarRegistrando = false;
      } else if (isNaN(parseInt(categoria)) || parseInt(categoria) <= 0) {
          alert("Por favor, ingrese una categoría válida (número positivo).");
      } else {
          var gasto = parseFloat(prompt("Ingrese el monto del gasto en la categoría '" + obtenerNombreCategoria(parseInt(categoria)) + "':"));
          if (!isNaN(gasto)) {
              if (parseInt(categoria) === 1) {
                  gastosComida.push(gasto);
              } else if (parseInt(categoria) === 2) {
                  gastosPasajes.push(gasto);
              } else if (parseInt(categoria) === 3) {
                  gastosAlojamiento.push(gasto);
              }
          } else {
              alert("Por favor, ingrese un monto válido.");
          }
      }
  }

  var gastoTotalViaje = calcularGastoTotal();

  if (gastoTotalViaje > presupuestoViaje) {
      var excesoGastos = gastoTotalViaje - presupuestoViaje;
      alert("¡Cuidado! Tus gastos durante el viaje han excedido tu presupuesto por $" + excesoGastos.toFixed(2));
  } else {
      var ahorroViaje = presupuestoViaje - gastoTotalViaje;
      alert("¡Excelente! Has logrado viajar dentro de tu presupuesto y has ahorrado $" + ahorroViaje.toFixed(2) + ".");
  
  
  calcularGastoTotal()
  mostrarGastoPorCategoria();
  }
}

function mostrarGastoPorCategoria() {
  var listaGastos = "Gasto por categoría:\n";
  listaGastos += "Comida: $" + calcularGastoPorCategoria(gastosComida).toFixed(2) + "\n";
  listaGastos += "Pasajes: $" + calcularGastoPorCategoria(gastosPasajes).toFixed(2) + "\n";
  listaGastos += "Alojamiento: $" + calcularGastoPorCategoria(gastosAlojamiento).toFixed(2) + "\n";
  alert(listaGastos);
}

function calcularGastoPorCategoria(arrayGastos) {
  return arrayGastos.reduce(function (total, gasto) {
      return total + gasto;
  }, 0);
}

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

  return gastoTotal;
}

function obtenerNombreCategoria(numeroCategoria) {
  switch (numeroCategoria) {
      case 1:
          return 'comida';
      case 2:
          return 'pasajes';
      case 3:
          return 'alojamiento';
      default:
          return 'otra categoría';
  }
}

gestionarPresupuestoViaje();

function mostrarRecomendaciones(seleccionado) {
  var destinosRecomendados = destinos[seleccionado];
  if (destinosRecomendados && destinosRecomendados.length > 0) {
      alert("Destinos recomendados para " + seleccionado + ": " + destinosRecomendados.join(', '));
  } else {
      alert("No hay destinos recomendados para " + seleccionado);
  }
}

var seleccionado;

while (true) {
  seleccionado = prompt("Seleccione una opción: aventura = 1, relajación = 2, cultura = 3");

  if (seleccionado === null) {
      break;
  } else if (destinos[parseInt(seleccionado)]) {
      mostrarRecomendaciones(parseInt(seleccionado));
      break;
  } else {
      alert("Por favor, ingrese una opción válida.");
  }
}