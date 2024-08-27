const db = require("./db.js");

  function isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  }
  
  function isEmpty(value) {
    return value === undefined || value === null || value === '';
  }

  const handleUndefined = (field, value) => {
    // Verifica si el valor es undefined, null o vacío y construye la condición SQL con IF
    return `IF(${value !== undefined && value !== null && value !== '' ? `'${value}'` : `''`} <> '', ${value !== undefined && value !== null && value !== '' ? `'${value}'` : field}, ${field})`;
};

// constructor
const Red = function(red) {
    this.idSerial = red.idSerial;
    this.idFilial = red.idFilial;
    this.idCriticidad = red.idCriticidad;
    this.idTipoEquipo = red.idTipoEquipo;
    this.idPropietarioFilial = red.idPropietarioFilial;
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
        db.query('SELECT * FROM tbl_inventarioRed;', (err, res) => {
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
        db.query(`select * from bd_facturacion.tbl_inventarioRed WHERE idSerial = '${id}';`, (err, res) => {
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
        db.query(`UPDATE bd_facturacion.tbl_inventarioRed
            SET
                idFilial = ${handleUndefined('idFilial', red.idFilial)},
                idCriticidad = ${handleUndefined('idCriticidad', red.idCriticidad)},
                idTipoEquipo = ${handleUndefined('idTipoEquipo', red.idTipoEquipo)},
                idPropietarioFilial = ${handleUndefined('idPropietarioFilial', red.idPropietarioFilial)},
                idFilialPago = ${handleUndefined('idFilialPago', red.idFilialPago)},
                Marca = ${handleUndefined('Marca', red.marca)},
                Modelo = ${handleUndefined('Modelo', red.modelo)},
                NombreEquipo = ${handleUndefined('NombreEquipo', red.nombreEquipo)},
                DireccionIp = ${handleUndefined('DireccionIp', red.direccionIp)},
                TipoRed = ${handleUndefined('TipoRed', red.tipoRed)},
                Pais = ${handleUndefined('Pais', red.pais)},
                Sede = ${handleUndefined('Sede', red.sede)},
                Edificio = ${handleUndefined('Edificio', red.edificio)},
                Piso = ${handleUndefined('Piso', red.piso)},
                Ubicacion = ${handleUndefined('Ubicacion', red.ubicacion)},
                TipoServicio = ${handleUndefined('TipoServicio', red.tipoServicio)},
                DetalleServicio = ${handleUndefined('DetalleServicio', red.detalleServicio)},
                Administrable = IF(${red.administrable !== undefined && red.administrable !== null ? red.administrable : 'NULL'} IS NOT NULL, ${red.administrable}, Administrable),
                FechaSoporte = ${handleUndefined('FechaSoporte', red.fechaSoporte)},
                SoporteDetalle = ${handleUndefined('SoporteDetalle', red.soporteDetalle)},
                FechaGarantia = ${handleUndefined('FechaGarantia', red.fechaGarantia)},
                GarantiaDetalle = ${handleUndefined('GarantiaDetalle', red.garantiaDetalle)},
                FechaEoL = ${handleUndefined('FechaEoL', red.fechaEoL)},
                EolDetalle = ${handleUndefined('EolDetalle', red.eolDetalle)},
                VrsFirmware = ${handleUndefined('VrsFirmware', red.vrsFirmware)},
                NumPuertos = ${handleUndefined('NumPuertos', red.numPuertos)},
                idEstado = ${handleUndefined('idEstado', red.idEstado)},
                FechaIngreso = ${handleUndefined('FechaIngreso', red.fechaIngreso)},
                FechaModificacion = NOW(),
                Comentario = ${handleUndefined('Comentario', red.comentario)},  
                Conectado = IF(${red.conectado !== undefined && red.conectado !== null ? red.conectado : 'NULL'} IS NOT NULL, ${red.conectado}, Conectado),
                InStock = IF(${red.inStock !== undefined && red.inStock !== null ? red.inStock : 'NULL'} IS NOT NULL, ${red.inStock}, InStock)
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

        db.query(`INSERT INTO bd_facturacion.tbl_inventarioRed
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
            '${red.idPropietarioFilial}',
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
    } catch (error) {
        console.error('Error al crear la inventario de Red:', error);
        result(error, null);
    }
};

Red.delete = async (id, result) => {

    try {
        db.query(`DELETE FROM bd_facturacion.tbl_inventarioRed WHERE idSerial='${id}'`, (err, res) => {
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

Red.createHistorico = async (historico, result) => {

    try {
        db.query(`INSERT INTO bd_facturacion.tbl_historicored
            (idSerial,
            FechaHora,
            Observaciones,
            CriticidadPrevia,
            CriticidadNueva,
            TipoHistorico)
            VALUES
            ('${historico.idSerial}',
            NOW(),
            '${historico.observaciones !== undefined && historico.observaciones !== null ? historico.observaciones : 'NULL'}',
            '${historico.criticidadPrevia !== undefined && historico.criticidadPrevia !== null ? historico.criticidadPrevia : 'NULL'}',
            '${historico.criticidadNueva !== undefined && historico.criticidadNueva !== null ? historico.criticidadNueva : 'NULL'}',
            '${historico.tipoHistorico !== undefined && historico.tipoHistorico !== null ? historico.tipoHistorico : 'NULL'}'
            );`, (err, res) => {
            if (err) {
                result( err.message, null);
                return;
            }

            result(null, { ...historico });
        });
    } catch (error) {
        console.error('Error al crear el historico inventario de Red:', error);
        result(error, null);
    }
};

Red.findAllxTipoHistorico = async (tipoHistorico, result) => {

    try {
        db.query(`select i.*, h.tipohistorico, h.FechaHora, h.CriticidadNueva, h.CriticidadPrevia, h.Observaciones 
            from tbl_inventariored as i inner join tbl_historicored as h on i.idSerial = h.idSerial  WHERE h.tipohistorico = '${tipoHistorico}';`, (err, res) => {
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

Red.findByIdxHistorico = async (id, result) => {

    try {
        db.query(`select i.*, h.tipohistorico, h.FechaHora, h.CriticidadNueva, h.CriticidadPrevia, h.Observaciones 
            from tbl_inventariored as i inner join tbl_historicored as h on i.idSerial = h.idSerial  WHERE i.idSerial = '${id}';`, (err, res) => {
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



Red.upsert = async (inventoryData, callback) => {
  
   // Estructura del query
   const query = `
   INSERT INTO tbl_inventario (
     idSerial, idFilial, idCriticidad, idTipoEquipo, idPropietarioFilial, idFilialPago, Marca,
     Modelo, NombreEquipo, DireccionIp, TipoRed, Pais, Sede, Edificio, Piso, Ubicacion,
     TipoServicio, DetalleServicio, Administrable, FechaSoporte, SoporteDetalle, FechaGarantia,
     GarantiaDetalle, FechaEoL, EolDetalle, VrsFirmware, NumPuertos, idEstado, FechaIngreso,
     FechaModificacion, Comentario, Conectado, InStock
   ) VALUES ?
   ON DUPLICATE KEY UPDATE 
     idFilial = VALUES(idFilial),
     idCriticidad = VALUES(idCriticidad),
     idTipoEquipo = VALUES(idTipoEquipo),
     idPropietarioFilial = VALUES(idPropietarioFilial),
     idFilialPago = VALUES(idFilialPago),
     Marca = VALUES(Marca),
     Modelo = VALUES(Modelo),
     NombreEquipo = VALUES(NombreEquipo),
     DireccionIp = VALUES(DireccionIp),
     TipoRed = VALUES(TipoRed),
     Pais = VALUES(Pais),
     Sede = VALUES(Sede),
     Edificio = VALUES(Edificio),
     Piso = VALUES(Piso),
     Ubicacion = VALUES(Ubicacion),
     TipoServicio = VALUES(TipoServicio),
     DetalleServicio = VALUES(DetalleServicio),
     Administrable = VALUES(Administrable),
     FechaSoporte = VALUES(FechaSoporte),
     SoporteDetalle = VALUES(SoporteDetalle),
     FechaGarantia = VALUES(FechaGarantia),
     GarantiaDetalle = VALUES(GarantiaDetalle),
     FechaEoL = VALUES(FechaEoL),
     EolDetalle = VALUES(EolDetalle),
     VrsFirmware = VALUES(VrsFirmware),
     NumPuertos = VALUES(NumPuertos),
     idEstado = VALUES(idEstado),
     FechaIngreso = VALUES(FechaIngreso),
     FechaModificacion = VALUES(FechaModificacion),
     Comentario = VALUES(Comentario),
     Conectado = VALUES(Conectado),
     InStock = VALUES(InStock);
 `;
console.log(query);
console.log(inventoryData);
// Verifica si inventoryData es un array, si no, lo convierte en uno
if (!Array.isArray(inventoryData)) {
    inventoryData = [inventoryData];
  }
  console.log(inventoryData);
// Crear el array de valores a insertar
const values = inventoryData.map(item => [
  item.idSerial, item.idFilial, item.idCriticidad, item.idTipoEquipo, item.idPropietarioFilial,
  item.idFilialPago, item.Marca, item.Modelo, item.NombreEquipo, item.DireccionIp, item.TipoRed,
  item.Pais, item.Sede, item.Edificio, item.Piso, item.Ubicacion, item.TipoServicio, item.DetalleServicio,
  item.Administrable, 
  isValidDate(item.FechaSoporte) && !isEmpty(item.FechaSoporte) ? item.FechaSoporte : null,  
  item.SoporteDetalle, 
  isValidDate(item.FechaGarantia) && !isEmpty(item.FechaGarantia) ? item.FechaGarantia : null,
  item.GarantiaDetalle,
  isValidDate(item.FechaEoL) && !isEmpty(item.FechaEoL) ? item.FechaEoL : null, 
  item.EolDetalle, item.VrsFirmware, item.NumPuertos, item.idEstado, 
  isValidDate(item.FechaIngreso) && !isEmpty(item.FechaIngreso) ? item.FechaIngreso : null,
  new Date(), 
  item.Comentario, item.Conectado, item.InStock
]);

console.log(values);
    // Ejecutar la consulta
    db.query(query, [values], function(err, results) {
        if (err) {
          console.error('Error al hacer insert masivo:', err);
          return callback(err, null);  // Devuelve el error a través del callback
        }
        console.log('Upsert completado, filas afectadas:', results.affectedRows);
        return callback(null, results);  // Devuelve los resultados a través del callback
      });
};



module.exports = Red;