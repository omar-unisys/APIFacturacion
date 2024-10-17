const db = require("./db.js"); // importar la conexión a la base de datos

const InventarioFactura = function(data) {
    this.Filial = data.Filial;
    this.Sede = data.Sede;
    this.UbicacionFisicaEquipo = data.UbicacionFisicaEquipo;
    this.CriticidadPrevia = data.CriticidadPrevia;
    this.CriticidadActual = data.CriticidadActual;
    this.FechaModificacionIngreso = data.FechaModificacionIngreso;
    this.TipoEquipo = data.TipoEquipo;
    this.Modelo = data.Modelo;
    this.Fabricante = data.Fabricante;
    this.TipoRed = data.TipoRed;
    this.DetalleServicio = data.DetalleServicio;
    this.Observaciones = data.Observaciones;
    this.NombreEquipo = data.NombreEquipo;
    this.IPEquipo = data.IPEquipo;
    this.NroSerial = data.NroSerial;
    this.ActivoInactivo = data.ActivoInactivo;
    this.EmpresaPropietariaEquipo = data.EmpresaPropietariaEquipo;
    this.EstadisticasAtencionSitio = data.EstadisticasAtencionSitio;
    this.Pais = data.Pais;
    this.QueSalen = data.QueSalen;
    this.NumeroElementos = data.NumeroElementos;
    this.TipoCriticidad = data.TipoCriticidad;
    this.TipoPrecio = data.TipoPrecio;
    this.ValorUnitarioUSD = data.ValorUnitarioUSD;
    this.DisponibilidadRealCliente = data.DisponibilidadRealCliente;
    this.ANSComprometido = data.ANSComprometido;
    this.ANSCumplido = data.ANSCumplido;
    this.DescuentoRecargoVolumen = data.DescuentoRecargoVolumen;
    this.DescuentoANS = data.DescuentoANS;
    this.TotalFacturarUSD = data.TotalFacturarUSD;
};

InventarioFactura.getAll = (title, result) => {
    let query = `SELECT * FROM tbl_facturasinventariored ;`;

    // Puedes agregar condiciones adicionales si es necesario
    db.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, res);
    });
};

InventarioFactura.DescuentoxSLAIndisponibilidad = {

};

InventarioFactura.DescuentoxVolumen = (result) => {
    // Definimos los tipos de dispositivos que vamos a manejar
    const deviceTypes = ['Router', 'Switche', 'Comunicaciones'];

    const queries = deviceTypes.map(device => {
        return new Promise((resolve, reject) => {
            // Paso 1: Sumar los dispositivos en la tabla tbl_lineabase para el tipo de dispositivo
            const query1 = `
                SELECT SUM(Cantidad) AS totalLineaBase
                FROM tbl_lineabase
                WHERE Dispositivo = ?;`;

            db.query(query1, [device], (err, res1) => {
                if (err) {
                    return reject(err);
                }
                const totalLineaBase = res1[0].totalLineaBase;

                // Paso 2: Sumar los dispositivos en la tabla tbl_inventariored para el tipo de dispositivo
                const query2 = `
                    SELECT COUNT(*) AS totalInventario
                    FROM tbl_inventariored
                    WHERE idTipoEquipo = ?;`;

                db.query(query2, [device], (err, res2) => {
                    if (err) {
                        return reject(err);
                    }
                    const totalInventario = res2[0].totalInventario;

                    // Paso 3: Calcular la diferencia
                    const diferencia = totalInventario - totalLineaBase;

                    // Paso 4: Calcular la variación
                    const variacion = totalLineaBase !== 0 ? (diferencia / totalLineaBase) * 100 : 0;

                    // Paso 5: Consultar el descuento
                    const query3 = `
                        SELECT Descuento
                        FROM tbl_rangosfluctuacion
                        WHERE vigencia <= LAST_DAY(CURRENT_DATE())
                        AND tipoEquipo = ?
                        AND variacion < ? 
                        ORDER BY variacion DESC
                        LIMIT 1;`;

                    db.query(query3, [device, variacion], (err, res3) => {
                        if (err) {
                            return reject(err);
                        }
                        const descuento = res3.length > 0 ? res3[0].Descuento : null; // Si no hay descuento, retorna null

                        if (descuento !== null) {
                            // Paso 6: Actualizar los registros en la tabla tbl_facturasinventariored si el descuento ha cambiado
                            const updateQuery = `
                                UPDATE tbl_facturasinventariored
                                SET DescuentoRecargoVolumen = ?
                                WHERE TipoEquipo = ?
                                AND (DescuentoRecargoVolumen IS NULL OR DescuentoRecargoVolumen != ?);`;

                            db.query(updateQuery, [descuento, device, descuento], (err, resUpdate) => {
                                if (err) {
                                    return reject(err);
                                }
                                resolve({
                                    device,
                                    totalLineaBase,
                                    totalInventario,
                                    diferencia,
                                    variacion,
                                    descuento,
                                    updatedRows: resUpdate.affectedRows // Número de filas actualizadas
                                });
                            });
                        } else {
                            // Si no hay descuento, resolver con los resultados obtenidos
                            resolve({
                                device,
                                totalLineaBase,
                                totalInventario,
                                diferencia,
                                variacion,
                                descuento: null,
                                updatedRows: 0
                            });
                        }
                    });
                });
            });
        });
    });

    // Ejecutar todas las promesas
    Promise.all(queries)
        .then(results => {
            result(null, results);
        })
        .catch(err => {
            result(err, null);
        });
};

InventarioFactura.updateValorUnitarioUSD = async (result) => {
    console.log('Actualizando TotalFacturarUSD en el modelo de la API');

    const deviceTypes = ['Router', 'Switche', 'Comunicaciones'];
    const criticidades = ['Muy Alta', 'Alta', 'Media', 'Baja', 'Muy Alta-REP', 'Alta-REP', 'Media-REP', 'Baja-REP'];

    // Almacenar las promesas de las actualizaciones
    const promises = [];

    for (const device of deviceTypes) {
        for (const criticidad of criticidades) {
            const queryFacturas = `
                SELECT f.NroSerial, f.ValorUnitarioUSD, f.DescuentoANS, f.DescuentoRecargoVolumen
                FROM tbl_facturasinventariored f
                WHERE f.TipoEquipo = ? AND f.CriticidadPrevia = ?
                AND (f.ValorUnitarioUSD IS NULL OR
                     f.DescuentoANS IS NULL OR 
                     f.DescuentoRecargoVolumen IS NULL OR 
                     f.TotalFacturarUSD IS NULL)
            `;

            const resFacturas = await new Promise((resolve, reject) => {
                db.query(queryFacturas, [device, criticidad], (err, resFacturas) => {
                    if (err) {
                        console.log("Error consultando tbl_facturasinventariored: ", err);
                        return reject(err);
                    }
                    resolve(resFacturas);
                });
            });

            // Iterar sobre los registros obtenidos
            for (const factura of resFacturas) {
                // Convertir valores a números, 0 si son null o undefined
                const valorUnitarioFactura = parseFloat(factura.ValorUnitarioUSD) || 0;
                const descuentoANS = parseFloat(factura.DescuentoANS) || 0;
                const descuentoRecargoVolumen = parseFloat(factura.DescuentoRecargoVolumen) || 0;
            
                // Realizar el cálculo de TotalFacturarUSD
                let totalFacturarUSD = valorUnitarioFactura * (1 - descuentoANS) * (1 + descuentoRecargoVolumen);
            
                // Si el resultado es NaN, significa que algún valor no era numérico
                if (isNaN(totalFacturarUSD)) {
                    console.error(`Error: el cálculo de TotalFacturarUSD resultó en NaN para NroSerial: ${factura.NroSerial}`);
                    continue; // Saltar esta iteración si el cálculo no es válido
                }
            
                // Actualizar la columna TotalFacturarUSD
                const updateQuery = `
                    UPDATE tbl_facturasinventariored
                    SET TotalFacturarUSD = ?
                    WHERE NroSerial = ?;
                `;
            
                const promiseUpdate = new Promise((resolve, reject) => {
                    db.query(updateQuery, [totalFacturarUSD, factura.NroSerial], (err, resUpdate) => {
                        if (err) {
                            console.log(`Error actualizando TotalFacturarUSD para NroSerial: ${factura.NroSerial} Error: `, err);
                            return reject(err);
                        }
                        console.log(`TotalFacturarUSD actualizado para NroSerial: ${factura.NroSerial}`);
                        resolve();
                    });
                });
            
                promises.push(promiseUpdate);
            }
            
        }
    }

    // Esperar a que todas las actualizaciones se completen
    await Promise.all(promises);
    result(null, { message: "Proceso de actualización de TotalFacturarUSD completado." });
};






module.exports = InventarioFactura;
