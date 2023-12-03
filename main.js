document.addEventListener("DOMContentLoaded", function () {
    let nbInput = document.getElementById("nbInput");
    let saludar = document.getElementById("saludar");
    let sdOutput = document.getElementById("sdOutput");
    let dpInput = document.getElementById("dpInput");
    let deposito = document.getElementById("deposito");
    let productosList = document.getElementById("productosList");
    let buscarInput = document.getElementById("buscarInput");
    let buscarButton = document.getElementById("buscarButton");

    let nombre = "";
    let saldo = 0;

    class Producto {
        constructor(producto, precio, imagen) {
            this.producto = producto;
            this.precio = precio;
            this.imagen = imagen;
        }

        barato() {
            return this.precio <= 3.00;
        }

        mostrar() {
            const contenedor = document.createElement("div");
            contenedor.innerHTML = `
                <h3> Producto: ${this.producto}</h3>
                <img src="${this.imagen}" alt="${this.producto}" class="producto-imagen">
                <div class="precio-y-botones">
                    <p> Precio: $ ${this.precio}</p>
                    <button class="agregarButton">Agregar al Carrito</button>
                </div>
            `;
            productosList.appendChild(contenedor);

            const addButton = contenedor.querySelector(".agregarButton");
            addButton.addEventListener("click", () => agregarAlCarrito(this));
        }
    }

    let productosCP = [];
    let carrito = [];

    window.addEventListener('beforeunload', function () {
        if (carrito.length > 0) {
            guardarLocal('carrito', JSON.stringify(carrito));
        }
    });


    window.addEventListener('load', function () {
        const carritoGuardado = localStorage.getItem('carrito');
        if (carritoGuardado) {
            carrito = JSON.parse(carritoGuardado);

        }
    });

    async function cargarProductos() {
        try {
            const response = await fetch('productos.json');
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo JSON.');
            }
            const data = await response.json();

            productosCP = data.map(item => new Producto(item.producto, item.precio, item.imagen));
            mostrarProductos();
        } catch (error) {
            console.error(error);
        }
    }

    function mostrarProductos() {
        productosList.innerHTML = "";
        productosCP.forEach(producto => {
            producto.mostrar();
        });
    }

    function agregarAlCarrito(producto) {
        carrito.push(producto);
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }

    function azSaldo() {
        sdOutput.innerHTML = `Su saldo actual es: ${saldo} USD`;
    }

    buscarButton.addEventListener("click", () => {
        const buscar = buscarInput.value;
        const encontrado = productosCP.find(producto => producto.producto.toLowerCase() === buscar.toLowerCase());

        if (encontrado) {
            const mensaje = encontrado.barato() ? "barato" : "caro";
            Swal.fire(`${encontrado.producto} está disponible y es ${mensaje}💲`);
            agregarAlCarrito(encontrado);
        } else {
            Swal.fire("Producto no encontrado🚫");
        }
    });

    saludar.addEventListener("click", () => {
        nombre = nbInput.value;
        if (nombre) {
            Swal.fire({
                title: "Bienvenido!",
                text: `Hola ${nombre}, ingrese su saldo💲`,
                icon: "success"
            });
            localStorage.setItem("nombre", nombre);
        } else {
            Swal.fire({
                title: "Error",
                text: "Por favor, ingrese su nombre😁",
                icon: "error"
            });
        }
    });

    deposito.addEventListener("click", () => {
        let monto = parseFloat(dpInput.value);
        if (!isNaN(monto) && monto > 0) {
            saldo += monto;
            azSaldo();
            localStorage.setItem("saldo", saldo.toString());
            Swal.fire({
                title: "Depósito exitoso",
                text: `Su nuevo saldo es: ${saldo}💲`,
                icon: "success"
            });
        } else {
            Swal.fire({
                title: "Error",
                text: "Ingrese un monto válido para poder comprar.",
                icon: "error"
            });
        }
    });

    cargarProductos();
});
