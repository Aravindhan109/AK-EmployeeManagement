const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");

// Routes
router.get("/", employeeController.getEmployees);
router.post("/add", employeeController.addEmployee);
router.put("/:id", employeeController.updateEmployee);
router.delete("/:id", employeeController.deleteEmployee);

module.exports = router;
