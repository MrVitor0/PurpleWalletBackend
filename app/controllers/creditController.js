import bankingModel from '../models/banking/bankingModel.js';
import bankingBillsModel from '../models/banking/bankingBillsModel.js';
import BankingBillsValidator from '../utils/bankingBillsValidator.js';
import sequelize from '../../config/database.js';
import creditModel from '../models/credit/creditModel.js';
import creditPurchasesModel from '../models/credit/creditPurchasesModel.js';
import CreditCardValidator from '../utils/creditCardValidator.js';
import Sequelize from 'sequelize'
const exports = {}


/**
 * @param {reference} - (ISO 8601)
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.generateCreditCardBill = async (req, res) => {
    let credit;
    try {
        let CCValidator = new CreditCardValidator();
        let creditBase = CCValidator.validateCreditCardBill(req.body);
        //insert in creditModel
        credit = await creditModel.create({
            id_user: req.user.id,
            isClosed: creditBase.isClosed,
            isPaid: creditBase.isPaid,
            amount: creditBase.amount,
            reference: creditBase.reference,
        })
    } catch (error) {
        let message = error.name === 'SequelizeValidationError' ?"A credit card bill for this month already exists." : error.message
        res.status(400).send({
            status: 400,
            message: message,
        })
        return;
    }
    res.status(200).send(credit)
}

exports.getCreditCardBills = async (req, res) => {
    try {
        const creditCardBills = await creditModel.findAll({
            where: {
                id_user: req.user.id
            }
        });
        //add a field called "Month" with the name of the current month of reference
        creditCardBills.forEach(creditCardBill => {
            delete creditCardBill.dataValues.id_user;
            creditCardBill.dataValues.month = new Date(creditCardBill.reference).toLocaleString('default', { month: 'long' });
        });
        res.status(200).send(creditCardBills);
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: error.message,
        });
    }
}

/**
 * @description - This function will close a credit card bill, adding it to banking spends (Payment)
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.payCreditCardBill = async (req, res) => {
    try {
        const id = req.params.id;
        const creditCardBill = await creditModel.findOne({
            where: {
                id: id,
                id_user: req.user.id
            }
        });
        if (!creditCardBill) {
            res.status(404).send({
                status: 404,
                message: "Credit card bill not found.",
            });
            return;
        }
        if (creditCardBill.isPaid) {
            res.status(400).send({
                status: 400,
                message: "This credit card bill is already paid.",
            });
            return;
        }
        if (!creditCardBill.isClosed) {
            res.status(400).send({
                status: 400,
                message: "This credit card bill is not closed yet.",
            });
            return;
        }
        try {
            await sequelize.transaction(async (t) => {
              // Todas as operações a seguir serão realizadas em uma única transação
              const banking = await bankingModel.findOne({
                attributes: ['id'],
                where: {
                  id_user: req.user.id
                },
                transaction: t // Passando a transação como parte da consulta
              });
              const monthName = new Date(creditCardBill.reference).toLocaleString('en-us', { month: 'long' });
              await bankingBillsModel.create({
                id_banking: banking.id,
                type_transaction: BankingBillsValidator.TYPE_TRANSACTION.PAYMENT,
                type_payment: BankingBillsValidator.TYPE_PAYMENT.CREDIT_CARD,
                name: `creditcard.bill - month.${monthName}`,
                amount: creditCardBill.amount
              }, { transaction: t }); // Passando a transação como parte da criação
          
              await creditModel.update({
                isClosed: true,
                isPaid: true,
              }, {
                where: {
                  id: id,
                  id_user: req.user.id
                },
                transaction: t // Passando a transação como parte da atualização
              });
            });
        } catch (error) {
            res.status(500).send({
                status: 500,
                message: error.message,
            });
            return;
        }
        res.status(200).send({
            status: 200,
            message: "Credit card bill payed successfully.",
        });
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: error.message,
        });
    }
}
/** CREDIT PURCHASES AREA */
/**
 * @description - Route to create a purchase for a specific bill
 * @param {*} req 
 * @param {*} res 
 */
exports.generateCreditCardPurchase = async (req, res) => {
    const t = await sequelize.transaction(); // Iniciar uma transação
    try {
      const CCValidator = new CreditCardValidator();
      const creditBase = CCValidator.validateCreditCardPurchase(req.body);
      const currentDate = new Date(req.body.reference || new Date());
      const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
      // Envolva todas as operações dentro da transação
      const [creditCardBill, created] = await creditModel.findOrCreate({
        where: {
          id_user: req.user.id,
          reference: currentMonth,
        },
        defaults: {
          id_user: req.user.id,
          isClosed: false,
          isPaid: false,
          amount: 0,
          reference: currentMonth,
        },
        transaction: t,
      });
      const credit = await creditPurchasesModel.create(
        {
          id_user: req.user.id,
          id_credit: creditCardBill.id,
          name: creditBase.name,
          amount: creditBase.amount,
          reference: creditBase.reference,
        },
        { transaction: t }
      );
      await creditModel.update(
        {
          amount: sequelize.literal(`ROUND(amount + ${creditBase.amount}, 2)`),
        },
        {
          where: {
            id: creditCardBill.id,
          },
          transaction: t,
        }
      );
      await t.commit();
      res.status(200).send({
        purchase: credit,
        bill: creditCardBill,
      });
    } catch (error) {
      // Reverter a transação em caso de erro
      await t.rollback();
      let message = error.name === 'SequelizeValidationError' ? 'Oops, an unknown error ocurred.' : error.message;
  
      res.status(400).send({
        status: 400,
        message: message,
        error: error,
      });
    }
};



exports.getCreditCardPurchases = async (req, res) => {
    let fromDate = false;
    if (req.body.reference && CreditCardValidator.isISO8601(req.body.reference)) {
      const referenceDate = new Date(req.body.reference);
      fromDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1).toISOString();
    }
    // Construa a consulta com base nas condições
    const queryOptions = {
      where: {
        id_user: req.user.id,
      },
      include: [{
        model: creditPurchasesModel,
        as: 'credit',
        required: false,
      }],
    };
    if (fromDate) {
      queryOptions.where.reference = fromDate;
      // Use findOne se fromDate estiver definido
      const creditCardBill = await creditModel.findOne(queryOptions);
  
      if (!creditCardBill) {
        res.status(200).send({
          results: [],
          query: req.body.reference,
        });
        return;
      }
      // Adicione um campo chamado "Month" com o nome do mês de referência atual
      delete creditCardBill.dataValues.id_user;
      creditCardBill.dataValues.month = new Date(creditCardBill.reference).toLocaleString('default', { month: 'long' });
      res.status(200).send(creditCardBill);
    } else {
      // Use findAll se fromDate não estiver definido
      const creditCardBills = await creditModel.findAll(queryOptions);
  
      if (creditCardBills.length < 1) {
        res.status(200).send({
          results: [],
          query: req.body.reference,
        });
        return;
      }
  
      // Adicione um campo chamado "Month" com o nome do mês de referência atual para cada resultado
      creditCardBills.forEach((creditCardBill) => {
        delete creditCardBill.dataValues.id_user;
        creditCardBill.dataValues.month = new Date(creditCardBill.reference).toLocaleString('default', { month: 'long' });
      });
  
      res.status(200).send({
        results: creditCardBills,
        query: req.body.reference,
      });
    }
};
  



exports.deleteCreditCardPurchase = async (req, res) => {
  const uid = req.params.id;
  const t = await sequelize.transaction(); 

  try {
    const creditPurchase = await creditPurchasesModel.findOne({
      where: {
        id: uid,
      },
      transaction: t,
    });
    if (!creditPurchase) {
      res.status(404).send({
        status: 404,
        message: "Credit card purchase not found.",
      });
      return;
    }
    const credit = await creditModel.findOne({
        where: {
          id: creditPurchase.id_credit,
          id_user: req.user.id,
        },
        transaction: t,
      });
    if (credit.isPaid) {
      res.status(400).send({
        status: 400,
        message: "Sorry, this credit card purchase is already paid and you can't delete it.",
      });
      return;
    }
    await credit.update(
      {
        amount: sequelize.literal(`ROUND(amount - ${creditPurchase.amount}, 2)`),
      },
      {
        where: {
          id: creditPurchase.id_credit,
          id_user: req.user.id,
        },
        transaction: t,
      }
    );
    await creditPurchasesModel.destroy({
      where: {
        id: uid
      },
      transaction: t,
    });
    await t.commit();

    res.status(200).send({
      status: 200,
      message: "Credit card purchase deleted successfully.",
      data: creditPurchase,
    });
  } catch (error) {
    // Reverter a transação em caso de erro
    await t.rollback();
    res.status(500).send({
      status: 500,
      message: "An error occurred while deleting the credit card purchase.",
      error: error,
    });
  }
};


export default exports;