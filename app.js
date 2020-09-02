var inquirer =  require("inquirer");
var mysql = require("mysql");
const util = require("util");

var connection = mysql.createConnection({
    host: "localhost",
    
    port: 3306,
    
    user: "root",
    
    password: "Dblue123",
    database: "Team_DB"
  });
  connection.connect(function(err) {
    if (err) throw err;
    
  });

  connection.query = util.promisify(connection.query);

  const orm = {
      getAll(table){
          return connection.query(`select * from ${table}`)
      },
      addOne(table,obj){
          return connection.query(`INSERT INTO ${table} SET ?`, obj)
      }
  }
orm.addOne("employee", {first_name: "Dustin", last_name: "Scroggins", role_id:3, manager_id: null})

  orm.getAll("employee")
  .then(data=> console.table(data));
