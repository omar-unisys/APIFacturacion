const db = require("./db.js");

function isValidDate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }
  
  function isEmpty(value) {
    return value === '';
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
    this.Marca = red.Marca;
    this.Modelo = red.Modelo;
    this.NombreEquipo = red.NombreEquipo;
    this.DireccionIp = red.DireccionIp;
    this.TipoRed = red.TipoRed;
    this.Pais = red.Pais;
    this.Sede = red.Sede;
    this.Edificio = red.Edificio;
    this.Piso = red.Piso;
    this.Ubicacion = red.Ubicacion;
    this.TipoServicio = red.TipoServicio;
    this.DetalleServicio = red.DetalleServicio;
    this.Administrable = red.Administrable;
    this.FechaSoporte = red.FechaSoporte;
    this.SoporteDetalle = red.SoporteDetalle;
    this.FechaGarantia = red.FechaGarantia;
    this.GarantiaDetalle = red.GarantiaDetalle;
    this.FechaEoL = red.FechaEoL;
    this.EolDetalle = red.EolDetalle;
    this.VrsFirmware = red.VrsFirmware;
    this.NumPuertos = red.NumPuertos;
    this.idEstado = red.idEstado;
    this.FechaIngreso = red.FechaIngreso;
    this.FechaModificacion = red.FechaModificacion;
    this.Comentario = red.Comentario;
    this.Conectado = red.Conectado;
    this.InStock = red.InStock;
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
                Marca = ${handleUndefined('Marca', red.Marca)},
                Modelo = ${handleUndefined('Modelo', red.Modelo)},
                NombreEquipo = ${handleUndefined('NombreEquipo', red.NombreEquipo)},
                DireccionIp = ${handleUndefined('DireccionIp', red.DireccionIp)},
                TipoRed = ${handleUndefined('TipoRed', red.TipoRed)},
                Pais = ${handleUndefined('Pais', red.Pais)},
                Sede = ${handleUndefined('Sede', red.Sede)},
                Edificio = ${handleUndefined('Edificio', red.Edificio)},
                Piso = ${handleUndefined('Piso', red.Piso)},
                Ubicacion = ${handleUndefined('Ubicacion', red.Ubicacion)},
                TipoServicio = ${handleUndefined('TipoServicio', red.TipoServicio)},
                DetalleServicio = ${handleUndefined('DetalleServicio', red.DetalleServicio)},
                Administrable = IF(${red.Administrable !== undefined && red.Administrable !== null ? red.Administrable : 'NULL'} IS NOT NULL, ${red.Administrable}, Administrable),
                FechaSoporte = ${handleUndefined('FechaSoporte', red.FechaSoporte)},
                SoporteDetalle = ${handleUndefined('SoporteDetalle', red.SoporteDetalle)},
                FechaGarantia = ${handleUndefined('FechaGarantia', red.FechaGarantia)},
                GarantiaDetalle = ${handleUndefined('GarantiaDetalle', red.GarantiaDetalle)},
                FechaEoL = ${handleUndefined('FechaEoL', red.FechaEoL)},
                EolDetalle = ${handleUndefined('EolDetalle', red.EolDetalle)},
                VrsFirmware = ${handleUndefined('VrsFirmware', red.VrsFirmware)},
                NumPuertos = ${handleUndefined('NumPuertos', red.NumPuertos)},
                idEstado = ${handleUndefined('idEstado', red.idEstado)},
                FechaIngreso = ${handleUndefined('FechaIngreso', red.FechaIngreso)},
                FechaModificacion = NOW(),
                Comentario = ${handleUndefined('Comentario', red.Comentario)},  
                Conectado = IF(${red.Conectado !== undefined && red.Conectado !== null ? red.Conectado : 'NULL'} IS NOT NULL, ${red.Conectado}, Conectado),
                InStock = IF(${red.InStock !== undefined && red.InStock !== null ? red.InStock : 'NULL'} IS NOT NULL, ${red.InStock}, InStock)
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
            '${red.Marca}',
            '${red.Modelo}',
            '${red.NombreEquipo}',
            '${red.DireccionIp}',
            '${red.TipoRed}',
            '${red.Pais}',
            '${red.Sede}',
            '${red.Edificio}',
            '${red.Piso}',
            '${red.Ubicacion}',
            '${red.TipoServicio}',
            '${red.DetalleServicio}',
            ${red.Administrable},
            ${isValidDate(red.FechaSoporte) && !isEmpty(red.FechaSoporte) ? `'${red.FechaSoporte}'` : null },
            '${red.SoporteDetalle}',
            ${isValidDate(red.FechaGarantia) && !isEmpty(red.FechaGarantia) ? `'${red.FechaGarantia}'` : null },
            '${red.GarantiaDetalle}',
            ${isValidDate(red.FechaEoL) && !isEmpty(red.FechaEoL) ? `'${red.FechaEoL}'` : null },
            '${red.EolDetalle}',
            '${red.VrsFirmware}',
            '${red.NumPuertos}',
            '${red.idEstado}',
            ${isValidDate(red.FechaIngreso) && !isEmpty(red.FechaIngreso) ? `'${red.FechaIngreso}'` : null },
            NOW(),
            '${red.Comentario}',
            ${red.Conectado},
            ${red.InStock});`, (err, res) => {
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

module.exports = Red;