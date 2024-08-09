const db = require("./db.js");

// constructor
const Red = function(red) {
    this.idSerial = red.id;
    this.idFilial = red.nombre;
    this.idCriticidad = red.horasasignadas;
    this.idTipoEquipo = red.horasasignadas;
    this.idPropieatarioFilial = red.horasasignadas;
    this.idFilialPago = red.horasasignadas;
    this.marca = red.horasasignadas;
    this.modelo = red.horasasignadas;
    this.nombreEquipo = red.horasasignadas;
    this.direccionIp = red.horasasignadas;
    this.tipoRed = red.horasasignadas;
    this.pais = red.horasasignadas;
    this.sede = red.horasasignadas;
    this.edificio = red.horasasignadas;
    this.piso = red.horasasignadas;
    this.ubicacion = red.horasasignadas;
    this.tipoServicio = red.horasasignadas;
    this.detalleServicio = red.horasasignadas;
    this.administrable = red.horasasignadas;
    this.fechaSoporte = red.horasasignadas;
    this.soporteDetalle = red.horasasignadas;
    this.fechaGarantia = red.horasasignadas;
    this.garantiaDetalle = red.horasasignadas;
    this.fechaEoL = red.horasasignadas;
    this.eolDetalle = red.horasasignadas;
    this.vrsFirmware = red.horasasignadas;
    this.numPuertos = red.horasasignadas;
    this.idEstado = red.horasasignadas;
    this.fechaIngreso = red.horasasignadas;
    this.fechaModificacion = red.horasasignadas;
    this.comentario = red.horasasignadas;
    this.conectado = red.horasasignadas;
    this.inStock = red.horasasignadas;
};

Red.getAll = async (req, result) => {
    try {
        db.query('SELECT * FROM tbl_inventario;', (err, res) => {
            if (err) {
                result( err.message, null);
                return;
            }
            result(null, res);
        });
    } catch (error) {
        console.error('Error al consultar: ', error);
        result(error, null);
    }
};


Red.getAllFilter = async (req, result) => {
    try {
        db.query('SELECT * FROM tbl_inventario;', (err, res) => {
            if (err) {
                result( err.message, null);
                return;
            }
            result(null, res);
        });
    } catch (error) {
        console.error('Error al consultar: ', error);
        result(error, null);
    }
};


module.exports = Red;