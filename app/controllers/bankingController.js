const BankingModel = require('../models/bankingModel');
const bankingBillsModel = require('../models/bankingBillsModel');

exports.getUserBalance = async (req, res) => {
  try {
    //get a banking model list
    const banking = await BankingModel.findAll({
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


