const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    empId: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    role: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AravvvEmployee", employeeSchema);
