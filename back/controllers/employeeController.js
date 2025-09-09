const Employee = require("../models/Employee");

// Get all employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Add a new employee
exports.addEmployee = async (req, res) => {
  try {
    const { empId, name, age, role } = req.body;
    const newEmployee = new Employee({ empId, name, age, role });
    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (err) {
    res.status(400).json({ message: "Error adding employee" });
  }
};

// Update an employee
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEmployee = await Employee.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedEmployee);
  } catch (err) {
    res.status(400).json({ message: "Error updating employee" });
  }
};

// Delete an employee
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    await Employee.findByIdAndDelete(id);
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: "Error deleting employee" });
  }
};
