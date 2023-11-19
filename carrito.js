document.addEventListener("DOMContentLoaded", async function () {
    let carritoList = document.getElementById("carritoList");
    let comprarButton = document.getElementById("comprarButton");

    let carrito = [];

    async function cgCarrito() {
        try {
            carrito = JSON.parse(localStorage.getItem("carrito")) || [];
            mtCarrito();
        } catch (error) {
            console.error(error);
        }
    }

    async function iniciar() {
        await cgCarrito();

        comprarButton.addEventListener("click", () => {
            if (carrito.length === 0) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "agrega algo al carrito para poder comprar😁",                
                  });
                return;
            }

            const swalForPurchase = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: "btn btn-danger"
                },
                buttonsStyling: false
            });

            swalForPurchase.fire({
                title: "¿Estás seguro de realizar la compra?",
                text: "No podrás revertir esto.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, realizar la compra",
                cancelButtonText: "No, cancelar",
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    swalForPurchase.fire({
                        title: "¡Compra realizada!",
                        text: "Tu compra ha sido confirmada.",
                        icon: "success"
                    });
                    carrito = [];
                    localStorage.setItem("carrito", JSON.stringify(carrito));
                    mtCarrito();
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalForPurchase.fire({
                        title: "Compra cancelada",
                        text: "Tu compra ha sido cancelada.",
                        icon: "error"
                    });
                }
            });
        });
    }

    function mtCarrito() {
        carritoList.innerHTML = "";
        carrito.forEach((producto, index) => {
            const contenedor = document.createElement("div");
            contenedor.innerHTML = `
                <h3> Producto: ${producto.producto}</h3>
                <div class="imagen-precio-y-botones">
                    <img src="${producto.imagen}" alt="${producto.producto}" class="producto-imagen">
                    <div class="precio-y-botones">
                        <p> Precio: $ ${producto.precio}</p>
                        <button class="eliminarButton" data-index="${index}">Eliminar</button>
                    </div>
                </div>
            `;
            carritoList.appendChild(contenedor);
        });
        const eliminarButtons = document.querySelectorAll(".eliminarButton");
        eliminarButtons.forEach(button => {
            button.addEventListener("click", (event) => chauCarrito(event));
        });
    }

    function chauCarrito(event) {
        const index = event.target.dataset.index;
        carrito.splice(index, 1);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mtCarrito();
    }

    iniciar();
});
