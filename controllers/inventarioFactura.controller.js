const InventarioFactura = require("../models/inventarioFactura.model.js");

exports.getInventarioFactura = (req, res) => {
    const title = req.query.title; // Si necesitas algún filtro
  
    InventarioFactura.getAll(title, (err, data) => {
        if (err) {
            res.status(500).send({
                message:
                    err.message || "Ha ocurrido un error mientras retornaba la información."
            });
        } else {
            res.send(data);
        }
    });
};

// Función en el controlador para actualizar ValorUnitarioUSD en tbl_facturasinventariored
exports.actualizarValorUnitario = (req, res) => {
    console.log('estoy en el controlador de la API valor unitario');
    InventarioFactura.updateValorUnitarioUSD((err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Ha ocurrido un error durante la actualización de los datos."
            });
        } else {
            res.send(data);
        }
    });
};

