import BaseValidator from './BaseValidator';
import BankingBillsInterface from '../types/BankingBills';

class BankingBillsValidator extends BaseValidator<BankingBillsInterface> {
  static validateTypeTransaction(value: any): boolean {
    // Implemente sua lógica de validação específica para o campo type_transaction aqui.
    // Por exemplo, você pode verificar se o valor está em um conjunto específico de valores permitidos.
    // Se não passar na validação, você pode lançar um erro.
    return true; // ou lançar um erro, dependendo da validação
  }
}

export default BankingBillsValidator;
