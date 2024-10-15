module.exports = app => {
  const empresas = require("../controllers/empresas.controller.js");
  const red = require("../controllers/inventarioRed.controller.js");
  const LB = require("../controllers/lineaBase.controller.js");
  const Tarifario = require("../controllers/tarifario.controller.js");
  const Disponibilidad = require("../controllers/disponibilidad.controller.js");
  const factura = require("../controllers/inventarioFactura.controller.js");

  
  let router = require("express").Router();

  // -------------Empresas---------------------
  // Retorna una aplicación
  router.get("/empresas/", empresas.getAll);

  // Retorna una aplicación con id
  router.get("/empresas/:id", empresas.findById);

  // Retorna una aplicación con id
  router.post("/empresas/", empresas.create);

  // Retorna una aplicación con id
  router.put("/empresas/:id", empresas.update);

  // Retorna una aplicación con id
  router.delete("/empresas/:id", empresas.delete);

  // -------------INVENTARIO RED---------------------
  
  
  
  // obtencion de reporte de inventario red
  router.get("/invred/exportExcel", red.getReport);

  // Retorna lista de red
  router.get("/invred/", red.getAll);

  // Retorna lista de facturas de red
  router.get("/facturasinvred/", red.getAll);

  // Retorna una aplicación con id
  router.get("/invred/:id", red.findById);

  // Retorna una aplicación con id
  router.post("/invred/", red.create);

  // Retorna una aplicación con id
  router.put("/invred/:id", red.update);

  // Retorna una aplicación con id
  router.delete("/invred/:id", red.delete);



  // Carga masiva de items de inventario
  const multer = require('multer');
  // Configuración de multer para almacenar el archivo en memoria
  const upload = multer({ storage: multer.memoryStorage() });
  router.post('/invred/uploadmasivo', upload.single('file'), red.uploadInventory);

  // Creamos un historico de red
  router.post("/invred/historico", red.createHistorico);

  // Retorna lista de historico red segun el tipo de historico pedido
  router.get("/invred/tipohistorico/:id", red.getxTipoHistorico);

  // Retorna una historico de red con idSerial
  router.get("/invred/historico/:id", red.findByIdxHistorico);

  app.use('/api/v1/facturacion', router);

  router.get("/JoinInventarioFactura/", factura.getInventarioFactura);

  

  // llamado al controlador para crear la Linea Base
  router.post("/linebase/", LB.create);

  // llamado al controlador para consultar los elementos de la tabla Linea Base
  router.get("/linebase/", LB.getLB);

  // llamado al controlador para crear el Tarifario
  router.post("/tarifario/", Tarifario.create);

  // llamado al controlador para consultar los elementos de la tabla Tarifario
  router.get("/tarifario/", Tarifario.getTarifario);

  // llamado al controlador para consultar los elementos de la tabla Tarifario
  router.get("/reportedisponibilidad/", Disponibilidad.getDisponibilidad);
  
   // Ruta para obtener la suma de la columna Cantidad donde Dispositivos
  router.get("/getSumCantidadByDevices", LB.getSumCantidadByDevices);

  router.put("/actualizar-valor-unitario", factura.actualizarValorUnitario);

  // Ruta para subir el archivo y procesar los datos
  router.post("/importReporteDisponibilidad/", factura.readReporteDisponibilidadExcel);

};