const botonEditar = document.getElementById("botonEditar");
const divEditar = document.getElementById("divEditar");

botonEditar.addEventListener('click', (e) => {
    e.preventDefault();
    divEditar.innerHTML = '<form method="post" action="/datos-opcionales"><label class="trazo">Edita tu descripción! </label><input type="text" name="descripcion"><button>subir</button></form>'
}, true)