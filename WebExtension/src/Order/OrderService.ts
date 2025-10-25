import { $RequestManager } from "@docsvision/webclient/System/$RequestManager";
import { IOrderService } from "./$Order";
import { CreateOrderRequest } from "./Models/CreateOrderRequest";
import { CreateOrderResponse } from "./Models/CreateOrderResponse";

export class OrderService implements IOrderService {
    constructor(private services: $RequestManager) {

    }

    async create(request: CreateOrderRequest): Promise<CreateOrderResponse> {
        return this.services.requestManager.post<CreateOrderResponse>(
            "api/Order/Create", JSON.stringify(request));
    }
}
