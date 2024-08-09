const Red = require("../models/inventarioRed.model.js");

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