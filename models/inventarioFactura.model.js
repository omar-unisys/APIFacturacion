const sql = require("./db.js"); // importar la conexión a la base de datos

const InventarioFactura = function(data) {
    this.idFilialPago = data.idFilialPago;
    this.Sede = data.Sede;
    this.Ubicacion = data.Ubicacion;
    this.CriticidadActual = data.CriticidadActual;
    this.NumeroElementos = data.NumeroElementos;
};

InventarioFactura.getAll = (title, result) => {
    let query = `
        SELECT 
            inv.idFilialPago,
            inv.Sede,
            inv.Ubicacion,
            inv.idCriticidad,
            fact.CriticidadActual,
            fact.FechaModificacionIngreso,
            inv.idTipoEquipo,
            inv.Modelo,
            inv.Marca,
            inv.TipoRed,
            inv.DetalleServicio,
            fact.Observaciones,
            inv.NombreEquipo,
            inv.DireccionIp,
            inv.idSerial,
            inv.InStock,
            inv.idPropietarioFilial,
            fact.EstadisticasAtencionSitio,
            inv.Pais,
            fact.QueSalen,
            fact.NumeroElementos,
            fact.TipoCriticidad,
            fact.TipoPrecio,
            fact.ValorUnitarioUSD,
            fact.DisponibilidadRealCliente,
            fact.ANSComprometido,
            fact.ANSCumplido,
            fact.DescuentoRecargoVolumen,
            fact.DescuentoANS,
            fact.TotalFacturarUSD
        FROM 
            tbl_inventariored inv
        LEFT JOIN 
            tbl_facturasinventariored fact
        ON 
            inv.idSerial = fact.NroSerial
    `;

    // Puedes agregar condiciones adicionales si es necesario
    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, res);
    });
};

module.exports = InventarioFactura;
