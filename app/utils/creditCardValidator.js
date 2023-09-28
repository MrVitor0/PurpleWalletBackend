import baseValidator from './baseValidator.js';

class creditCardValidator extends baseValidator {
    
    CREDIT_BILL = {
        isClosed: false,
        isPaid: false,
        amount: 0,
        reference: "2023-01-01T00:00:00",
    }

    CREDIT_PURCHASE = {
        name: "Sample Bill",
        amount: 0,
        reference: "2023-01-01T00:00:00",
    }

    static isISO8601(value, name) {
        if (!value.match(/\d{4}-\d{2}-\d{2}/)) {
            throw new Error(`${name} is not in ISO 8601 format.`);
        }
        return true;
    }


    /**
     * @description This function will validate the credit card bill data
     * @param {*} data 
     * @returns {object} - Returns a credit card bill object
     */
    validateCreditCardBill(data) {
        let creditBill = {};
        const fieldsToCopy = ['isClosed', 'isPaid', 'amount', 'reference'];
        for (const field of fieldsToCopy) {
            if (field === 'reference') {
                if (data.reference && creditCardValidator.isISO8601(data.reference)) {
                    // Se houver uma referência, use o mês e o ano dela, mas defina o dia como o primeiro dia do mês.
                    const referenceDate = new Date(data.reference);
                    creditBill.reference = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1).toISOString();
                } else {
                    // Caso contrário, use o primeiro dia do mês atual como referência.
                    const currentDate = new Date();
                    creditBill.reference = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
                }
            } else if (field === 'amount') {
                creditBill.amount = creditCardValidator.isDouble(parseFloat(data.amount)) ? data.amount : this.CREDIT_BILL.amount;
            } else {
                creditBill[field] = data[field] || this.CREDIT_BILL[field];
            }
        }
        return creditBill;
    }
    

    /**
     * @description This function will validate the credit card purchase data
     * @param {*} data 
     * @returns {object} - Returns a credit card bill object
     */
    validateCreditCardPurchase(data) {
        let creditPurchase = {};
        const fieldsToCopy = ['name', 'amount', 'reference'];
        for (const field of fieldsToCopy) {
            if (field === 'reference') {
                if (data.reference && creditCardValidator.isISO8601(data.reference)) {
                    // Se houver uma referência, use o mês e o ano dela, mas defina o dia como o primeiro dia do mês.
                    const referenceDate = new Date(data.reference);
                    creditPurchase.reference = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDay()).toISOString();
                } else {
                    // Caso contrário, use o primeiro dia do mês atual como referência.
                    const currentDate = new Date();
                    creditPurchase.reference = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
                }
            } else if (field === 'amount') {
                creditPurchase.amount = creditCardValidator.isDouble(parseFloat(data.amount)) ? data.amount : this.CREDIT_PURCHASE.amount;
               
            } else {
                creditPurchase[field] = data[field] || this.CREDIT_PURCHASE[field];
            }
        }
        return creditPurchase;
    }
    


}

export default creditCardValidator;