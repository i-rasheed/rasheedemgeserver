const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  expense: { type: String, required: true },
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  userId: {type: String, required: true}
});

module.exports =Expense = mongoose.model("expense",expenseSchema);


// title,
    //   date,
    //   expense,
    //   type,
    //   amount,