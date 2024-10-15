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

LB.getSumCantidadByDevices = (result) => {
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

                        // Retornar resultados por dispositivo
                        resolve({
                            device,
                            totalLineaBase,
                            totalInventario,
                            diferencia,
                            variacion,
                            descuento,
                        });
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





module.exports = LB;