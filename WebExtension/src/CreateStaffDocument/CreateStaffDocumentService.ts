import { $RequestManager } from "@docsvision/webclient/System/$RequestManager";
import { ICreateStaffDocumentService } from "./$CreateStaffDocument";
import { CreateStaffDocumentRequest } from "./Models/CreateStaffDocumentRequest";
import { CreateStaffDocumentResponse } from "./Models/CreateStaffDocumentResponse";

export class CreateStaffDocumentService implements ICreateStaffDocumentService {
    constructor(private services: $RequestManager) {

    }

    async create(request: CreateStaffDocumentRequest): Promise<CreateStaffDocumentResponse> {
        return this.services.requestManager.post<CreateStaffDocumentResponse>(
            "api/CreateStaffDocument/Create", JSON.stringify(request));
    }
}
