import { serviceName } from '@docsvision/web/core/services';
import { CreateAccountingDocumentRequest } from './Models/CreateAccountingDocumentRequest';
import { CreateAccountingDocumentResponse } from './Models/CreateAccountingDocumentResponse';

export interface ICreateAccountingDocumentService {
    create(request: CreateAccountingDocumentRequest): Promise<CreateAccountingDocumentResponse>;
}

export type $CreateAccountingDocument = { createAccountingDocument: ICreateAccountingDocumentService };
export const $CreateAccountingDocument = serviceName((x: $CreateAccountingDocument) => x.createAccountingDocument);