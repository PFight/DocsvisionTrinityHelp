import { $RequestManager } from "@docsvision/webclient/System/$RequestManager";
import { ICreateAccountingDocumentService } from "./$CreateAccountingDocument";
import { CreateAccountingDocumentRequest } from "./Models/CreateAccountingDocumentRequest";
import { CreateAccountingDocumentResponse } from "./Models/CreateAccountingDocumentResponse";

export class CreateAccountingDocumentService implements ICreateAccountingDocumentService {
    constructor(private services: $RequestManager) {

    }

    async create(request: CreateAccountingDocumentRequest): Promise<CreateAccountingDocumentResponse> {
        return this.services.requestManager.post<CreateAccountingDocumentResponse>(
            "api/CreateAccountingDocument/Create", JSON.stringify(request));
    }
}
