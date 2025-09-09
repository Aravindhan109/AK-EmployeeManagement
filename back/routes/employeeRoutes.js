const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");

router.post("/", employeeController.getEmployeesByRows);
router.post("/add", employeeController.addEmployee);
router.delete("/:empId", employeeController.deleteEmployee);
router.put("/:empId", employeeController.updateEmployee);

module.exports = router;
