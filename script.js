class Presupuesto {
  constructor(nombre, gastos, presupuestoTotal) {
    this.nombre = nombre;
    this.id = Date.now();
    this.gastos = gastos;
    this.presupuestoTotal = presupuestoTotal;
  }
}

function guardarPresupuesto(presupuesto) {
  let presupuestos = JSON.parse(localStorage.getItem('presupuestos')) || [];

  const presupuestoExistente = buscarPresupuestoPorNombre(presupuesto.nombre, presupuestos);

  if (presupuestoExistente) {
    presupuestos = presupuestos.map((p) => (p.id === presupuestoExistente.id ? presupuesto : p));
  } else {
    presupuestos.push(presupuesto);
  }

  localStorage.setItem('presupuestos', JSON.stringify(presupuestos));
}

function buscarPresupuestoPorNombre(nombre, presupuestos) {
  return presupuestos.find((presupuesto) => presupuesto.nombre === nombre);
}

function cargarPresupuestos() {
  let presupuestos = JSON.parse(localStorage.getItem('presupuestos')) || [];
  return presupuestos;
}

function agregarCampoGasto() {
  const gastoContainer = document.getElementById('gastos-container');

  const nuevoGasto = document.createElement('div');
  const uniqueId = Date.now();
  nuevoGasto.className = 'gasto form-group row';
  nuevoGasto.innerHTML = `
    <label for="nombre-gasto-${uniqueId}" class="col-sm-3 col-form-label">Nombre del Gasto:</label>
    <div class="col-sm-9">
      <input type="text" id="nombre-gasto-${uniqueId}" name="nombre-gasto[]" class="form-control" required>
    </div>
    <label for="valor-gasto-${uniqueId}" class="col-sm-3 col-form-label">Valor del Gasto:</label>
    <div class="col-sm-9">
      <input type="number" id="valor-gasto-${uniqueId}" name="valor-gasto[]" class="form-control" required>
    </div>
  `;
  gastoContainer.appendChild(nuevoGasto);
}

function agregarCampoGastoDetalle() {
  const listaGastos = document.getElementById('lista-gastos');
  const uniqueId = Date.now();

  const nuevoCampo = document.createElement('li');
  nuevoCampo.innerHTML = `
    <label for="nombre-gasto-${uniqueId}">Nombre del Gasto:</label>
    <span class="nombre-gasto" contenteditable="true">Nombre del Gasto</span>
    <label for="valor-gasto-${uniqueId}">Valor del Gasto:</label>
    <span class="valor-gasto" contenteditable="true">Valor del Gasto</span>
  `;
  listaGastos.appendChild(nuevoCampo);
}

function calcularEstadoPresupuesto(presupuesto) {
  if (!presupuesto || !presupuesto.gastos) {
    return 'No se ha seleccionado un presupuesto válido.';
  }

  const gastosTotales = presupuesto.gastos.reduce((total, gasto) => total + gasto.valor, 0);
  const diferencia = presupuesto.presupuestoTotal - gastosTotales;

  if (diferencia > 0) {
    return `Dentro del presupuesto. Has ahorrado $${diferencia.toFixed(2)}`;
  } else if (diferencia < 0) {
    return `Has excedido el presupuesto por $${Math.abs(diferencia).toFixed(2)}`;
  } else {
    return `Has utilizado todo el presupuesto.`;
  }
}

function mostrarEstadoPresupuesto(presupuesto) {
  const estadoPresupuesto = document.getElementById('estado-presupuesto');
  estadoPresupuesto.textContent = calcularEstadoPresupuesto(presupuesto);
}

function mostrarDetallesPresupuesto(presupuesto) {
  const detallesPresupuesto = document.getElementById('detalles-presupuesto');

  detallesPresupuesto.innerHTML = '';

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
            <label for="nombre-gasto-${index}-${presupuesto.id}">Nombre del Gasto:</label>
            <span class="nombre-gasto" contenteditable="true">${gasto.nombre}</span>
            <label for="valor-gasto-${index}-${presupuesto.id}">Valor del Gasto:</label>
            <span class="valor-gasto" contenteditable="true">${gasto.valor}</span>
          </li>
        `).join('')}
      </ul>
      <button id="agregar-gasto-detalle" class="btn btn-primary">Agregar Gasto</button>
      <button id="guardar-modificacion" class="btn btn-success">Guardar Modificación</button>
    `;

    const eliminarPresupuestoButton = document.createElement('button');
    eliminarPresupuestoButton.id = 'eliminar-presupuesto';
    eliminarPresupuestoButton.textContent = 'Eliminar Presupuesto';
    eliminarPresupuestoButton.classList.add('btn', 'btn-danger');
    detallesPresupuesto.appendChild(eliminarPresupuestoButton);

    document.getElementById('agregar-gasto-detalle').addEventListener('click', function () {
      agregarCampoGastoDetalle();
    });

    document.getElementById('guardar-modificacion').addEventListener('click', function () {
      const nuevoNombre = document.querySelector('.nombre-gasto').textContent;
      const nuevoPresupuestoTotal = parseFloat(document.querySelector('.valor-gasto').textContent);

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

      guardarPresupuesto(presupuesto);

      const presupuestos = cargarPresupuestos();
      mostrarPresupuestosEnSelector(presupuestos);

      mostrarEstadoPresupuesto(presupuesto);
    });

    eliminarPresupuestoButton.addEventListener('click', async function () {
      if (await Swal.fire({
        title: '¿Seguro que deseas eliminar este presupuesto?',
        text: 'No podrás deshacer esta acción',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => result.isConfirmed)) {
        eliminarPresupuesto(presupuesto.id);

        Swal.fire('Presupuesto Eliminado', 'El presupuesto ha sido eliminado con éxito.', 'success');
      }
    });
  } else {
    detallesPresupuesto.innerHTML = 'Selecciona un presupuesto para ver los detalles.';
  }
}

function mostrarPresupuestosEnSelector(presupuestos) {
  const selectorPresupuestos = document.getElementById('selector-presupuestos');

  selectorPresupuestos.innerHTML = '';

  presupuestos.forEach((presupuesto) => {
    const option = document.createElement('option');
    option.value = presupuesto.id;
    option.text = presupuesto.nombre;
    selectorPresupuestos.appendChild(option);
  });

  selectorPresupuestos.addEventListener('change', function () {
    const selectedId = parseInt(this.value);
    const selectedPresupuesto = presupuestos.find((presupuesto) => presupuesto.id === selectedId);
    mostrarDetallesPresupuesto(selectedPresupuesto);
    mostrarEstadoPresupuesto(selectedPresupuesto);
  });

  if (presupuestos.length > 0) {
    selectorPresupuestos.dispatchEvent(new Event('change'));
  }
}

function eliminarPresupuesto(id) {
  const presupuestos = cargarPresupuestos();
  const indicePresupuesto = presupuestos.findIndex((presupuesto) => presupuesto.id === id);
  if (indicePresupuesto !== -1) {
    presupuestos.splice(indicePresupuesto, 1);
    localStorage.setItem('presupuestos', JSON.stringify(presupuestos));

    mostrarPresupuestosEnSelector(presupuestos);

    const detallesPresupuesto = document.getElementById('detalles-presupuesto');
    detallesPresupuesto.innerHTML = 'Presupuesto eliminado';

    const selectorPresupuestos = document.getElementById('selector-presupuestos');
    const optionToDelete = selectorPresupuestos.querySelector(`[value="${id}"]`);
    if (optionToDelete) {
      selectorPresupuestos.removeChild(optionToDelete);
    }

    if (presupuestos.length > 0) {
      selectorPresupuestos.value = presupuestos[0].id;
      selectorPresupuestos.dispatchEvent(new Event('change'));
    } else {
      selectorPresupuestos.innerHTML = '';
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const presupuestos = cargarPresupuestos();
  mostrarPresupuestosEnSelector(presupuestos);

  document.getElementById('agregar-gasto').addEventListener('click', agregarCampoGasto);
  document.getElementById('formulario-presupuesto').addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre-presupuesto').value;
    const presupuestoTotal = parseFloat(document.getElementById('total-presupuesto').value);
    const gastos = [];

    const gastoInputs = document.querySelectorAll('.gasto input[type="text"]');
    const valorInputs = document.querySelectorAll('.gasto input[type="number"]');

    gastoInputs.forEach((nombreInput, index) => {
      const valorInput = valorInputs[index];
      const nombreGasto = nombreInput.value;
      const valorGasto = parseFloat(valorInput.value);
      gastos.push({ nombre: nombreGasto, valor: valorGasto });
    });

    const nuevoPresupuesto = new Presupuesto(nombre, gastos, presupuestoTotal);
    guardarPresupuesto(nuevoPresupuesto);

    document.getElementById('nombre-presupuesto').value = '';
    document.getElementById('total-presupuesto').value = '';
    const gastoContainer = document.getElementById('gastos-container');
    gastoContainer.innerHTML = '';
    agregarCampoGasto();

    const presupuestos = cargarPresupuestos();
    mostrarPresupuestosEnSelector(presupuestos);

    mostrarEstadoPresupuesto(nuevoPresupuesto);

    Swal.fire('Presupuesto Creado', 'El nuevo presupuesto ha sido creado con éxito.', 'success');
  });

  document.getElementById('mostrar-destinos').addEventListener('click', function () {
    cargarYMostrarDestinos();
  });
});

async function cargarYMostrarDestinos() {
  try {
    const response = await fetch('destinos.json');
    if (!response.ok) {
      throw new Error('No se pudo cargar el archivo de destinos.');
    }

    const destinos = await response.json();

    const selectorPresupuestos = document.getElementById('selector-presupuestos');
    const selectedId = parseInt(selectorPresupuestos.value);
    const presupuestos = cargarPresupuestos();
    const presupuesto = presupuestos.find((p) => p.id === selectedId);

    if (!presupuesto) {
      Swal.fire('Error', 'Por favor, selecciona un presupuesto antes de buscar destinos.', 'error');
      return;
    }

    const destinosAdecuados = destinos.filter((destino) => destino.valor_estimado <= presupuesto.presupuestoTotal);

    const destinosAMostrar = destinosAdecuados.slice(0, 3);

    const listaDestinos = document.getElementById('lista-destinos');
    listaDestinos.innerHTML = '';

    destinosAMostrar.forEach((destino) => {
      const destinoCard = document.createElement('div');
      destinoCard.className = 'card';
    
      const carouselId = `carousel-${destino.nombre}-${Date.now()}`;
      destinoCard.innerHTML = `
  <div id="${carouselId}" class="carousel slide" data-ride="carousel">
    <div class="carousel-inner">
      ${destino.imagenes.slice(0, 3).map((imagen, index) => `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
          <img src="${imagen}" class="d-block" style="width: 300px; height: 200px;" alt="${destino.nombre} - Imagen ${index + 1}">
        </div>
      `).join('')}
    </div>
    <a class="carousel-control-prev" href="#${carouselId}" role="button" data-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="sr-only">Anterior</span>
    </a>
    <a class="carousel-control-next" href="#${carouselId}" role="button" data-slide="next">
      <span class="carousel-control-next-icon" ariahidden="true"></span>
      <span class="sr-only">Siguiente</span>
    </a>
  </div>
  <div class="card-body">
    <h5 class="card-title">${destino.nombre}</h5>
    <p class="card-text">${destino.datos_interes}</p>
    <p class="card-text">Valor Estimado: $${destino.valor_estimado.toFixed(2)}</p>
  </div>
`;
    
      listaDestinos.appendChild(destinoCard);
    });
    
    // Inicializa los carruseles
    destinosAMostrar.forEach((destino) => {
      const carouselId = `carousel-${destino.nombre}-${Date.now()}`;
      $(`#${carouselId}`).carousel(); // Activa el carrusel
    });

    if (destinosAMostrar.length === 0) {
      Swal.fire('Destinos no encontrados', 'No hay destinos adecuados para tu presupuesto.', 'info');
    }
  } catch (error) {
    console.error(error);
    Swal.fire('Error', 'Hubo un error al cargar los destinos.', 'error');
  }
}

