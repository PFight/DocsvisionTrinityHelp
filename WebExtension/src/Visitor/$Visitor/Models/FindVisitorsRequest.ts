export interface FindVisitorsRequest
{    
    passport: string;
    
    phone: string;

    contactPhone: string;

    birthDate?: string;

    lastName: string;

    firstName: string;

    secondaryName: string;
}