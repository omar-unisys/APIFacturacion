module.exports = app => {
  const empresas = require("../controllers/empresas.controller.js");
  const red = require("../controllers/inventarioRed.controller.js");

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
  
  // Retorna lista de red
  router.get("/invred/", red.getAll);

  // Retorna una aplicación con id
  router.get("/invred/:id", red.findById);

  // Retorna una aplicación con id
  router.post("/invred/", red.create);

  // Retorna una aplicación con id
  router.put("/invred/:id", red.update);

  // Retorna una aplicación con id
  router.delete("/invred/:id", red.delete);



  app.use('/api/v1/facturacion', router);
  
};