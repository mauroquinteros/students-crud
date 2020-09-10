// API
const URL = "http://127.0.0.1:8000/api";
let dato;

// Element HTML
const lista = document.getElementById("lista");
const menu = document.getElementById("mi-menu");
const body = document.getElementById("content");
let btnModal = document.getElementById("ingresar");

// Events
const addmenu = (event) => {
  event.preventDefault();
  menu.style.display = "block";
  menu.style.left = event.pageX + "px";
  menu.style.top = event.pageY + "px";
  console.log("menu");
  dato = event.target.parentNode;
};

const salirmenu = () => {
  menu.style.display = "";
  menu.style.left = "";
  menu.style.top = "";
};

body.addEventListener("click", (event) => {
  if (event.target != lista) {
    menu.style.display = "";
    menu.style.left = "";
    menu.style.top = "";
  }
});

btnModal.addEventListener("click", async () => {
  const selectElement = await displayFacus();
  printmodal(`
    <div class="ingresar">
      <h1>Formulario Ingresar</h1>
      <form class="formulario" id="formulario">
        <div class="form-group">
          <label for="codigo">Codigo</label>
          <input type="text" class="form-control" id="codigo"  name="codigo" placeholder="Ingrese su codigo">
        </div>
        <div class="form-group">
          <label for="Nombres">Nombres</label>
          <input type="text" class="form-control" id="Nombres" name="nombres" placeholder="Ingrese su Nombre">
        </div>
        <div class="form-group">
          <label for="Apellidos">Apellidos</label>
          <input type="text" class="form-control" id="Apellidos" name="apellidos" placeholder="Ingrese su Apellidos">
        </div>
        <div class="form-group">
          <label for="Email">Correo Electronico</label>
          <input type="email" class="form-control" id="Email" name="email" placeholder="Ingrese su Correo Electronico">
        </div>
        <div class="form-group">
          ${selectElement.innerHTML}
        </div>
        <button type="submit" class="btn btn-primary">Aceptar</button>
        <button type="" class="btn btn-light">Cancelar</button>
      </form>
    </div>
    `);
  eventoformulario();
});

// Peticiones
async function getStudents() {
  const response = await fetch(`${URL}/students/`);
  const data = await response.json();
  return data;
}

async function getFacultades() {
  const response = await fetch(`${URL}/faculties/`);
  const data = await response.json();
  return data;
}

async function getFacultadById(id) {
  const response = await fetch(`${URL}/faculty/${id}/`);
  const data = await response.json();
  return data;
}

async function displayFacus() {
  const data = await getFacultades();
  const facuSelect = document.createElement("div");
  facuSelect.innerHTML = `
    <label for="Facultad">Facultad</label>
    <select class="form-control" name="facultad" id="facultad">
      <option  value="" selected disabled>Selecciona una facultad</option>
    </select>
  `;
  console.log(facuSelect.childNodes);
  const facultadElement = facuSelect.childNodes[3];
  console.log(facultadElement);
  data.forEach(({ id, nombre }) => {
    const optionElement = document.createElement("option");
    optionElement.setAttribute("value", id);
    optionElement.innerText = nombre;
    facultadElement.appendChild(optionElement);
  });
  return facuSelect;
}

async function displayList() {
  const listStudents = await getStudents();
  console.log(listStudents);
  for (const item of listStudents) {
    let res = document.createElement("tr");
    let { id, nombre } = await getFacultadById(item.facultad);
    res.dataset.codigo = item.cod;
    res.dataset.nombres = item.nombres;
    res.dataset.apellidos = item.apellidos;
    res.dataset.correo = item.correo;
    res.dataset.facultad = id;

    res.classList.add("click-derecho");
    res.innerHTML = `
      <td>${item.cod}</td>
      <td>${item.nombres}</td>
      <td>${item.apellidos}</td>
      <td>${item.correo}</td>
      <td>${nombre}</td>
   `;
    res.addEventListener("contextmenu", addmenu);
    res.addEventListener("click", salirmenu);
    lista.appendChild(res);
  }
}

function eventoformulario() {
  let form = document.getElementById("formulario");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formdata = new FormData(form);
    const data = await addStudent(formdata);
    console.log(data);
  });
}

async function addStudent(formdata) {
  const newStudent = {
    cod: formdata.get("codigo"),
    nombres: formdata.get("nombres"),
    apellidos: formdata.get("apellidos"),
    correo: formdata.get("email"),
    facultad: formdata.get("facultad"),
  };
  const options = {
    method: "POST",
    body: JSON.stringify(newStudent),
    headers: {
      "content-type": "application/json",
    },
  };
  const response = await fetch(`${URL}/add/student/`, options);
  const data = await response.json();
  return data;
}

// LLamando de las peticiones
displayList();

// Crear el Modal
const createCustomElement = (element, attributes, children) => {
  let customElement = document.createElement(element);
  if (children !== undefined)
    children.forEach((el) => {
      if (el.nodeType) {
        if (el.nodeType === 1 || el.nodeType === 11)
          customElement.appendChild(el);
      } else {
        customElement.innerHTML += el;
      }
    });
  addAttributes(customElement, attributes);
  return customElement;
};

// Añadir un objeto de atributos a un elemento
const addAttributes = (element, attrObj) => {
  for (let attr in attrObj) {
    if (attrObj.hasOwnProperty(attr)) element.setAttribute(attr, attrObj[attr]);
  }
};

// const imprimir modal
const printmodal = (content) => {
  const modalcontentEl = createCustomElement(
    "div",
    {
      id: "modal-content",
      class: "modal-content",
    },
    [content]
  );

  const modalContainerEl = createCustomElement(
    "div",
    {
      id: "modal-container",
      class: "modal-container",
    },
    [modalcontentEl]
  );
  //imprimir
  document.body.appendChild(modalContainerEl);

  //FUNCION DE QUITAR
  const removemodal = () => document.body.removeChild(modalContainerEl);

  modalContainerEl.addEventListener("click", (e) => {
    console.log(e.target);
    if (e.target === modalContainerEl) removemodal();
  });
};

let b = document.getElementById("delete");
b.addEventListener("click", () => {
  printmodal(`
     <div class="delete">
<img src="./images/delete.png" alt="img-delete">

     <p>¿Estas seguro que deseas eliminar el registro?</p>
         <button class="btn btn-danger" id="eliminar">Eliminar</button>

    <button  class="btn btn-light" >Cancelar</button>
    </div>
           `);
  eliminar();
});
function eliminar() {
  let eliminar = document.getElementById("eliminar");
  eliminar.addEventListener("click", () => {
    console.log(dato.dataset.codigo);
  });
}

let c = document.getElementById("editar");
c.addEventListener("click", () => {
  printmodal(`
    <div class="ingresar">
      <h1>Formulario Ingresar</h1>
      <form class="formulario" id="formedit">
       <div class="form-group">
       <label for="codigo">Codigo</label>
       <input type="text" class="form-control" id="codigo" value=${dato.dataset.codigo} >
     </div>
         <div class="form-group">
           <label for="Nombres">Nombres</label>
           <input type="text" class="form-control" id="Nombres" value=${dato.dataset.nombres}>
         </div>
         <div class="form-group">
           <label for="Apellidos">Apellidos</label>
           <input type="text" class="form-control" id="Apellidos" value=${dato.dataset.apellidos}>
         </div>
         <div class="form-group">
         <label for="Email">Correo Electronico</label>
         <input type="email" class="form-control" id="Email" value=${dato.dataset.correo}>
       </div>
         <div class="form-group">
         <label for="Foto">Foto</label>
         <input type="file" class="form-control" id="Foto">
         </div>
         <div class="form-group">
         <label for="Facultad">Facultad</label>
         <select class="form-control"  id="facultad">
         <option  value="" selected disabled hidden>-------</option>
       </select>
       </div>
         <button type="submit" class="btn btn-primary" id="editar">Aceptar</button>
         <button type="submit" class="btn btn-light">Cancelar</button>
       </form>
    </div>`);
  editar();
  mostrarfacus();
});
