import baseValidator from './baseValidator.js';

class bankingBillsValidator extends baseValidator {

    static TYPE_TRANSACTION = {
        DEPOSIT: 1,
        WITHDRAW: 2,
        TRANSFER: 3
    }
    static TYPE_PAYMENT = {
        CREDIT_CARD: 1,
        DEBIT_CARD: 2,
        MONEY: 3
    }
    static getTransactionType(type_transaction) {
        switch (type_transaction) {
            case '1':
                return 'banking.DEPOSIT';
            case '2':
                return 'banking.WITHDRAW';
            case '3':
                return 'banking.TRANSFER';
            default:
                return 'banking.UNKNOWN';
        }
    }
    static getPaymentType(type_payment) {
        switch (type_payment) {
            case '1':
                return 'banking.CREDIT_CARD';
            case '2':
                return 'banking.DEBIT_CARD';
            case '3':
                return 'banking.MONEY';
            default:
                return 'banking.UNKNOWN';
        }
    }

    static validate_type_transaction(value, name) {
        bankingBillsValidator.isInteger(value, name);
        //check if match with any TYPE_TRANSACTION, check if value has a key
        if (!Object.keys(bankingBillsValidator.TYPE_TRANSACTION).includes(value.toString())) {
            throw new Error(`${name} option is not valid`);
        }
       return true
    }
    static validate_type_payment(value, name) {
        bankingBillsValidator.isInteger(value, name);
        //check if match with any TYPE_PAYMENT, check if value has a key
        if (!Object.keys(bankingBillsValidator.TYPE_PAYMENT).includes(value.toString())) {
            throw new Error(`${name} option is not valid`);
        }
        return true
    }
}

export default bankingBillsValidator;