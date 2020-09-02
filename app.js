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
//option variables
var options= [
    {"message": "What would you like to do" ,name:"options",type:"list", choices:["View All Employees",
    "View All Employees by Department",
    "View All Employees by Role",
    "Add Employee",
    "Remove Employee",
    "Update Employee Role",
    "Update Employee Manager" ]}
]  
//Employee info variable
var employeeInfo = [
    {"message": "What is the employee's first name? ",name:"first_name"},
    {"message":"What is the employee's last name?",name:"last_name"},
    {"message":"What is the employee's role?",name:"role_id"},
    {"message":"Who is the employee's Manager", name:"manager_id"}
]
//First Prompt
chooseOption()
function chooseOption() {
inquirer.prompt(options)
.then(function(response){
    if (response.options == "View All Employees"){
    showEmployees()
}
    if (response.options == "Add Employee"){
        addEmployees()
    }
    

})

}



  
  const orm = {
      getAll(table){
          return connection.query(`select * from ${table}`)
      },
      addOne(table,obj){
          return connection.query(`INSERT INTO ${table} SET ?`, obj)
      }
  }
// orm.addOne("employee", {first_name: "Dustin", last_name: "Scroggins", role_id:3, manager_id: null})

function showEmployees(){ orm.getAll("employee")
  .then(data=> console.table(data));
  

}

function employeesByDepartment(){

}
function employeesByManager(){

}
function addEmployees(){
    inquirer.prompt(employeeInfo)
    .then(function(data){
        console.log(data)

    })
}


