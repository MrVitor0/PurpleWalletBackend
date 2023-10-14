
import InvestmentModel from '../models/investment/investmentsModel.js';
import InvestmentHistoryModel from '../models/investment/investmentsHistory.js';
import baseValidator from '../utils/baseValidator.js';
import sequelize from '../../config/database.js';
const exports = {};

exports.getInvestments = async (req, res) => {
  try {
    const userInvestments = await InvestmentModel.findAll({
      where: {
        id_user: req.user.id
      }
    });
    res.status(200).send(userInvestments);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};


exports.createWallet = async (req, res) => {
  try {
      const { amount } = req.body;
      const newWallet = await InvestmentModel.create({
      id_user: req.user.id,
      amount: amount  || 0,
    });
    res.status(200).send(newWallet);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.createInvestment = async (req, res) => {
    const t = await sequelize.transaction(); // Iniciar uma transação
    try {
        const { name, subtitle, description, aport, objective } = req.body;
        baseValidator.validateString(name, 'name');
        baseValidator.validateString(subtitle, 'subtitle');
        baseValidator.validateString(description, 'description');
        baseValidator.validateDouble(aport, 'aport');
        baseValidator.validateDouble(objective, 'objective');
        const [userWallet, created] = await InvestmentModel.findOrCreate({
            where: {
                id_user: req.user.id
            },
            defaults: {
                amount: aport
            },
            transaction: t
        });
        const newInvestment = await InvestmentHistoryModel.create(
            {
                id_investments: userWallet?.id,
                name: name,
                subtitle: subtitle,
                description: description,
                aport: aport,
                objective: objective
            },
            { transaction: t }
        );
        //if userWallet already exists, update amount
        if (!created) {
            let newAmount = parseFloat(userWallet.amount) + parseFloat(aport)
            //round to 2 decimal places
            newAmount = Math.round(newAmount * 100) / 100;
            await InvestmentModel.update(
                { amount: newAmount },
                {
                    where: {
                        id: userWallet.id
                    },
                    transaction: t
                }
            );
        }
        await t.commit();
        res.status(200).send(newInvestment);
    } catch (error) {
        await t.rollback();
        res.status(400).send({
            error: 'Error creating new investment',
            detailed: error?.message
        });
    }
};


exports.deleteInvestment = async (req, res) => {
    try {
        const { id } = req.params;
        const id_user = req.user.id;
     
       //find one InvestmentModel that has id_user = id_user and has one InvestmentHistoryModel that has id = id
        const investment = await InvestmentModel.findOne({
            where: {
                id_user: id_user
            },
            include: [
                {
                    model: InvestmentHistoryModel,
                    as: 'investments',
                    where: {
                        id: id
                    }
                }
            ]
        });
        if (!investment) {
            return res.status(404).send({ error: 'Investment not found' });
        }
        //if the key investments is empty, it means that the investment does not exist
        if (investment.investments.length === 0) {
            return res.status(404).send({ error: 'Investment not found' });
        }
        const t = await sequelize.transaction();
        try {
            const investmentHistory = investment.investments[0];
            //update wallet amount
            let newAmount = parseFloat(investment.amount) - parseFloat(investmentHistory.aport);
            //round to 2 decimal places
            newAmount = Math.round(newAmount * 100) / 100;
            await InvestmentModel.update(
                { amount: newAmount },
                {
                    where: {
                        id: investment.id
                    },
                    transaction: t
                }
            );
            //delete investment
            await InvestmentHistoryModel.destroy(
                {
                    where: {
                        id: investmentHistory.id
                    }
                },
                { transaction: t }
            );
            await t.commit();
        } catch (error) {
            await t.rollback();
            res.status(400).send({
                error: 'Error deleting investment',
                detailed: error?.message
            });
        }
        res.status(200).send({ success: 'Investment deleted', investment: investment });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};


exports.editInvestment =  async (req, res) => {
    try {
        const { id } = req.params;
        const id_user = req.user.id;
        const {name, subtitle, description, aport, objective} = req.body;
        //just validate for the ones that are not null
        if (name) {
            baseValidator.validateString(name, 'name');
        }
        if (subtitle) {
            baseValidator.validateString(subtitle, 'subtitle');
        }
        if (description) {
            baseValidator.validateString(description, 'description');
        }
        if (aport) {
            baseValidator.validateDouble(aport, 'aport');
        }
        if (objective) {
            baseValidator.validateDouble(objective, 'objective');
        }
     
       //find one InvestmentModel that has id_user = id_user and has one InvestmentHistoryModel that has id = id
        const investment = await InvestmentModel.findOne({
            where: {
                id_user: id_user
            },
            include: [
                {
                    model: InvestmentHistoryModel,
                    as: 'investments',
                    where: {
                        id: id
                    }
                }
            ]
        });
        if (!investment) {
            return res.status(404).send({ error: 'Investment not found' });
        }
        //if the key investments is empty, it means that the investment does not exist
        if (investment.investments.length === 0) {
            return res.status(404).send({ error: 'Investment not found' });
        }
        const t = await sequelize.transaction();
        try {
            const investmentHistory = investment.investments[0];
            //if aport is being updated, update wallet amount
            if (aport) {
                //update wallet amount
                let newAmount = parseFloat(investment.amount) - parseFloat(investmentHistory.aport) + parseFloat(aport);
                //round to 2 decimal places
                newAmount = Math.round(newAmount * 100) / 100;
                await InvestmentModel.update(
                    { amount: newAmount },
                    {
                        where: {
                            id: investment.id
                        },
                        transaction: t
                    }
                );
            }
            let updateObject = {
                name: name || investmentHistory.name,
                subtitle: subtitle || investmentHistory.subtitle,
                description: description || investmentHistory.description,
                aport: aport || investmentHistory.aport,
                objective: objective || investmentHistory.objective
            }
            //update investment
            await InvestmentHistoryModel.update(
                updateObject,
                {
                    where: {
                        id: investmentHistory.id
                    },
                    transaction: t
                }
            );
            await t.commit();
            res.status(200).send({ success: 'Investment edited', investment: updateObject });
        } catch (error) {
            await t.rollback();
            res.status(400).send({
                error: 'Error editing investment',
                detailed: error?.message
            });
        }
    } catch (error) {
        res.status(500).send('Server Error');
    }
};


export default exports;