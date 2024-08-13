const db = require("./db.js");

function isValidDate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }
  
  function isEmpty(value) {
    return value === '';
  }

// constructor
const Red = function(red) {
    this.idSerial = red.idSerial;
    this.idFilial = red.idFilial;
    this.idCriticidad = red.idCriticidad;
    this.idTipoEquipo = red.idTipoEquipo;
    this.idPropieatarioFilial = red.idPropieatarioFilial;
    this.idFilialPago = red.idFilialPago;
    this.marca = red.marca;
    this.modelo = red.modelo;
    this.nombreEquipo = red.nombreEquipo;
    this.direccionIp = red.direccionIp;
    this.tipoRed = red.tipoRed;
    this.pais = red.pais;
    this.sede = red.sede;
    this.edificio = red.edificio;
    this.piso = red.piso;
    this.ubicacion = red.ubicacion;
    this.tipoServicio = red.tipoServicio;
    this.detalleServicio = red.detalleServicio;
    this.administrable = red.administrable;
    this.fechaSoporte = red.fechaSoporte;
    this.soporteDetalle = red.soporteDetalle;
    this.fechaGarantia = red.fechaGarantia;
    this.garantiaDetalle = red.garantiaDetalle;
    this.fechaEoL = red.fechaEoL;
    this.eolDetalle = red.eolDetalle;
    this.vrsFirmware = red.vrsFirmware;
    this.numPuertos = red.numPuertos;
    this.idEstado = red.idEstado;
    this.fechaIngreso = red.fechaIngreso;
    this.fechaModificacion = red.fechaModificacion;
    this.comentario = red.comentario;
    this.conectado = red.conectado;
    this.inStock = red.inStock;
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


Red.findById = async (id, result) => {

    try {
        db.query(`select * from bd_facturacion.tbl_inventario WHERE idSerial = '${id}';`, (err, res) => {
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

Red.updateById = async (id, red, result) => {

    try {
        db.query(`UPDATE bd_facturacion.tbl_inventario
  SET
    idFilial = '${red.idFilial}',
    idCriticidad = '${red.idCriticidad}',
    idTipoEquipo = '${red.idTipoEquipo}',
    idPropietarioFilial = '${red.idPropieatarioFilial}',
    idFilialPago = '${red.idFilialPago}',
    Marca = '${red.marca}',
    Modelo = '${red.modelo}',
    NombreEquipo = '${red.nombreEquipo}',
    DireccionIp = '${red.direccionIp}',
    TipoRed = '${red.tipoRed}',
    Pais = '${red.pais}',
    Sede = '${red.sede}',
    Edificio = '${red.edificio}',
    Piso = '${red.piso}',
    Ubicacion = '${red.ubicacion}',
    TipoServicio = '${red.tipoServicio}',
    DetalleServicio = '${red.detalleServicio}',
    Administrable = ${red.administrable},
    FechaSoporte = ${isValidDate(red.fechaSoporte) && !isEmpty(red.fechaSoporte) ? `'${red.fechaSoporte}'` : null },
    SoporteDetalle = '${red.soporteDetalle}',
    FechaGarantia = ${isValidDate(red.fechaGarantia) && !isEmpty(red.fechaGarantia) ? `'${red.fechaGarantia}'` : null },
    GarantiaDetalle = '${red.garantiaDetalle}',
    FechaEoL = ${isValidDate(red.fechaEoL) && !isEmpty(red.fechaEoL) ? `'${red.fechaEoL}'` : null },
    EolDetalle = '${red.eolDetalle}',
    VrsFirmware = '${red.vrsFirmware}',
    NumPuertos = '${red.numPuertos}',
    idEstado = '${red.idEstado}',
    FechaIngreso = ${isValidDate(red.fechaIngreso) && !isEmpty(red.fechaIngreso) ? `'${red.fechaIngreso}'` : null },
    FechaModificacion = NOW(),
    Comentario = '${red.comentario}',
    Conectado = ${red.conectado},
    InStock = ${red.inStock}
  WHERE idSerial = '${red.idSerial}';`, (err, res) => {
            if (err) {
                result( err.message, null);
                return;
            }
            
            if (res.affectedRows == 0) {
                // not found
                result({ kind: "not_found" }, null);
                return;
            }

            result(null, { ...red });
        });
    } catch (error) {
        console.error('Error al consultar inventario de Red:', error);
        result(error, null);
    }
};

Red.create = async (red, result) => {

    try {

        db.query(`INSERT INTO bd_facturacion.tbl_inventario
(idSerial,
idFilial,
idCriticidad,
idTipoEquipo,
idPropietarioFilial,
idFilialPago,
Marca,
Modelo,
NombreEquipo,
DireccionIp,
TipoRed,
Pais,
Sede,
Edificio,
Piso,
Ubicacion,
TipoServicio,
DetalleServicio,
Administrable,
FechaSoporte,
SoporteDetalle,
FechaGarantia,
GarantiaDetalle,
FechaEoL,
EolDetalle,
VrsFirmware,
NumPuertos,
idEstado,
FechaIngreso,
FechaModificacion,
Comentario,
Conectado,
InStock)
VALUES
('${red.idSerial}',
'${red.idFilial}',
'${red.idCriticidad}',
'${red.idTipoEquipo}',
'${red.idPropieatarioFilial}',
'${red.idFilialPago}',
'${red.marca}',
'${red.modelo}',
'${red.nombreEquipo}',
'${red.direccionIp}',
'${red.tipoRed}',
'${red.pais}',
'${red.sede}',
'${red.edificio}',
'${red.piso}',
'${red.ubicacion}',
'${red.tipoServicio}',
'${red.detalleServicio}',
${red.administrable},
${isValidDate(red.fechaSoporte) && !isEmpty(red.fechaSoporte) ? `'${red.fechaSoporte}'` : null },
'${red.soporteDetalle}',
${isValidDate(red.fechaGarantia) && !isEmpty(red.fechaGarantia) ? `'${red.fechaGarantia}'` : null },
'${red.garantiaDetalle}',
${isValidDate(red.fechaEoL) && !isEmpty(red.fechaEoL) ? `'${red.fechaEoL}'` : null },
'${red.eolDetalle}',
'${red.vrsFirmware}',
'${red.numPuertos}',
'${red.idEstado}',
${isValidDate(red.fechaIngreso) && !isEmpty(red.fechaIngreso) ? `'${red.fechaIngreso}'` : null },
NOW(),
'${red.comentario}',
${red.conectado},
${red.inStock});`, (err, res) => {
            if (err) {
                result( err.message, null);
                return;
            }

            result(null, { ...red });
        });

        // result(null, { ...empresa });
    } catch (error) {
        console.error('Error al crear la inventario de Red:', error);
        result(error, null);
    }
};

Red.delete = async (id, result) => {

    try {
        db.query(`DELETE FROM bd_facturacion.tbl_inventario WHERE idSerial='${id}'`, (err, res) => {
            if (err) {
                result( err.message, null);
                return;
            }

            if (res.affectedRows == 0) {
                // not found
                result({ kind: "not_found" }, null);
                return;
            }

            result(null, { id: id });
        });
        
    } catch (error) {
        console.error('Error al eliminar inventario de Red:', error);
        result(error, null);
    }
};



module.exports = Red;