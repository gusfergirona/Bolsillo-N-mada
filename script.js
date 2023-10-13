// Función para crear un objeto de presupuesto
function crearPresupuesto(nombre, gastos, presupuestoTotal) {
  return {
    nombre: nombre,
    id: Date.now(),
    gastos: gastos,
    presupuestoTotal: presupuestoTotal,
  };
}

// Función para guardar un presupuesto en el almacenamiento local
function guardarPresupuesto(presupuesto) {
  let presupuestos = JSON.parse(localStorage.getItem('presupuestos')) || [];

  // Busca si ya existe un presupuesto con el mismo nombre
  const presupuestoExistente = buscarPresupuestoPorNombre(presupuesto.nombre, presupuestos);

  if (presupuestoExistente) {
    // Si existe, sobrescribe el presupuesto
    presupuestos = presupuestos.map((p) => (p.id === presupuestoExistente.id ? presupuesto : p));
  } else {
    // Si no existe, agrega el nuevo presupuesto
    presupuestos.push(presupuesto);
  }

  localStorage.setItem('presupuestos', JSON.stringify(presupuestos));
}

// Función para buscar un presupuesto por nombre en la lista de presupuestos
function buscarPresupuestoPorNombre(nombre, presupuestos) {
  return presupuestos.find((presupuesto) => presupuesto.nombre === nombre);
}

// Función para cargar presupuestos desde el almacenamiento local
function cargarPresupuestos() {
  let presupuestos = JSON.parse(localStorage.getItem('presupuestos')) || [];
  return presupuestos;
}

let gastoCount = 1; // Inicializar el contador de gastos

// Función para agregar un campo para un nuevo gasto con nombre y valor
function agregarCampoGasto() {
  gastoCount++;
  const gastoContainer = document.getElementById('gastos-container');

  const nuevoGasto = document.createElement('div');
  nuevoGasto.className = 'gasto';
  nuevoGasto.innerHTML = `
    <label for="nombre-gasto-${gastoCount}">Nombre del Gasto:</label>
    <input type="text" id="nombre-gasto-${gastoCount}" required>
    <label for="valor-gasto-${gastoCount}">Valor del Gasto:</label>
    <input type="number" id="valor-gasto-${gastoCount}" required>
  `;
  gastoContainer.appendChild(nuevoGasto);
}

// Función para agregar un nuevo campo de gasto en "Detalles del Presupuesto"
function agregarCampoGastoDetalle() {
  const listaGastos = document.getElementById('lista-gastos');
  const nuevoCampo = document.createElement('li');
  nuevoCampo.innerHTML = `
    <span class="nombre-gasto" contenteditable="true">Nombre del Gasto</span>
    <span class="valor-gasto" contenteditable="true">Valor del Gasto</span>
  `;
  listaGastos.appendChild(nuevoCampo);
}

// Función para mostrar los detalles de un presupuesto seleccionado
function mostrarDetallesPresupuesto(presupuesto) {
  const detallesPresupuesto = document.getElementById('detalles-presupuesto');

  detallesPresupuesto.innerHTML = ''; // Limpiar detalles previos

  if (presupuesto) {
    detallesPresupuesto.innerHTML = `
      <h3>Nombre del Presupuesto: 
        <span class="nombre-gasto" contenteditable="true">${presupuesto.nombre}</span>
      </h3>
      <p>Presupuesto Total: 
        <span class="valor-gasto" contenteditable="true">${presupuesto.presupuestoTotal}</span>
      </p>
      <h4>Gastos:</h4>
      <ul id="lista-gastos">
        ${presupuesto.gastos.map((gasto, index) => `
          <li>
            Nombre del Gasto: <span class="nombre-gasto" contenteditable="true">${gasto.nombre}</span>
            <br>
            Valor del Gasto: <span class="valor-gasto" contenteditable="true">${gasto.valor}</span>
          </li>
        `).join('')}
      </ul>
      <button id="agregar-gasto-detalle">Agregar Gasto</button>
      <button id="guardar-modificacion">Guardar Modificación</button>
      <button id="eliminar-presupuesto">Eliminar Presupuesto</button>
    `;

    document.getElementById('agregar-gasto-detalle').addEventListener('click', function () {
      agregarCampoGastoDetalle();
    });

    document.getElementById('guardar-modificacion').addEventListener('click', function () {
      const nuevoNombre = document.querySelector('.nombre-gasto').textContent;
      const nuevoPresupuestoTotal = parseFloat(document.querySelector('.valor-gasto').textContent);

      // Obtén los gastos del documento y actualiza el objeto presupuesto
      const listaGastos = document.getElementById('lista-gastos').getElementsByTagName('li');
      const gastos = [];
      for (let i = 0; i < listaGastos.length; i++) {
        const nombreGasto = listaGastos[i].querySelectorAll('span.nombre-gasto')[0].textContent;
        const valorGasto = parseFloat(listaGastos[i].querySelectorAll('span.valor-gasto')[0].textContent);
        gastos.push({ nombre: nombreGasto, valor: valorGasto });
      }

      presupuesto.nombre = nuevoNombre;
      presupuesto.presupuestoTotal = nuevoPresupuestoTotal;
      presupuesto.gastos = gastos;

      // Vuelve a guardar el presupuesto modificado
      guardarPresupuesto(presupuesto);

      // Actualiza el selector de presupuestos
      const presupuestos = cargarPresupuestos();
      mostrarPresupuestosEnSelector(presupuestos);

      // Muestra los detalles actualizados del presupuesto
      mostrarDetallesPresupuesto(presupuesto);
    });

    document.getElementById('eliminar-presupuesto').addEventListener('click', function () {
      if (confirm('¿Seguro que deseas eliminar este presupuesto?')) {
        eliminarPresupuesto(presupuesto.id);
      }
    });
  } else {
    detallesPresupuesto.innerHTML = 'Selecciona un presupuesto para ver los detalles.';
  }
}

// Función para mostrar los presupuestos en un selector HTML
function mostrarPresupuestosEnSelector(presupuestos) {
  const selectorPresupuestos = document.getElementById('selector-presupuestos');

  selectorPresupuestos.innerHTML = ''; // Limpiar opciones existentes

  presupuestos.forEach((presupuesto) => {
    const option = document.createElement('option');
    option.value = presupuesto.id;
    option.text = presupuesto.nombre;
    selectorPresupuestos.appendChild(option);
  });

  // Agrega un evento de cambio para manejar la selección del presupuesto
  selectorPresupuestos.addEventListener('change', function () {
    const selectedId = parseInt(this.value);
    const selectedPresupuesto = presupuestos.find((presupuesto) => presupuesto.id === selectedId);
    mostrarDetallesPresupuesto(selectedPresupuesto);
  });

  // Dispara el evento de cambio para mostrar los detalles del primer presupuesto (si existe)
  if (presupuestos.length > 0) {
    selectorPresupuestos.dispatchEvent(new Event('change'));
  }
}

// Función para eliminar un presupuesto del almacenamiento local
function eliminarPresupuesto(id) {
  const presupuestos = cargarPresupuestos();
  const indicePresupuesto = presupuestos.findIndex((presupuesto) => presupuesto.id === id);
  if (indicePresupuesto !== -1) {
    presupuestos.splice(indicePresupuesto, 1);
    localStorage.setItem('presupuestos', JSON.stringify(presupuestos));

    // Actualiza el selector de presupuestos
    mostrarPresupuestosEnSelector(presupuestos);

    // Limpia la sección de detalles del presupuesto
    const detallesPresupuesto = document.getElementById('detalles-presupuesto');
    detallesPresupuesto.innerHTML = 'Presupuesto eliminado';

    // Elimina la opción del selector
    const selectorPresupuestos = document.getElementById('selector-presupuestos');
    const optionToDelete = selectorPresupuestos.querySelector(`[value="${id}"]`);
    if (optionToDelete) {
      selectorPresupuestos.removeChild(optionToDelete);
    }

    // Añade el siguiente bloque de código para forzar la selección del primer presupuesto (si existe)
    if (presupuestos.length > 0) {
      selectorPresupuestos.value = presupuestos[0].id;
      selectorPresupuestos.dispatchEvent(new Event('change'));
    } else {
      selectorPresupuestos.innerHTML = ''; // Limpia el selector si no hay presupuestos
    }
  }
}


// Cargar y mostrar los presupuestos al cargar la página
document.addEventListener('DOMContentLoaded', function () {
  const presupuestos = cargarPresupuestos();
  mostrarPresupuestosEnSelector(presupuestos);

  document.getElementById('agregar-gasto').addEventListener('click', agregarCampoGasto);
  document.getElementById('formulario-presupuesto').addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre-presupuesto').value;
    const presupuestoTotal = parseFloat(document.getElementById('total-presupuesto').value);
    const gastos = [];

    // Recopilar los datos de gastos en el formulario
    const gastoInputs = document.querySelectorAll('.gasto input[type="text"]');
    const valorInputs = document.querySelectorAll('.gasto input[type="number"]');

    gastoInputs.forEach((nombreInput, index) => {
      const valorInput = valorInputs[index];
      const nombreGasto = nombreInput.value;
      const valorGasto = parseFloat(valorInput.value);
      gastos.push({ nombre: nombreGasto, valor: valorGasto });
    });

    const nuevoPresupuesto = crearPresupuesto(nombre, gastos, presupuestoTotal);
    guardarPresupuesto(nuevoPresupuesto);

    // Restablecer el contador de gastos
    gastoCount = 1;

    // Limpiar el formulario
    document.getElementById('nombre-presupuesto').value = '';
    document.getElementById('total-presupuesto').value = '';
    const gastoContainer = document.getElementById('gastos-container');
    gastoContainer.innerHTML = '';
    agregarCampoGasto();

    // Actualizar el selector de presupuestos
    const presupuestos = cargarPresupuestos();
    mostrarPresupuestosEnSelector(presupuestos);
  });
});
