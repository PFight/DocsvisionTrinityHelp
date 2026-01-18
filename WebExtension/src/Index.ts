import { extensionManager } from "@docsvision/webclient/System/ExtensionManager";
import { Service } from "@docsvision/web/core/services";
import { $RequestManager } from "@docsvision/webclient/System/$RequestManager";
import * as AddCategory from "./Visitor/AddCategory";
import * as AddRecipient from "./Visitor/AddRecipient";
import * as AddViolation from "./Visitor/AddViolation";
import * as Open from "./Visitor/Open";
import { $CreateAccountingDocument } from "./CreateAccountingDocument/$CreateAccountingDocument";
import { CreateAccountingDocumentService } from "./CreateAccountingDocument/CreateAccountingDocumentService";
import * as CreateAccountingDocumentEventHandler from "./CreateAccountingDocument/CreateAccountingDocumentEventHandler";
import { app } from "@docsvision/webclient/App";
import { ResetSearchHackResponseResolver } from "./Visitor/ResetSearchHackResponseResolver";
import { VisitorsFolderPluginFactory } from "./Visitor/VisitorsFolderPluginFactory";
import { $CreateStaffDocument } from "./CreateStaffDocument/$CreateStaffDocument";
import { services } from "@docsvision/webclient/Platform/TestUtils";
import { CreateStaffDocumentService } from "./CreateStaffDocument/CreateStaffDocumentService";
import * as CreateStaffDocumentEventHandler from "./CreateStaffDocument/CreateStaffDocumentEventHandler";
import * as OrderItems from "./Order/Items";
import * as OrderState from "./Order/StateChange";
import { $Order } from "./Order/$Order";
import { OrderService } from "./Order/OrderService";
import * as VisitorOrder from "./Order/Visitor";
import { VisitorGift } from "./VisitorGift/VisitorGift";
import * as Analyze from "./VisitorGift/VisitorGiftLogic/analyze";
import * as VisitorGiftHandlers from "./VisitorGift/VisitorGiftHandlers";
import { $Visitor } from "./Visitor/$Visitor/$Visitor";
import { VisitorService } from "./Visitor/$Visitor/VisitorService";
import * as DublicatePrevention from "./Visitor/DublicatePrevention";

// Главная входная точка всего расширения
// Данный файл должен импортировать прямо или косвенно все остальные файлы, 
// чтобы rollup смог собрать их все в один бандл.

// Регистрация расширения позволяет корректно установить все
// обработчики событий, сервисы и прочие сущности web-приложения.
extensionManager.registerExtension({
    name: "TrinityHelp web extension",
    version: "1.3",
    globalEventHandlers: [ AddCategory, AddRecipient, AddViolation, CreateAccountingDocumentEventHandler, Open,
        CreateStaffDocumentEventHandler, OrderItems, OrderState, VisitorOrder, Analyze, VisitorGiftHandlers,
        DublicatePrevention ],
    layoutServices: [ 
        Service.fromFactory($CreateAccountingDocument, (services: $RequestManager) => new CreateAccountingDocumentService(services)),
        Service.fromFactory($CreateStaffDocument, (services: $RequestManager) => new CreateStaffDocumentService(services)),
        Service.fromFactory($Order, (services: $RequestManager) => new OrderService(services)),
        Service.fromFactory($Visitor, (services: $RequestManager) => new VisitorService(services))
    ],
    controls: [
        { controlTypeName: "VisitorGift", constructor: VisitorGift }
    ],
    initialize() {
        app.folderPluginProvider.addFactory(new VisitorsFolderPluginFactory());
    }
})