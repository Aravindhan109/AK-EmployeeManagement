const Employee = require("../models/employeeModel");

exports.getEmployeesByRows = async (req, res) => {
  try {
    const { sortModel, filterModel, quickSearch } = req.body;

    let filter = {};
    if (filterModel) {
      for (let key in filterModel) {
        const filterData = filterModel[key];
        if (filterData.filter) {
          filter[key] = { $regex: filterData.filter, $options: "i" };
        }
      }
    }

    let searchFilter = {};
    if (quickSearch && quickSearch.trim() !== "") {
      const regex = new RegExp(quickSearch, "i");
      searchFilter = {
        $or: [
          { empId: regex },
          { name: regex },
          { role: regex }, 
        ],
      };

       if (!isNaN(quickSearch)) {
        searchFilter.$or.push({ age: Number(quickSearch) });
      }
    }
    const finalQuery =
      Object.keys(filter).length && Object.keys(searchFilter).length
        ? { $and: [filter, searchFilter] }
        : Object.keys(filter).length
        ? filter
        : searchFilter;

    let sort = {};
    if (sortModel && sortModel.length > 0) {
      sort[sortModel[0].colId] = sortModel[0].sort === "asc" ? 1 : -1;
    }

    const rows = await Employee.find(finalQuery).sort(sort);
    const totalCount = rows.length;

    res.json({ rows, totalCount });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch employees" });
  }
};

exports.addEmployee = async (req, res) => {
  try {
    const newEmployee = new Employee(req.body);
    const savedEmployee = await newEmployee.save();
    res.json(savedEmployee);
  } catch (err) {
    res.status(500).json({ error: "Failed to add employee" });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.empId);
    if (!deletedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json({ message: "Employee deleted successfully", deletedEmployee });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete employee" });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.empId,
      req.body,
      { new: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json(updatedEmployee);
  } catch (err) {
    res.status(500).json({ error: "Failed to update employee" });
  }
};
