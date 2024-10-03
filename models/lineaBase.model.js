const db = require("./db.js");


// constructor
const LB = function(lb) {
    this.Filial = lb.idSerial;
    this.Dispositivo = lb.idFilial;
    this.Criticidad = lb.idCriticidad;
    this.Cantidad = lb.idTipoEquipo;   
};

LB.create = async (lb, result) => {
    try {
        const query = `INSERT INTO bd_facturacion.tbl_lineabase
            (Filial, Dispositivo, Criticidad, Cantidad)
            VALUES (?, ?, ?, ?)`;
        
        const values = [lb.Filial, lb.Dispositivo, lb.Criticidad, lb.Cantidad];

        db.query(query, values, (err, res) => {
            if (err) {
                result(err.message, null);
                return;
            }

            result(null, { ...lb });
        });
    } catch (error) {
        console.error('Error al crear la Linea Base:', error);
        result(error, null);
    }
};

LB.getLB = async (req, result) => {
    try {
        db.query('SELECT * FROM tbl_lineabase;', (err, res) => {
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

module.exports = LB;