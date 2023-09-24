interface BankingBill {
    id: number;
    id_banking: number;
    type_transaction: number;
    type_payment: number;
    name: string;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
}
  
export default BankingBill;