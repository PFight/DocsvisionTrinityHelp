import { $RequestManager } from "@docsvision/webclient/System/$RequestManager";
import { LayoutControl } from "@docsvision/webclient/System/BaseControl";
import { IEventArgs } from "@docsvision/webclient/System/IEventArgs";;
import { $CardId } from "@docsvision/webclient/System/LayoutServices";
import { $CreateAccountingDocument } from "./$CreateAccountingDocument";
import { AccountingDocumentType } from "./Models/CreateAccountingDocumentRequest";
import { $RouterNavigation } from "@docsvision/webclient/System/$Router";
import { getNewCardEditRoute } from "@docsvision/webclient/Platform/NewCardRouteHelpers";
import { CustomButton } from "@docsvision/webclient/Platform/CustomButton";
import { GenModels } from "@docsvision/webclient/Generated/DocsVision.WebClient.Models";
import { getCardEditRoute } from "@docsvision/webclient/Platform/ExistingCardRouteHelpers";

export function createAct(sender: CustomButton, e: IEventArgs) {
    createAccountingDocument(sender, AccountingDocumentType.Act);
}

export function createUpd(sender: CustomButton, e: IEventArgs) {
    createAccountingDocument(sender, AccountingDocumentType.Upd);
}

export function createTorg12(sender: CustomButton, e: IEventArgs) {
    createAccountingDocument(sender, AccountingDocumentType.Torg12);
}

export function createContract(sender: CustomButton, e: IEventArgs) {
    createAccountingDocument(sender, AccountingDocumentType.Contract);
}

export function createAccount(sender: CustomButton, e: IEventArgs) {
    createAccountingDocument(sender, AccountingDocumentType.Account);
}

async function createAccountingDocument(sender: CustomButton, documentType: AccountingDocumentType) {
    let cardId = sender.layout.getService($CardId);
    sender.params.disabled = true;
    try {
        await sender.layout.saveCardEx();

        let createAccountingDocument = sender.layout.getService($CreateAccountingDocument);
        var result = await createAccountingDocument.create({
            paymentId: cardId,
            documentType
        });
        let nextRoute = getCardEditRoute(result.documentId);
        sender.layout.getService($RouterNavigation).openUrl(nextRoute, GenModels.OpenMode.NewTab);
        await sender.layout.reloadFromServer();
    } finally {
        sender.params.disabled = false;
    }
}
