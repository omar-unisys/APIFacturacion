const db = require("./db.js");


// constructor
const Tarifario = function(tarifario) {
    this.TipoDispositivo = tarifario.TipoDispositivo;
    this.Criticidad = tarifario.Criticidad;
    this.ValorUnitario = tarifario.ValorUnitario;
    this.SLA = tarifario.SLA;   
    this.CantidadBaseContrato = tarifario.CantidadBaseContrato;
};

Tarifario.create = async (tarifario, result) => {
    try {
        const query = `INSERT INTO bd_facturacion.tbl_tarifario
            (TipoDispositivo, Criticidad, ValorUnitario, SLA,CantidadBaseContrato)
            VALUES (?, ?, ?, ?, ?)`;
        
        const values = [tarifario.TipoDispositivo, tarifario.Criticidad, tarifario.ValorUnitario, tarifario.SLA, tarifario.CantidadBaseContrato];

        db.query(query, values, (err, res) => {
            if (err) {
                result(err.message, null);
                return;
            }

            result(null, { ...tarifario });
        });
    } catch (error) {
        console.error('Error al crear la Linea Base:', error);
        result(error, null);
    }
};

Tarifario.getTarifario = async (req, result) => {
    try {
        db.query('SELECT * FROM tbl_tarifario;', (err, res) => {
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

Tarifario.getValorUnitario = async (tipoEquipo, criticidad, result) => {
    try {
        const query = `
            SELECT ValorUnitario
            FROM tbl_tarifario
            WHERE TipoDispositivo = ? AND Criticidad = ?
            LIMIT 1`;

        db.query(query, [tipoEquipo, criticidad], (err, res) => {
            if (err) {
                result(err.message, null);
                return;
            }

            result(null, res.length > 0 ? res[0].ValorUnitario : -0.001);
        });
    } catch (error) {
        console.error('Error al obtener el valor unitario:', error);
        result(error, null);
    }
};


module.exports = Tarifario;