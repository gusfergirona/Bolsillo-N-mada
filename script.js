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
    const existingPresupuestoIndex = presupuestos.findIndex(p => p.id === presupuesto.id);
    if (existingPresupuestoIndex !== -1) {
      presupuestos[existingPresupuestoIndex] = presupuesto;
    } else {
      presupuestos.push(presupuesto);
    }
    localStorage.setItem('presupuestos', JSON.stringify(presupuestos));
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
  
  // Manejador de clic para agregar gasto
  document.getElementById('agregar-gasto').addEventListener('click', agregarCampoGasto);
  
  // Manejador de envío de formulario
  document.getElementById('formulario-presupuesto').addEventListener('submit', function (event) {
    event.preventDefault();
  
    const nombre = document.getElementById('nombre-presupuesto').value;
    const gastos = [];
    for (let i = 1; i <= gastoCount; i++) {
      const nombreGasto = document.getElementById(`nombre-gasto-${i}`).value;
      const valorGasto = parseFloat(document.getElementById(`valor-gasto-${i}`).value);
      gastos.push({ nombre: nombreGasto, valor: valorGasto });
    }
    const presupuestoTotal = parseFloat(document.getElementById('total-presupuesto').value);
  
    const nuevoPresupuesto = crearPresupuesto(nombre, gastos, presupuestoTotal);
    guardarPresupuesto(nuevoPresupuesto);
  
    // Limpiar el formulario
    document.getElementById('nombre-presupuesto').value = '';
    document.getElementById('total-presupuesto').value = '';
    gastoCount = 1;
    const gastoContainer = document.getElementById('gastos-container');
    gastoContainer.innerHTML = '';
    agregarCampoGasto();
  
    // Actualizar el selector de presupuestos
    const presupuestos = cargarPresupuestos();
    mostrarPresupuestosEnSelector(presupuestos);
  });
  
  // Manejador de selección de presupuesto
  document.getElementById('selector-presupuestos').addEventListener('change', function () {
    const selectedId = parseInt(this.value);
    const presupuestos = cargarPresupuestos();
    const selectedPresupuesto = presupuestos.find((presupuesto) => presupuesto.id === selectedId);
  
    mostrarDetallesPresupuesto(selectedPresupuesto);
  });
  
  // Función para mostrar los detalles de un presupuesto seleccionado
  function mostrarDetallesPresupuesto(presupuesto) {
    const detallesPresupuesto = document.getElementById('detalles-presupuesto');
  
    detallesPresupuesto.innerHTML = ''; // Limpiar detalles previos
  
    if (presupuesto) {
      detallesPresupuesto.innerHTML = `
        <h3>Nombre del Presupuesto: 
          <input type="text" id="nombre-presupuesto-edit" value="${presupuesto.nombre}" required>
        </h3>
        <p>Presupuesto Total: 
          <input type="number" id="presupuesto-total-edit" value="${presupuesto.presupuestoTotal}" required>
        </p>
        <h4>Gastos:</h4>
        <ul id="lista-gastos">
          ${presupuesto.gastos.map((gasto, index) => `
            <li>
              <input type="text" id="detalle-nombre-gasto-${index}" value="${gasto.nombre}" required>
              <input type="number" id="detalle-valor-gasto-${index}" value="${gasto.valor}" required>
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
        const nuevoNombre = document.getElementById('nombre-presupuesto-edit').value;
        const nuevoPresupuestoTotal = parseFloat(document.getElementById('presupuesto-total-edit').value);
        const gastos = [];
        const listaGastos = document.getElementById('lista-gastos').getElementsByTagName('li');
        for (let i = 0; i < listaGastos.length; i++) {
          const nombreGasto = document.getElementById(`detalle-nombre-gasto-${i}`).value;
          const valorGasto = parseFloat(document.getElementById(`detalle-valor-gasto-${i}`).value);
          gastos.push({ nombre: nombreGasto, valor: valorGasto });
        }
  
        // Actualizar el presupuesto con las modificaciones
        presupuesto.nombre = nuevoNombre;
        presupuesto.presupuestoTotal = nuevoPresupuestoTotal;
        presupuesto.gastos = gastos;
  
        // Volver a guardar el presupuesto modificado
        guardarPresupuesto(presupuesto);
  
        // Actualizar el selector de presupuestos
        const presupuestos = cargarPresupuestos();
        mostrarPresupuestosEnSelector(presupuestos);
  
        // Mostrar los detalles actualizados del presupuesto
        mostrarDetallesPresupuesto(presupuesto);
      });
  
      document.getElementById('eliminar-presupuesto').addEventListener('click', function () {
        if (confirm('¿Seguro que deseas eliminar este presupuesto?')) {
          eliminarPresupuesto(presupuesto.id);
          // Limpiar la sección de detalles después de eliminar el presupuesto
          detallesPresupuesto.innerHTML = 'Presupuesto eliminado';
        }
      });
    } else {
      detallesPresupuesto.innerHTML = 'Selecciona un presupuesto para ver los detalles.';
    }
  }
  
  // Función para agregar un nuevo campo de gasto en "Detalles del Presupuesto"
  function agregarCampoGastoDetalle() {
    const listaGastos = document.getElementById('lista-gastos');
    const nuevoCampo = document.createElement('li');
    nuevoCampo.innerHTML = `
      <input type="text" id="detalle-nombre-gasto-${listaGastos.children.length}" placeholder="Nombre del Gasto" required>
      <input type="number" id="detalle-valor-gasto-${listaGastos.children.length}" placeholder="Valor del Gasto" required>
    `;
    listaGastos.appendChild(nuevoCampo);
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
  
      // Limpia la sección de detalles del presupuesto
      const detallesPresupuesto = document.getElementById('detalles-presupuesto');
      detallesPresupuesto.innerHTML = 'Presupuesto eliminado';
    }
  }
  
  // Cargar y mostrar los presupuestos al cargar la página
  window.addEventListener('load', function () {
    const presupuestos = cargarPresupuestos();
    mostrarPresupuestosEnSelector(presupuestos);
  });