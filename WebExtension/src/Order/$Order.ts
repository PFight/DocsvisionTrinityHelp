import { serviceName } from '@docsvision/web/core/services';
import { CreateOrderRequest } from './Models/CreateOrderRequest';
import { CreateOrderResponse } from './Models/CreateOrderResponse';

export interface IOrderService {
    create(request: CreateOrderRequest): Promise<CreateOrderResponse>;
}

export type $Order = { order: IOrderService };
export const $Order = serviceName((x: $Order) => x.order);