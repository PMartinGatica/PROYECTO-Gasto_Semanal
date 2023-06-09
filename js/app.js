//variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

//Eventos
eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded',preguntarPresupuesto)

    formulario.addEventListener('submit', agregarGasto);
}

//Classes

class Presupuesto{
 constructor(presupuesto){
    this.presupuesto = Number (presupuesto);
    this.restante = Number(presupuesto);
    this.gastos =[];
}
    nuevoGasto(gasto){
        this.gastos =[...this.gastos,gasto];
        this.calcularRestante();
        console.log(this.gastos);
    }

    calcularRestante(){
        const gastado = this.gastos.reduce((total,gasto)=>total + gasto.cantidad,0)
        this.restante = this.presupuesto - gastado;

    }
    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto =>gasto.id !==id); 
        this.calcularRestante();
    }
}

class UI{
    insertarPresupuesto(cantidad){

        //Extraer valores
        const{presupuesto,restante} =cantidad;

        //Agregarlos al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }
    imprimirAlerta(mensaje,tipo){
        // crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success');
        }

        //Mensaje de error
        divMensaje.textContent = mensaje;

        //insertar en HTML

        document.querySelector('.primario').insertBefore(divMensaje,formulario);

        //Quitar HTML

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
        
    }

    mostrarGastos(gastos){

        this.limpiarHTML();
        //iterar sobre los gastos
        gastos.forEach(gasto => {
            const {cantidad,nombre,id} = gasto;
        //crear LI
        const nuevoGasto = document.createElement('li');
        nuevoGasto.className='list-group-item d-flex justify-content-between align-items-center';
        nuevoGasto.dataset.id = id;
        console.log(nuevoGasto);
        //Agregar el HTML del gasto 
        nuevoGasto.innerHTML = `${nombre}<span class ="badge badge-primary badge-pill">$ ${cantidad}</span>`;
        //Boton para borrrar el gasto
        const btnBorrar = document.createElement('button');
        btnBorrar.classList.add('btn','btn-danger','btn-gasto');
        btnBorrar.innerHTML='Borrar &times;'
        btnBorrar.onclick = () => {
            eliminarGasto(id)
        }
        nuevoGasto.appendChild(btnBorrar);
        //Agregar al HTML 
        gastoListado.appendChild(nuevoGasto);
        });
               
  }

  limpiarHTML(){
    while(gastoListado.firstChild){
        gastoListado.removeChild(gastoListado.firstChild);
    }
  }

  actualizarRestante(restante){
    document.querySelector('#restante').textContent = restante;
  }
  comprobarPresupuesto(presupuestoObj){
    const {presupuesto,restante}=presupuestoObj;
    const restanteDiv = document.querySelector('.restante');
    //Comprobar 25%
    if((presupuesto/4) > restante){
        restanteDiv.classList.remove('alert-success' , 'alert-warning');
        restanteDiv.classList.add('alert-danger');
    }else if ((presupuesto / 2) > restante){
        restanteDiv.classList.remove('alert-success');
        restanteDiv.classList.add('alert-warning');
    }else{
        restanteDiv.classList.remove('alert-danger','alert-warning');
        restanteDiv.classList.add('alert-success');
       
    }

    //Si el total es 0 o menor
    if (restante <= 0) {
        ui.imprimirAlerta('El presupuesto se agotó', 'error');
        formulario.querySelector('button[type="submit"]').disabled = true;
    } else {
        formulario.querySelector('button[type="submit"]').disabled = false;
    }
  }

}
//instanciar

const ui = new UI();
let presupuesto;

//Funciones
function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?');
    //console.log(presupuestoUsuario);

 if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
    window.location.reload();
 }
 // presupuesto valido
 presupuesto = new Presupuesto(presupuestoUsuario);
 console.log(presupuesto);

 ui.insertarPresupuesto(presupuesto);
}

//Añade gastos
function agregarGasto(e){
    e.preventDefault();

    //Leer los datos del formulario

    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number( document.querySelector('#cantidad').value);
    
    //validar  
    
    if (nombre === '' || cantidad === ''){
        ui.imprimirAlerta('Ambos campos son obligatorios','error')
        return;
        }else if(cantidad <=0 || isNaN(cantidad)){
            ui.imprimirAlerta('Cantidad no valida', 'error');

            return;
        }
            //Generar un objeto con el gasto
       
            //console.log('Agregando gasto')
        const gasto ={nombre,cantidad, id:Date.now()}
        presupuesto.nuevoGasto(gasto);
        
        //Mensaje OK
        ui.imprimirAlerta('Gasto agregado correctamente');
        
        //Imprimir gastos 
        const {gastos,restante} = presupuesto
        ui.mostrarGastos(gastos);
        ui.actualizarRestante(restante); 
        ui.comprobarPresupuesto(presupuesto);  
        //reinicio el formulario
        formulario.reset();
}

function eliminarGasto(id){
    //Los elimina desde el objeto
    presupuesto.eliminarGasto(id);

    //Elimina gastos del HTML
    const {gastos,restante} = presupuesto;
    ui.mostrarGastos(gastos)
    ui.actualizarRestante(restante); 
    ui.comprobarPresupuesto(presupuesto); 
}
