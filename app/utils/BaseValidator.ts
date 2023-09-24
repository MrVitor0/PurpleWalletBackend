class BaseValidator<T> {
  isInteger(value: any): boolean {
    return Number.isInteger(value);
  }

  isString(value: any): boolean {
    return typeof value === 'string';
  }

  isDate(value: any): boolean {
    return value instanceof Date;
  }

  isDouble(value: any): boolean {
    return typeof value === 'number' && !isNaN(value);
  }

  validateInteger(value: any): boolean {
    if (!this.isInteger(value)) {
      throw new Error('Value must be an integer.');
    }
    return true;
  }

  validateString(value: any): boolean {
    if (!this.isString(value)) {
      throw new Error('Value must be a string.');
    }
    return true;
  }

  validateDate(value: any): boolean {
    if (!this.isDate(value)) {
      throw new Error('Value must be a date.');
    }
    return true;
  }

  validateDouble(value: any): boolean {
    if (!this.isDouble(value)) {
      throw new Error('Value must be a double.');
    }
    return true;
  }

  validateModel(model: T): boolean {
    // Implemente validações específicas para cada campo do modelo aqui.
    // Você pode usar as funções de validação genéricas, como validateInteger, validateString, etc.
    return true; // ou lançar um erro, dependendo da validação
  }
}

export default BaseValidator;