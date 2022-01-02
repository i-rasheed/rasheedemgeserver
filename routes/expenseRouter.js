const router = require("express").Router();
const auth = require("../middleware/auth");
const Expense = require("../models/expenseModel");

// Add expense
router.post("/", auth, async (req, res) => {
  try {
    const { title, date, expense, type, amount } = req.body;

    // validate

    if (!title || !date || !expense || !type || !amount)
      return res.status(400).json({ msg: "Not all fields have been entered." });
    const duplicateExpense = await Expense.findOne({
      title: title,
      date: date,
    });
    if (duplicateExpense) {
      return res.status(400).json({ msg: "No duplicate expense is allowed" });
    }
    const newExpense = new Expense({
      title,
      date,
      expense,
      type,
      amount,
      userId: req.user,
    });
    const savedExpense = await newExpense.save();
    res.json(savedExpense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update expense
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, date, expense, type, amount } = req.body;
    const expenseId = req.params.id;
    const wantedExpense = await Expense.findById(expenseId);
    if (!wantedExpense) {
      return res.status(400).json({
        msg: "No expense found with this id that belongs to the current user.",
      });
    }
    wantedExpense.title = title;
    wantedExpense.date = date;
    wantedExpense.expense = expense;
    wantedExpense.type = type;
    wantedExpense.amount = amount;
    const updatedExpense = await wantedExpense.save();
    res.send({ message: "Product Updated", expense: updatedExpense });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get all expenses for a given user
router.get("/mine/all", auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// delete a single expense
router.delete("/:id", auth, async (req, res) => {
  try {
    const expense = await Expense.findOne({
      userId: req.user,
      _id: req.params.id,
    });
    if (!expense)
      return res.status(400).json({
        msg: "No blog found with this id that belongs to the current user.",
      });
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
    res.json({ deletedExpense, msg: "successfully deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// delete multiple expense

router.delete("/many/:ids", auth, async (req, res) => {
  try {
    const expIds = req.params.ids;
    const actual = expIds.split(",");
    await Expense.deleteMany({
      _id: {
        $in: actual,
      },
    });
    res.json({ msg: "successfully deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// post many docs to DB
router.post("/many/:expenses", auth, async (req, res) => {
  try {
    const expenseArr = req.params.expenses;
    await Expense.collection.insert(expenseArr);
    res.json({ msg: "Success" });
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
});

// get a single expense
router.get("/:id/one", auth, async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (expense) {
    res.json(expense);
  } else {
    res.status(404).send({ message: "Expense Not Found" });
  }
});

module.exports = router;
