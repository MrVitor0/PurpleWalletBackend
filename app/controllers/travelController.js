const travelPurchaseModel = require('../models/travelPurchaseModel');
const travelDebtsModel = require('../models/travelDebtsModel');

exports.savePurchase = async (req, res) => {
  let purchase; // Variável para armazenar a compra criada

  try {
    const { name, amount, debts } = req.body;
    // Validação dos campos obrigatórios
    if (!name || !amount || !Array.isArray(debts)) {
      return res.status(400).json({ error: 'Name, amount, and debts are required' });
    }
    // Verifica se a soma das dívidas é igual ao valor total com uma tolerância de 1 centavo
    const debtsTotal = debts.reduce((total, debt) => total + debt.amount, 0);
    const centThreshold = 0.05; // Limite de 1 centavo de diferença

    if (Math.abs(debtsTotal - amount) > centThreshold) {
        return res.status(400).json({ error: 'The sum of debts.amount must be equal to the amount' });
    }
    // Cria a compra
    purchase = await travelPurchaseModel.create({
      name,
      amount,
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
                    'isPaid'
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