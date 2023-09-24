import bankingModel from '../models/bankingModel.js';
import bankingBillsModel from '../models/bankingBillsModel.js';
const exports = {};
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

      
  
    res.json(banking);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }

};

export default exports;