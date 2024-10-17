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
    console.log('Estoy en el modelo de la API valor unitario');

    const deviceTypes = ['Router', 'Switche', 'Comunicaciones'];
    const criticidades = ['Muy Alta', 'Alta', 'Media', 'Baja', 'Muy Alta-REP', 'Alta-REP', 'Media-REP', 'Baja-REP'];

    // Almacenar las promesas de las actualizaciones
    const promises = [];

    for (const device of deviceTypes) {
        for (const criticidad of criticidades) {
            const queryTarifario = `
                SELECT ValorUnitario, SLA
                FROM tbl_tarifario
                WHERE TipoDispositivo = ? AND Criticidad = ?;`;

            // Obtener el ValorUnitario y SLA desde tbl_tarifario
            const resultTarifario = await new Promise((resolve, reject) => {
                db.query(queryTarifario, [device, criticidad], (err, resTarifario) => {
                    if (err) {
                        console.log("Error consultando tbl_tarifario: ", err);
                        return reject(err);
                    }
                    resolve(resTarifario.length > 0 ? resTarifario[0] : null);
                });
            });

            if (resultTarifario !== null) {
                const valorUnitarioTarifario = resultTarifario.ValorUnitario;
                const ansComprometidoTarifario = resultTarifario.SLA;

                // Nueva consulta con validación para verificar si ya existen valores en las columnas relevantes
                const queryFacturas = `
                    SELECT f.NroSerial, f.NombreEquipo, f.ValorUnitarioUSD, f.ANSComprometido, f.ANSCumplido, r.Availability AS ANSCumplido, f.DescuentoANS
                    FROM tbl_facturasinventariored f
                    LEFT JOIN tbl_reportedisponibilidad r ON f.NombreEquipo = r.Host
                    WHERE f.TipoEquipo = ? AND f.CriticidadPrevia = ?
                    AND (f.ValorUnitarioUSD IS NULL OR f.ValorUnitarioUSD = '' OR
                         f.ANSComprometido IS NULL OR
                         f.ANSCumplido IS NULL OR 
                         f.DescuentoANS IS NULL
                         OR f.DescuentoRecargoVolumen IS NULL OR f.DescuentoRecargoVolumen = '')
                    `;

                const resFacturas = await new Promise((resolve, reject) => {
                    db.query(queryFacturas, [device, criticidad], (err, resFacturas) => {
                        if (err) {
                            console.log("Error consultando tbl_facturasinventariored y tbl_reportedisponibilidad: ", err);
                            return reject(err);
                        }
                        resolve(resFacturas);
                    });
                });

                // Iterar sobre los registros obtenidos
                for (const factura of resFacturas) {
                    const valorUnitarioFactura = factura.ValorUnitarioUSD;
                    const ansComprometidoFactura = factura.ANSComprometido;
                    const ansCumplido = factura.ANSCumplido || 0; // En caso de que no haya valor de ANSCumplido en tbl_reportedisponibilidad

                    // Obtener el DescuentoANS desde tbl_descuentoxsla según ANSCumplido
                    const queryDescuento = `
                        SELECT Descuento
                        FROM tbl_descuentoxsla
                        WHERE ? <= Imdisponibilidad_hasta
                        ORDER BY Imdisponibilidad_hasta ASC
                        LIMIT 1;`;

                    const descuentoANS = await new Promise((resolve, reject) => {
                        db.query(queryDescuento, [ansCumplido], (err, resDescuento) => {
                            if (err) {
                                console.log("Error consultando tbl_descuentoxsla: ", err);
                                return reject(err);
                            }
                            resolve(resDescuento.length > 0 ? resDescuento[0].Descuento : 0);
                        });
                    });

                    // Solo actualizar si los campos relevantes no están ya actualizados
                    if (valorUnitarioFactura !== valorUnitarioTarifario || 
                        ansComprometidoFactura !== ansComprometidoTarifario || 
                        factura.ANSCumplido !== ansCumplido || 
                        factura.DescuentoANS !== descuentoANS) {

                        const updateQuery = `
                            UPDATE tbl_facturasinventariored
                            SET ValorUnitarioUSD = ?, ANSComprometido = ?, ANSCumplido = ?, DescuentoANS = ?
                            WHERE NroSerial = ?;`;

                        const promiseUpdate = new Promise((resolve, reject) => {
                            db.query(updateQuery, [valorUnitarioTarifario, ansComprometidoTarifario, ansCumplido, descuentoANS, factura.NroSerial], (err, resUpdate) => {
                                if (err) {
                                    console.log("Error actualizando ValorUnitarioUSD, ANSComprometido, ANSCumplido o DescuentoANS: ", err);
                                    return reject(err);
                                }
                                console.log(`Valores actualizados para NroSerial: ${factura.NroSerial}`);
                                resolve();
                            });
                        });

                        promises.push(promiseUpdate);
                    }
                }
            }
        }
    }

    // Esperar a que todas las actualizaciones se completen
    await Promise.all(promises);
    result(null, { message: "Proceso de actualización completado." });
};





module.exports = InventarioFactura;
