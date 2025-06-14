export enum StaffDocumentType
{
    Contract,
    ContractAddition,
    Order,
    Statement,
    VacationShedule
}

export interface CreateStaffDocumentRequest
{
    employeeId: string;
    eventName: string;
    documentType: StaffDocumentType;
    date: string;
}