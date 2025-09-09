const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  empId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  role: { type: String, required: true },
});

module.exports = mongoose.model("yuvaEmployee", employeeSchema);
