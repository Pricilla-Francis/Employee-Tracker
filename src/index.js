import { getDepartments, getRoles, getEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole } from './queries.js';

//import inquirer for prompts//
import inquirer from 'inquirer';


const mainMenu = async () => {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View All Employees',
                'Add An Employee',
                'Update An Employee Role',
                'View All Roles',
                'Add A Role',
                'View All Departments',
                'Add A Department',
                'Quit'
            ],
        },
    ]);


    switch (answers.action) {
        case 'View All Departments':
            const departments = await getDepartments();
            console.log("You selected 'View all departments'");
            console.table(departments);
            break;

        case 'View All Roles':
            const roles = await getRoles();
            console.log("You selected 'View all roles'");
            console.table(roles);
            break;

        case 'View All Employees':
            const employees = await getEmployees();
            console.log("You selected 'View all employees'");
            console.table(employees);
            break;

        case 'Add A Department':
            const departmentAnswer = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'Enter the name of the new department:',
                },
            ]);

            try {
                const newDepartment = await addDepartment(departmentAnswer.name);
                if (newDepartment) {
                    console.log(`Added new department: ${newDepartment.name}`);
                } else {
                    console.log('Department was not added because it already exists.');
                }
            } catch (err) {
                console.error('Error adding department:', err);
            }
            break;

        case 'Add A Role':
            const roleAnswers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'What is the name if the role?',
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'What is the salary for this role?',
                },
                {
                    type: 'input',
                    name: 'department_id',
                    message: 'What department does the role belong to?',
                    choices: await getDepartments(),
                },
            ]);
            const newRole = await addRole(roleAnswers.title, roleAnswers.salary, roleAnswers.department_id);
            console.log(`Added new role: ${newRole.title}`);
            break;

        case 'Add An Employee':
            const employeeAnswers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: 'What is the the employee first name?',
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: 'What is the employee last name?',
                },
                {
                    type: 'input',
                    name: 'role_id',
                    message: 'What is the employee role?',
                    choices: await getRoles(),
                },
                {
                    type: 'input',
                    name: 'manager_id',
                    message: 'Who is the employee manager?',
                    choices: await getEmployees(),
                },
            ]);
            const newEmployee = await addEmployee(employeeAnswers.first_name, employeeAnswers.last_name, employeeAnswers.role_id, employeeAnswers.manager_id || null);
            console.log(`Added new employee: ${newEmployee.first_name} ${newEmployee.last_name}`);
            break;

        case 'Update An Employee Role':
            const updateAnswers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'employee_id',
                    message: 'Enter the ID of the employee you want to update:',
                },
                {
                    type: 'input',
                    name: 'role_id',
                    message: 'Enter the new role ID for this employee:',
                },
            ]);
            const editEmployee = await updateEmployeeRole(updateAnswers.role_id, updateAnswers.employee_id);
            console.log(`Updated employee role for ID: ${updateAnswers.employee_id}`);
            break;

        case 'Quit':
            console.log("Now exiting...");
            process.exit();
        default:
            console.log("Unknown action, try again.");
            await mainMenu();
    }

    await mainMenu();
};

mainMenu();