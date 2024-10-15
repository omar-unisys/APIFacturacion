const db = require("./db.js");

// constructor
const Disponibilidad = function(reportedisponibilidad) {
    this.Client = reportedisponibilidad.Client;
    this.Host = reportedisponibilidad.Host;
    this.Start_Date = reportedisponibilidad.Start_Date;
    this.End_Date = reportedisponibilidad.End_Date;
    this.Days = reportedisponibilidad.Days;
    this.Testname = reportedisponibilidad.Testname;
    this.Availability = reportedisponibilidad.Availability;
    this.Downtime = reportedisponibilidad.Downtime;
    this.Type = reportedisponibilidad.Type;
    this.Page = reportedisponibilidad.Page;
    this.Group = reportedisponibilidad.Group;
    this.Comment = reportedisponibilidad.Comment;
    this.Name_Alias = reportedisponibilidad.Name_Alias;
    this.Description_1 = reportedisponibilidad.Description_1;
    this.Description_2 = reportedisponibilidad.Description_2;
    this.Description_3 = reportedisponibilidad.Description_3;
};


Disponibilidad.getDisponibilidad = async (req, result) => {
    try {
        db.query('SELECT * FROM tbl_reportedisponibilidad;', (err, res) => {
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

module.exports = Disponibilidad;