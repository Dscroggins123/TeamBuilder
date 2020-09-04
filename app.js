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
    "Add Role",
    "Add Department",
    "Remove Employee",
    "Remove Role",
    "Remove Department",
    "Update Employee Role",
    "Update Employee Manager",
    "View all Roles",
        "View all Departments" ]}
]  
//Employee info variable


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
    if (response.options == "Add Role"){
        addRole()
    }
    if (response.options == "Add Department"){
        addDepartment()
    }
    if (response.options == "View all Roles"){
        showRoles()
    }
    if (response.options == "View all Departments"){
        showDepartments()
    }
    if (response.options == "View All Employees by Department"){
        employeesByDepartment()
    }
    if (response.options == "Remove Employee"){
        removeEmployees()
    }
    if (response.options == "Remove Role"){
        removeRole()
    }
    if (response.options == "Remove Department"){
        removeDepartment()
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
function showRoles(){ orm.getAll("role")
  .then(data=> console.table(data));
}
function showDepartments(){ orm.getAll("department")
.then(data=> console.table(data));
}
function employeesByDepartment(){

}
function employeesByManager(){

}

//add employees
function addEmployees(){
    var join = "SELECT employee.first_name,employee.last_name,role.title,role.salary  FROM role LEFT JOIN employee ON employee.role_id = role.id; "
    connection.query(join, function(err, results) {
        if (err) throw err;
        
    inquirer.prompt(
        [
            {"message": "What is the employee's first name? ",name:"first_name"},
            {"message":"What is the employee's last name?",name:"last_name"},
            {name: "role_id",
            type: "rawlist",
            choices: function() {
              var roleArray = [];
              for (var i = 0; i < results.length; i++) {
                roleArray.push(results[i].title);
              }
              return roleArray;
            },
            message: "What is the employee's role ?"},
            {"message":"Who is the employee's Manager", name:"manager_id"}
        ]
    )
    .then(function(data){
       console.log(data)
    orm.addOne("employee", {first_name: data.first_name, last_name: data.last_name , role_id:data.role_id, manager_id:data.manager_id})


    })
})
}
function addRole(){
    inquirer.prompt([
        {"message": "What role would you like to add ?", name:"title"},
        {"message": "What is the salary ?", name:"salary"}]
    ).then(function(response){
        orm.addOne("role",{title:response.title, salary:response.salary})
        console.log("successfully added role")
    })


}
function addDepartment(){
    inquirer.prompt([
        {"message": "What department would you like to add ?", name:"name"}]
    ).then(function(response){
        orm.addOne("department",{name:response.name})
        console.log("successfully added department")
    })


}
// REMOVES
function removeEmployees(){
    connection.query("SELECT * FROM employee", function(err, results) {
        if (err) throw err;
        console.log(results)
    inquirer.prompt([
        {name: "deletedEmployee",
        type: "rawlist",
        choices: function() {
          var Employees = [];
          for (var i = 0; i < results.length; i++) {
            Employees.push(results[i].first_name);
          }
          return Employees},
          message: "Which employee would you like to delete ?"
        }])
    .then(function(response){
        var chosenEmployee;
        for (var i = 0; i < results.length; i++) {
          if (results[i].first_name === response.deletedEmployee) {
            chosenEmployee = results[i];
            connection.query(
                `DELETE FROM employee WHERE employee.first_name = ?;  `,
                [response.deletedEmployee],
                function(error) {
                  if (error) throw err;
                  console.log("Employee DELETED");
                  
                }
              );
          }
        }
        })
})
}
function removeRole(){
    connection.query("SELECT * FROM role", function(err, results) {
        if (err) throw err;
        console.log(results)
    inquirer.prompt([
        {name: "deletedRole",
        type: "rawlist",
        choices: function() {
          var Roles = [];
          for (var i = 0; i < results.length; i++) {
            Roles.push(results[i].title);
          }
          return Roles},
          message: "Which role would you like to delete ?"
        }])
    .then(function(response){
        var chosenRole;
        for (var i = 0; i < results.length; i++) {
          if (results[i].title === response.deletedRole) {
            chosenRole = results[i];
            connection.query(
                `DELETE FROM role WHERE role.title = ?;  `,
                [response.deletedRole],
                function(error) {
                  if (error) throw err;
                  console.log("Role DELETED");
                  
                }
              );
          }
        }
        })
})
}



function removeDepartment(){
    connection.query("SELECT * FROM department", function(err, results) {
        if (err) throw err;
        console.log(results)
    inquirer.prompt([
        {name: "deletedDepartment",
        type: "rawlist",
        choices: function() {
          var Departments = [];
          for (var i = 0; i < results.length; i++) {
            Departments.push(results[i].name);
          }
          return Departments},
          message: "Which department would you like to delete ?"
        }])
    .then(function(response){
        var chosenDepartment;
        for (var i = 0; i < results.length; i++) {
          if (results[i].name === response.deletedDepartment) {
            chosenDepartment = results[i];
            connection.query(
                `DELETE FROM department WHERE department.name = ?;  `,
                [response.deletedDepartment],
                function(error) {
                  if (error) throw err;
                  console.log("Department DELETED");
                  
                }
              );
          }
        }
        })
})
}
  