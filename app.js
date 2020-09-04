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
    connection.query("SELECT * FROM role", function(err, results) {
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

  