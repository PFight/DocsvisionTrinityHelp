import { serviceName } from '@docsvision/web/core/services';
import { CreateStaffDocumentRequest } from './Models/CreateStaffDocumentRequest';
import { CreateStaffDocumentResponse } from './Models/CreateStaffDocumentResponse';

export interface ICreateStaffDocumentService {
    create(request: CreateStaffDocumentRequest): Promise<CreateStaffDocumentResponse>;
}

export type $CreateStaffDocument = { createStaffDocument: ICreateStaffDocumentService };
export const $CreateStaffDocument = serviceName((x: $CreateStaffDocument) => x.createStaffDocument);