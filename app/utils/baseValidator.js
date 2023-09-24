class baseValidator {
    static isInteger(value) {
      return Number.isInteger(value);
    }
    static isString(value) {
      return typeof value === 'string';
    }
    static isDate(value) {
      return value instanceof Date;
    }
    static isDouble(value) {
      return typeof value === 'number' && !isNaN(value);
    }
    static validateInteger(value, name) {
      if (!this.isInteger(value)) {
        try{
          parseInt(value);
        }
        catch(error){
          throw new Error(`${name} must be an integer.`);
        }
      }
      return true;
    }
    static validateString(value, name) {
      if (!this.isString(value)) {
        try{
          value.toString()
        }
        catch(error){
          throw new Error(`${name} must be an string.`);
        }
      }
      return true;
    }
    static validateDate(value, name) {
      if (!this.isDate(value)) {
        throw new Error(`${name} must be a date.`);      
      }
      return true;
    }
    static validateDouble(value, name) {
      if (!this.isDouble(value)) {
        try{
          parseFloat(value);
        }
        catch(error){
          throw new Error(`${name} must be an double.`);
        }
      }
      return true;
    }
}

export default baseValidator;