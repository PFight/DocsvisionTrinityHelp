import { serviceName } from '@docsvision/web/core/services';;
import { FindVisitorsRequest } from './Models/FindVisitorsRequest';
import { FoundVisitor } from './Models/FoundVisitor';

export interface IVisitorService {
    find(request: FindVisitorsRequest): Promise<FoundVisitor[]>;
}

export type $Visitor = { visitor: IVisitorService };
export const $Visitor = serviceName((x: $Visitor) => x.visitor);