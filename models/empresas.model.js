const db = require("./db.js");

// constructor
const Empresas = function(empresa) {
    this.id = empresa.id;
    this.nombre = empresa.nombre;
    this.horasasignadas = empresa.horasasignadas;
};

Empresas.getAll = async (req, result) => {
    try {
        db.query('SELECT * FROM tbl_empresas', (err, res) => {
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

Empresas.findById = async (id, result) => {

    try {
        db.query(`select * from tbl_empresas WHERE id = ${id};`, (err, res) => {
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

Empresas.updateById = async (id, empresa, result) => {

    try {
        db.query(`UPDATE tbl_empresas SET nombre='${empresa.nombre}', horasasignadas=${empresa.horasasignadas} WHERE id=${id}`, (err, res) => {
            if (err) {
                result( err.message, null);
                return;
            }
            
            if (res.affectedRows == 0) {
                // not found
                result({ kind: "not_found" }, null);
                return;
            }

            result(null, { ...empresa });
        });
    } catch (error) {
        console.error('Error al consultar empresas:', error);
        result(error, null);
    }
};

Empresas.create = async (empresa, result) => {

    try {
        
        db.query(`INSERT INTO tbl_empresas VALUES(${empresa.id}, '${empresa.nombre}', ${empresa.horasasignadas});`, (err, res) => {
            if (err) {
                result( err.message, null);
                return;
            }

            result(null, { ...empresa });
        });

        // result(null, { ...empresa });
    } catch (error) {
        console.error('Error al crear la empresa:', error);
        result(error, null);
    }
};

Empresas.delete = async (id, result) => {

    try {
        db.query(`DELETE FROM tbl_empresas WHERE id=${id}`, (err, res) => {
            if (err) {
                result( err.message, null);
                return;
            }

            if (res.affectedRows == 0) {
                // not found
                result({ kind: "not_found" }, null);
                return;
            }

            result(null, { id: id });
        });
        
    } catch (error) {
        console.error('Error al eliminar empresa:', error);
        result(error, null);
    }
};

module.exports = Empresas;
