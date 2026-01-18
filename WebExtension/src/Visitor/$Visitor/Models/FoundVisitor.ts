export interface FoundVisitor
{
    cardId: string;
    
    passport: string;
    
    phone: string;

    birthDate?: string;

    lastName: string;

    firstName: string;

    secondaryName: string;

    loadingError?: string;
}