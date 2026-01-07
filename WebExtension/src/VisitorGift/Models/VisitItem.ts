export interface VisitItem {
    code: string;

    name: string;

    recipient: string;
    
    recipientName: string;

    comment: string;

    count: string;

    source: ItemSource;
}

export enum ItemSource
{
    Defective = 0,
    Common = 1,
    Limited = 2,
    Special = 3
}