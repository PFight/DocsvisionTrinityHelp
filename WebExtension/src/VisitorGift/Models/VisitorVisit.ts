import { VisitItem } from "./VisitItem";

export interface VisitorVisit {
    id: string;

    visitNumber: string;

    date: string;

    visitorId: string;

    comment: string;

    dutyId: string;

    dutyName: string;

    items: VisitItem[];
}