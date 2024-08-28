const multer = require("multer");
const Red = require("../models/inventarioRed.model.js");
const xlsx = require('xlsx');

exports.getReport =  (req, res) => {
  try {
    const title = req.query.title;
    // 1. Obtener datos de la base de datos
    Red.getAll(title, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Ha ocurrido un error mientras retornaba la información."
        });

      // 2. Convertir datos a formato de hoja de cálculo
      const worksheetData = data.map(item => ({
        idSerial: item.idSerial,
        idFilial: item.idFilial,
        idCriticidad: item.idCriticidad,
        idTipoEquipo: item.idTipoEquipo,
        idPropietarioFilial: item.idPropietarioFilial,
        idFilialPago: item.idFilialPago,
        Marca: item.Marca,
        Modelo: item.Modelo,
        NombreEquipo: item.NombreEquipo,
        DireccionIp: item.DireccionIp,
        TipoRed: item.TipoRed,
        Pais: item.Pais,
        Sede: item.Sede,
        Edificio: item.Edificio,
        Piso: item.Piso,
        Ubicacion: item.Ubicacion,
        TipoServicio: item.TipoServicio,
        DetalleServicio: item.DetalleServicio,
        Administrable: item.Administrable,
        FechaSoporte: item.FechaSoporte,
        SoporteDetalle: item.SoporteDetalle,
        FechaGarantia: item.FechaGarantia,
        GarantiaDetalle: item.GarantiaDetalle,
        FechaEoL: item.FechaEoL,
        EolDetalle: item.EolDetalle,
        VrsFirmware: item.VrsFirmware,
        NumPuertos: item.NumPuertos,
        idEstado: item.idEstado,
        FechaIngreso: item.FechaIngreso,
        FechaModificacion: item.FechaModificacion,
        Comentario: item.Comentario,
        Conectado: item.Conectado,
        InStock: item.InStock
      }));
        // 3. Crear un libro de trabajo y agregar la hoja de cálculo
      const workbook = xlsx.utils.book_new();
      const worksheet = xlsx.utils.json_to_sheet(worksheetData);
      xlsx.utils.book_append_sheet(workbook, worksheet, 'InventarioRed');

      // 4. Generar el archivo Excel en memoria
      const excelBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      // 5. Establecer las cabeceras y enviar el archivo Excel
      res.setHeader('Content-Disposition', 'attachment; filename=InventarioRed.xlsx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.send(excelBuffer);

    });
  } catch (error) {
    console.error('Error exportando datos a Excel:', error);
    res.status(500).send('Error exportando datos a Excel');
  }
};

exports.getAll = (req, res) => {
    const title = req.query.title;
    // console.log(req.query)

    Red.getAll(title, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Ha ocurrido un error mientras retornaba la información."
        });
      else res.send(data);
    });
};

exports.findById = (req, res) => {
  Red.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No se encontró la información con id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Ha ocurrido retornando la información con id " + req.params.id
        });
      }
    } else res.send(data);
  });
};

exports.update = (req, res) => {
  // Validate Request
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).send({
      message: "Contenido no puede ser vacío!"
    });
  }

  Red.updateById(
    req.params.id,
    new Red(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `No se encontró la Red con id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error actualizando la Red con id " + req.params.id + ' ' + err
          });
        }
      } else res.send(data);
    }
  );
};

exports.create = (req, res) => {

    // Valida el cuerpo del mensaje
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).send({
        message: "El contenido no puede ser vacío!"
      });
    }    

    // Create la Red
    const red = new Red({
      idSerial : req.body.idSerial,
      idFilial : req.body.idFilial,
      idCriticidad : req.body.idCriticidad,
      idTipoEquipo : req.body.idTipoEquipo,
      idPropietarioFilial : req.body.idPropietarioFilial,
      idFilialPago : req.body.idFilialPago,
      marca : req.body.marca,
      modelo : req.body.modelo,
      nombreEquipo : req.body.nombreEquipo,
      direccionIp : req.body.direccionIp,
      tipoRed : req.body.tipoRed,
      pais : req.body.pais,
      sede : req.body.sede,
      edificio : req.body.edificio,
      piso : req.body.piso,
      ubicacion : req.body.ubicacion,
      tipoServicio : req.body.tipoServicio,
      detalleServicio : req.body.detalleServicio,
      administrable : req.body.administrable,
      fechaSoporte : req.body.fechaSoporte,
      soporteDetalle : req.body.soporteDetalle,
      fechaGarantia : req.body.fechaGarantia,
      garantiaDetalle : req.body.garantiaDetalle,
      fechaEoL : req.body.fechaEoL,
      eolDetalle : req.body.eolDetalle,
      vrsFirmware : req.body.vrsFirmware,
      numPuertos : req.body.numPuertos,
      idEstado : req.body.idEstado,
      fechaIngreso : req.body.fechaIngreso,
      fechaModificacion : req.body.fechaModificacion,
      comentario : req.body.comentario,
      conectado : req.body.conectado,
      inStock : req.body.inStock
  });
  
    // Guarda la Red en la base de datos
    Red.create(red, (err, data) => {
      if (err)
          res.status(500).send({
              message:
                err.message || "Algún error ha ocurrido mientras se crea la Red."
          });
      else res.send(data);
    });
};

exports.delete = (req, res) => {
  Red.delete(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No se encontró la Red con id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "No se puede eliminar la Red con id " + req.params.id + ' ' + err
        });
      }
    } else res.send({ message: `La Red con id ${req.params.id} fue eliminada satisfactoriamente!` });
  });
};

exports.createHistorico = (req, res) => {

  // Valida el cuerpo del mensaje
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).send({
      message: "El contenido no puede ser vacío!"
    });
  }
  
  // Guarda el historico de Red en la base de datos
  Red.createHistorico(req.body, (err, data) => {
    if (err)
        res.status(500).send({
            message:
              err.message || "Algún error ha ocurrido mientras se crea el historico de Red."
        });
        else {
          // actualizamos los datos dados en la tabla de inventario
          Red.updateById(
            req.body.idSerial,
            new Red(req.body),
            (err, data) => {
              if (err) {
                if (err.kind === "not_found") {
                  res.status(404).send({
                    message: `No se encontró la Red con id ${req.body.idSerial}.`
                  });
                } else {
                  res.status(500).send({
                    message: "Error actualizando la Red con id " + req.body.idSerial + ' ' + err
                  });
                }
              } else res.send(data);
            }
          );
        }
  });
};


exports.getxTipoHistorico = (req, res) => {
  Red.findAllxTipoHistorico(req.params.id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Ha ocurrido un error mientras retornaba la información."
      });
    else res.send(data);
  });
};

exports.findByIdxHistorico = (req, res) => {
Red.findByIdxHistorico(req.params.id, (err, data) => {
  if (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `No se encontró la información con id ${req.params.id}.`
      });
    } else {
      res.status(500).send({
        message: "Ha ocurrido retornando la información con id " + req.params.id
      });
    }
  } else res.send(data);
});
};


exports.uploadInventory = async (req, res) => {
    try {
        // Leer el archivo Excel desde el buffer
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        
        // var workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0]; // Obtener el nombre de la primera hoja
        
        const sheet = workbook.Sheets[sheetName];
        

        // Convertir la hoja de Excel a un array de objetos JSON
        const rows = xlsx.utils.sheet_to_json(sheet);

        // Procesar cada fila del Excel y realizar la inserción o actualización
        for (let row of rows) {
            const inventoryData = {
                idSerial: row.idSerial,
                idFilial: row.idFilial,
                idCriticidad: row.idCriticidad,
                idTipoEquipo: row.idTipoEquipo,
                idPropietarioFilial: row.idPropietarioFilial,
                idFilialPago: row.idFilialPago,
                Marca: row.Marca,
                Modelo: row.Modelo,
                NombreEquipo: row.NombreEquipo,
                DireccionIp: row.DireccionIp,
                TipoRed: row.TipoRed,
                Pais: row.Pais,
                Sede: row.Sede,
                Edificio: row.Edificio,
                Piso: row.Piso,
                Ubicacion: row.Ubicacion,
                TipoServicio: row.TipoServicio,
                DetalleServicio: row.DetalleServicio,
                Administrable: row.Administrable ? 1 : 0,
                FechaSoporte: row.FechaSoporte || null,
                SoporteDetalle: row.SoporteDetalle ,
                FechaGarantia: row.FechaGarantia || null,
                GarantiaDetalle: row.GarantiaDetalle ,
                FechaEoL: row.FechaEoL || null,
                EolDetalle: row.EolDetalle ,
                VrsFirmware: row.VrsFirmware,
                NumPuertos: row.NumPuertos,
                idEstado: row.idEstado,
                FechaIngreso: row.FechaIngreso || null,
                FechaModificacion: new Date(),
                Comentario: row.Comentario,
                Conectado: row.Conectado ? 1 : 0,
                InStock: row.InStock ? 1 : 0
            };

            // Aquí puedes llamar a una función en tu modelo para hacer un INSERT o UPDATE
            await Red.upsert(inventoryData); // upsert es una combinación de update e insert
        }

        res.status(200).send({ message: 'Datos cargados exitosamente.' });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error al procesar el archivo Excel."
        });
    }
};



