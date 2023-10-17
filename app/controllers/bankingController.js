import bankingModel from '../models/banking/bankingModel.js';
import bankingBillsModel from '../models/banking/bankingBillsModel.js';
import BankingBillsValidator from '../utils/bankingBillsValidator.js';
import { Op } from 'sequelize'
const exports = {}
exports.getUserBalance = async (req, res) => {
  try {
    //get a banking model list
    const banking = await bankingModel.findAll({
      where: {
        id_user: req.user.id
      },
      include: [
        {
          model: bankingBillsModel,
          as: 'banking'
        }
      ]
    });
    res.json(banking);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
exports.createTransaction = async (req, res) => {
  try {
    //get the field id from BankingModel after get the user id
    const banking = await bankingModel.findOne({
      attributes: ['id'],
      where: {
        id_user: req.user.id
      }
    }); 
    let {
      type_transaction,
      type_payment,
      referenceAt,
      name,
      amount,
    } = req.body;
    //validate the fields
    BankingBillsValidator.validate_type_transaction(type_transaction, 'type_transaction');
    BankingBillsValidator.validate_type_payment(type_payment, 'type_payment');
    BankingBillsValidator.validateString(name, 'name');
    BankingBillsValidator.validateDouble(amount, 'amount');

    if(referenceAt) {
      //check if is in format ISO 8601
      const date = new Date(referenceAt);
      if(isNaN(date.getTime())) {
        res.status(400).send({
          message: 'Invalid date format',
        });
      }
    }else{
      referenceAt = new Date();
      //ISO 8601
      referenceAt = referenceAt.toISOString();
    }
    
    //create a new transaction
    const newTransaction = await bankingBillsModel.create({
      id_banking: banking.id,
      type_transaction: BankingBillsValidator.TYPE_TRANSACTION[type_transaction?.toString()],
      type_payment: BankingBillsValidator.TYPE_PAYMENT[type_payment?.toString()],
      referenceAt: referenceAt,
      name,
      amount
    });
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: 'Oops, something went wrong!',
      error: error.message,
    });
  }
};
exports.getTransaction = async (req, res) => {
  try {
   //if req.params.id exists, check if it is a number then return for that specific transaction id
    if (req.params.id) {
      const banking = await bankingModel.findAll({
        where: {
          id_user: req.user.id
        },
        include: [
          {
            model: bankingBillsModel,
            as: 'banking',
            where: {
              id: req.params.id
            }
          }
        ]
      });
      res.status(201).send(banking);
    } else {
      //get a banking model list
      const transaction = await bankingModel.findOne({
        where: {
          id_user: req.user.id
        },
        include: [
          {
            model: bankingBillsModel,
            as: 'banking'
          }
        ]
      });
      //get the account_balance, (the sum of all banking.transactions)
      let account_balance = 0;
      let current_incoming = 0;
      let current_expenses = 0;
      transaction.banking.forEach(banking => {
          if (banking.type_transaction === 1) {
            account_balance += banking.amount;
            current_incoming += banking.amount;
          } else {
            account_balance -= banking.amount;
            current_expenses += banking.amount;
          }
          banking.type_transaction = BankingBillsValidator.getTransactionType(banking.type_transaction?.toString());
          banking.type_payment = BankingBillsValidator.getPaymentType(banking.type_payment?.toString());
      });
      //order transaction by createdAt
      transaction.banking.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
     //add the account_balance to the response
      res.status(201).send({
        account_balance,
        current_incoming,
        current_expenses,
        transactions: transaction
      });
    }
  } catch (error) {
    res.status(500).send({
      message: 'Oops, something went wrong!',
      error: error.message,
    });
  }
}


exports.updateTransaction = async (req, res) => {

  const {
    type_transaction,
    type_payment,
    name,
    amount,
  } = req.body;

  try {
    //validate the fields, just if they exist
    let itemCount = 0;
    if (type_transaction) {
      BankingBillsValidator.validate_type_transaction(type_transaction, 'type_transaction');
      itemCount++;
    }
    if (type_payment) {
      BankingBillsValidator.validate_type_payment(type_payment, 'type_payment');
      itemCount++;
    }
    if (name) {
      BankingBillsValidator.validateString(name, 'name');
      itemCount++;
    }
    if (amount) {
      BankingBillsValidator.validateDouble(amount, 'amount');
      itemCount++;
    }
    if(itemCount === 0) {
      res.status(400).send({
        message: 'No fields to update',
      });
    }
    //check if user has authorization to update the transaction
    const banking = await bankingModel.findOne({
      attributes: ['id'],
      where: {
        id_user: req.user.id
      }
    });
    //update the transaction and just pass the fields that are not null
    await bankingBillsModel.update({
      type_transaction: BankingBillsValidator.TYPE_TRANSACTION[type_transaction?.toString()],
      type_payment: BankingBillsValidator.TYPE_PAYMENT[type_payment?.toString()],
      name,
      amount
    }, {
      where: {
        id: req.params.id,
        id_banking: banking.id
      }
    });
    res.status(201).json({
      message: 'Transaction updated successfully',
      changes: {
        ...req.body
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: 'Oops, something went wrong!',
      error: error.message,
    });
  }
}
exports.deleteTransaction = async (req, res) => {
  try {
    // Verifica se o usuário tem autorização para excluir a transação
    const banking = await bankingModel.findOne({
      attributes: ['id'],
      where: {
        id_user: req.user.id
      }
    });
  
    if (!banking) {
      return res.status(401).json({
        message: 'You are not authorized to delete this transaction',
      });
    }
  
    // Exclui a transação
    const deletedRows = await bankingBillsModel.destroy({
      where: {
        id: req.params.id,
        id_banking: banking.id
      }
    });
    if (deletedRows === 0) {
      return res.status(404).json({
        message: 'Oops, something went wrong!',
        error: 'Transaction not found or you do not have permission to delete it',
        code: 404,
      });
    }
  
    res.status(201).json({
      message: 'Transaction deleted successfully',
      success: true,
      code: 201,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Oops, something went wrong!',
      error: error.message,
    });
  }
  
}



exports.getMonthlyTransactions = async (req, res) => {
  let { month, year } = req.params;

  try {
    if ((month < 1 || month > 12 || isNaN(parseFloat(month))) || (year < 2000 || year > 2100 || isNaN(parseFloat(year)))) {
      const currentDate = new Date();
      month = currentDate.getMonth() + 1;
      year = currentDate.getFullYear();
    }
    let startDate = new Date(year, month - 1, 1);
    let endDate =  new Date(year, month, 0, 23, 59, 59);
    let banking = await bankingModel.findAll({
      where: {
        id_user: req.user.id,
      },
      include: [
        {
          model: bankingBillsModel,
          as: 'banking',
          where: {
            referenceAt: {
              [Op.gte]: startDate.toISOString(),
              [Op.lt]: endDate.toISOString(),
            },
          },
        },
      ],
    });
    res.status(201).send(banking);
  } catch (error) {
    res.status(500).send({
      message: 'Oops, something went wrong!',
      error: error.message,
    });
  }
};


exports.getYearlyTransactions = async (req, res) => {
  let { year } = req.params;
  const currentDate = new Date();
  if (year < 2000 || year > 2100 || isNaN(parseFloat(year))) {
    year = currentDate.getFullYear();
  }
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 12, 0, 23, 59, 59);
  try {
    const banking = await bankingModel.findAll({
      where: {
        id_user: req.user.id,
      },
      include: [
        {
          model: bankingBillsModel,
          as: 'banking',
          where: {
            referenceAt: {
              [Op.gte]: startDate.toISOString(),
              [Op.lt]: endDate.toISOString(),
            },
          },
        },
      ],
    });
    const monthlyTransactions = new Map();
    for (let i = 0; i < 12; i++) {

      //create a timestamp that holdes the format YYYY-MM, months have to be 01 - 12
      let timestamp = new Date(year, i, 1);
      timestamp = timestamp.toISOString().split('T')[0].slice(0, 7);

      monthlyTransactions.set(i, {
        month: i + 1,
        timestamp: timestamp,
        balance: 0,
        earnings: [],
        expenses: [],
      });
    }
    banking.forEach((banking) => {
      banking.banking.forEach((transaction) => {
        const monthKey = transaction.referenceAt.getMonth();
        const monthlyData = monthlyTransactions.get(monthKey);
        if (transaction.type_transaction === 1) {
          monthlyData.balance += transaction.amount;
          monthlyData.earnings.push(transaction);
        } else {
          monthlyData.balance -= transaction.amount;
          monthlyData.expenses.push(transaction);
        }
      });
    });
    const monthlyTransactionsArray = Array.from(monthlyTransactions.values());
    res.status(201).send(monthlyTransactionsArray);
  } catch (error) {
    res.status(500).send({
      message: 'Oops, something went wrong!',
      error: error.message,
    });
  }
};



export default exports;