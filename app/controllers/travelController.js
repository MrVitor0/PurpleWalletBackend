import travelPurchaseModel from '../models/travel/travelPurchaseModel.js'
import travelDebtsModel from '../models/travel/travelDebtsModel.js'
import userModel from '../models/userModel.js'

import Sequelize from 'sequelize'
import sequelize from '../../config/database.js'

const Op = Sequelize.Op;


const exports = {};
exports.savePurchase = async (req, res) => {
  let purchase; // Variável para armazenar a compra criada

  try {
    const { name, amount, debts, payerId } = req.body;
    // Validação dos campos obrigatórios
    if (!name || !amount || !payerId || !Array.isArray(debts)) {
      return res.status(400).json({ error: 'Um ou mais campos estão vazios' });
    }
    // Verifica se a soma das dívidas é igual ao valor total com uma tolerância de 1 centavo
    const debtsTotal = debts.reduce((total, debt) => total + debt.amount, 0);
    const centThreshold = 0.05; // Limite de 1 centavo de diferença

    if (Math.abs(debtsTotal - amount) > centThreshold) {
        return res.status(400).json({ error: 'A soma dos débitos deve ser igual a do valor total.' });
    }
    // Cria a compra
    purchase = await travelPurchaseModel.create({
      name,
      amount,
      payerId
    });
    // Gera as dívidas dos usuários
    const purchaseId = purchase.id;
    const debtPromises = debts.map(async (debt) => {
      try {
        await travelDebtsModel.create({
          id_user: debt.id,
          id_trv_purchase: purchaseId,
          amount: debt.amount,
        });
      } catch (error) {
        console.error(error);
        // Se ocorrer um erro, exclua a compra e as dívidas criadas
        await travelDebtsModel.destroy({ where: { id_trv_purchase: purchaseId } });
        await travelPurchaseModel.destroy({ where: { id: purchaseId } });
        throw new Error('Failed to create debt');
      }
    });
    // Aguarda todas as promessas de criação de dívida serem resolvidas
    await Promise.all(debtPromises);
    res.status(201).json(purchase);
  } catch (error) {
    console.error(error);
    // Se ocorrer um erro, exclua a compra criada
    if (purchase) {
      await travelPurchaseModel.destroy({ where: { id: purchase.id } });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.retrievePurchases = async (req, res) => {
    try {
        const purchases = await travelDebtsModel.findAll({
            where: { id_user: req.user.id },
            attributes: ['id', 'amount'],
            include: [{
                model: travelPurchaseModel,
                as: 'travelPurchase',
                attributes: [
                    ['amount', 'total_amount'],
                    'name',
                    'createdAt',
                    ['id', 'purchase_id'],
                    'payerId'
                ],
            }],
            order: [[{ model: travelPurchaseModel, as: 'travelPurchase' }, 'createdAt', 'DESC']]
        });
        //sum the total amount of each purchase
        let total_debts = 0;
        purchases.forEach((purchase) => {
            total_debts += purchase.amount;
        });
        res.status(200).json({ total_debts, purchases });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.retrieveUserDebts = async (req, res) => {
  try {
    const _debts = await travelDebtsModel.findAll({
      where: { id_user: req.user.id },
      attributes: ['id', 'amount'],
      include: [{
        model: travelPurchaseModel,
        as: 'travelPurchase',
        attributes: [
          'createdAt',
          'name',
          ['id', 'purchase_id'],
          'payerId'
        ],
        where: {
          payerId: { [Op.ne]: req.user.id }
        },  
        include: [{
          model: userModel,
          as: 'payer',
          attributes: ['name', 'email']
        }]
      }],
      order: [[{ model: travelPurchaseModel, as: 'travelPurchase' }, 'createdAt', 'DESC']]
    });

    // Create a map to accumulate debts for each payer
    const payerDebtsMap = new Map();

    _debts.forEach((purchase) => {
      const payerId = purchase.travelPurchase.payerId;
      const purchaseName = purchase.travelPurchase.name;
      const amount = purchase.amount;

      if (payerDebtsMap.has(payerId)) {
        // If the payer already exists in the map, add the amount to their debt
        payerDebtsMap.get(payerId).amount += amount;
      } else {
        // If the payer doesn't exist in the map, create a new entry
        payerDebtsMap.set(payerId, {
          id: payerId,
          name: purchase.travelPurchase.payer.name,
          email: purchase.travelPurchase.payer.email,
          amount: amount,
          last_purchase: purchaseName,
          lastCreatedAt: purchase.travelPurchase.createdAt,
        });
      }
    });

    // Convert the map values into an array
    const debts = [...payerDebtsMap.values()];

    // Calculate total_debts
    let total_debts = 0;
    debts.forEach((debt) => {
      total_debts += debt.amount;
    });

    res.status(200).json({ total_debts, debts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.retrieveEarnings = async (req, res) => {
  try {
    let userId = req.user.id;
    const query = `
          SELECT
              MIN(a.id) as trl_debts_id,
              SUM(a.amount) as trl_debts_amount,
              b.createdAt as trl_purchase_createdAt,
              b.name as trl_last_purchase_name,
              u.name AS user_name,
              u.id as user_id
          FROM
              tb_trl_debts a
          JOIN
              tb_trl_purchases b ON a.id_trv_purchase = b.id
          JOIN
              tb_users u ON a.id_user = u.id
          WHERE
              b.payerId = ${userId} AND a.id_user != ${userId}
          GROUP BY
              u.id, u.name;
    `;

    let response = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
    
    res.status(200).json({ response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.deletePurchase = async (req, res) => {
  try {
    const purchaseId = req.params.id;
    const purchase = await travelPurchaseModel.findOne({
      where: { id: purchaseId },
      attributes: ['id', 'payerId']
    });
    if (!purchase) {
      return res.status(404).json({ error: 'Compra não encontrada' });
    }
    if (purchase.payerId !== req.user.id) {
      return res.status(406).json({ error: 'O direito de excluir a compra é exclusivo do usuário que efetuou o pagamento.' });
    }
    await travelDebtsModel.destroy({ where: { id_trv_purchase: purchaseId } });
    await travelPurchaseModel.destroy({ where: { id: purchaseId } });
    res.status(200).json({ message: 'Compra excluída com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export default exports;