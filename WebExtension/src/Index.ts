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


// Главная входная точка всего расширения
// Данный файл должен импортировать прямо или косвенно все остальные файлы, 
// чтобы rollup смог собрать их все в один бандл.

// Регистрация расширения позволяет корректно установить все
// обработчики событий, сервисы и прочие сущности web-приложения.
extensionManager.registerExtension({
    name: "TrinityHelp web extension",
    version: "1.0",
    globalEventHandlers: [ AddCategory, AddRecipient, AddViolation, CreateAccountingDocumentEventHandler, Open ],
    layoutServices: [ 
        Service.fromFactory($CreateAccountingDocument, (services: $RequestManager) => new CreateAccountingDocumentService(services))
    ],
    controls: [
    ]
})