export enum AccountingDocumentType
{
    Act,
    Upd,
    Torg12,
    Account,
    Contract
}

export interface CreateAccountingDocumentRequest
{
    paymentId: string;
    documentType: AccountingDocumentType;
}