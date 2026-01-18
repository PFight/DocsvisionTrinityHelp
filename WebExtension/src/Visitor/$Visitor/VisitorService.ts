import { $RequestManager } from "@docsvision/webclient/System/$RequestManager";
import { IVisitorService } from "./$Visitor";
import { FindVisitorsRequest } from "./Models/FindVisitorsRequest";
import { FoundVisitor } from "./Models/FoundVisitor";

export class VisitorService implements IVisitorService {
    constructor(private services: $RequestManager) {
    }

    async find(request: FindVisitorsRequest): Promise<FoundVisitor[]> {
        return this.services.requestManager.post<FoundVisitor[]>(
            "api/Visitor/Find", JSON.stringify(request));
    }
}
