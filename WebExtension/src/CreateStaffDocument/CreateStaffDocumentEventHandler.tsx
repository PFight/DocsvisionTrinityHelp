import { LayoutControl } from "@docsvision/webclient/System/BaseControl";
;
import { $ControlStore, $RowId } from "@docsvision/webclient/System/LayoutServices";
import { $CreateStaffDocument } from "./$CreateStaffDocument";
import { StaffDocumentType } from "./Models/CreateStaffDocumentRequest";
import { $RouterNavigation } from "@docsvision/webclient/System/$Router";
import { CustomButton } from "@docsvision/webclient/Platform/CustomButton";
import { GenModels } from "@docsvision/webclient/Generated/DocsVision.WebClient.Models";
import { getCardEditRoute } from "@docsvision/webclient/Platform/ExistingCardRouteHelpers";
import { Table } from "@docsvision/webclient/Platform/Table";
import { CommonModalDialog } from "@docsvision/webclient/Helpers/ModalDialog/CommonModalDialog";
import React, { useState } from "react";
import { ModalHost } from "@docsvision/webclient/Helpers/ModalHost";
import { TextBox } from "@docsvision/webclient/Platform/TextBox";
import { CardLink } from "@docsvision/webclient/Platform/CardLink";
import { DateTimePicker } from "@docsvision/webclient/Platform/DateTimePicker";
import { IDataChangedEventArgs } from "@docsvision/webclient/System/IDataChangedEventArgs";
import { Dropdown } from "@docsvision/webclient/Platform/Dropdown";
import { Block } from "@docsvision/webclient/Platform/Block";
import { $MessageWindow } from "@docsvision/web/components/modals/message-box";
import { showIf } from "@docsvision/webclient/System/CssUtils";
import { toServerDateString } from "@docsvision/webclient/System/DateTimeUtils";
import { EditMode } from "@docsvision/webclient/System/EditMode";

enum EventTypes {
    Boarding,
    Unboarding,
    Vacation,
    LeaveOfAbsence,
    ChangeRate,
    ChangePosition,
    ChangeSalary,
    ExtraCharge,
    ChangeSalaryAccount
}

const needContractEventTypes = [EventTypes.Boarding, 
    EventTypes.ChangePosition, EventTypes.ExtraCharge, EventTypes.ChangeSalary];
const needStatementEventTypes = [
    EventTypes.ChangePosition, EventTypes.ChangeRate,
    EventTypes.ChangeSalaryAccount, EventTypes.LeaveOfAbsence,
    EventTypes.Unboarding, EventTypes.Vacation
]

export function addStaffDocument(sender: LayoutControl) {
    let controls = sender.layout.getService($ControlStore);
    let table = controls.get<Table>("documentsTable");
    
    let type: EventTypes = null;

    let eventType: Dropdown = null;
    let eventName: TextBox = null;
    let eventDescription: TextBox = null;
    let eventDate: DateTimePicker = null;
    let statementLink: CardLink = null;
    let orderLink: CardLink = null;
    let contractLink: CardLink = null;

    let services = sender.getControlServices();

    let create = async (documentType: StaffDocumentType, eventType: EventTypes) => {
        if (!eventDate.hasValue()) {
            sender.getService($MessageWindow).showWarning("Укажите, пожалуйста, дату!");
            return;
        }
        let createStaffDocument = sender.layout.getService($CreateStaffDocument);
        let employeeId = sender.getService($RowId);
        var result = await createStaffDocument.create({
            employeeId,
            documentType,
            eventName: eventName.value,
            date: toServerDateString(eventDate.value, services)
        });
        const resultLink = {
            cardId: result.documentId,
            cardDigest: result.documentName,
            cardViewAllowed: true,
            mainFileReadAllowed: true
        };
        if (documentType == StaffDocumentType.Statement) {
            statementLink.value = resultLink;
        } else if (documentType == StaffDocumentType.Order) {
            orderLink.value = resultLink;
        } else {
            contractLink.value = resultLink;
        }
        let nextRoute = getCardEditRoute(result.documentId);
        sender.layout.getService($RouterNavigation).openUrl(nextRoute, GenModels.OpenMode.NewTab);
    }
    let onSave = async (type: EventTypes) => {
        if (type === null) {
            sender.getService($MessageWindow).showWarning("Выберите, пожалуйста, тип события!");
            return;
        }
        if (!eventDate.hasValue()) {
            await sender.getService($MessageWindow).showWarning("Укажите, пожалуйста, дату!");
            return;
        }
        if (needContractEventTypes.includes(type) && !contractLink.hasValue()) {
            await sender.getService($MessageWindow).showConfirmation("Не указан договор/доп. соглашение, продолжить?");
        }
        if (needStatementEventTypes.includes(type) && !statementLink.hasValue()) {
            await sender.getService($MessageWindow).showConfirmation("Не указано заявление сотрудника, продолжить?");
        }
        if (!orderLink.hasValue()) {
            await sender.getService($MessageWindow).showConfirmation("Не указан приказ, продолжить?");
        }        

        let rowId = await table.addRow() as string;
        let rowIndex = table.getRowIndex(rowId);

        let eventNameCell = controls.get<TextBox[]>("eventName")[rowIndex];
        let eventCommentCell = controls.get<TextBox[]>("eventComment")[rowIndex];
        let eventDateCell = controls.get<DateTimePicker[]>("eventDate")[rowIndex];
        let statementLinkCell = controls.get("statementLink")[rowIndex] as CardLink;
        let orderLinkCell = controls.get("orderLink")[rowIndex] as CardLink;
        let contractLinkCell = controls.get("contractLink")[rowIndex] as CardLink;
        
        eventNameCell.value = eventName.value;
        eventCommentCell.value = eventDescription.value;
        eventDateCell.value = eventDate.value;
        statementLinkCell.value = statementLink.value;
        orderLinkCell.value = orderLink.value;
        contractLinkCell.value = contractLink.value;

        table.save();

        commonHost.unmount();
    };

    let typeChanged = (sender, args: IDataChangedEventArgs) => {
        const element = eventVariants.find(x => x.key == args.newValue);
        type = element.valueCode;
        eventName.value = element.value;
        commonHost.forceUpdate();
    }

    let commonHost = new ModalHost("common-dialog", () => (
        <CommonModalDialog  header={"Добавление кадрового документа"} onClose={() => commonHost.unmount()} 
            isOpen={true} services={services} maxWidth="800px">
            <Dropdown name="categoryModal" parent={null} ref={(el) => eventType = el} 
                items={eventVariants} labelText="Тип события" placeHolder="Выберите тип события"
                dataChanged={typeChanged} />
            <div className={showIf(type !== null)}>
                <TextBox parent={null} ref={(el) => eventName = el} labelText="Событие" placeHolder="Событие" />
                <TextBox parent={null} ref={(el) => eventDescription = el} labelText="Описание" placeHolder="Описание" />
                <DateTimePicker parent={null} ref={(el) => eventDate = el} labelText="Дата" 
                    placeHolder="Дата" dateTimePickerMode={GenModels.DateTimePickerType.Date} />
                <div className={showIf(needStatementEventTypes.includes(type))} >
                    <CardLink name="statementLink" editMode={EditMode.Edit} parent={null} 
                        ref={(el) => statementLink = el} labelText="Заявление"
                        emptyText={"Выбрать заявление"} />
                    <CustomButton parent={null} click={() => create(StaffDocumentType.Statement, type)} 
                        text="Создать заявление"></CustomButton>
                </div>
                <CardLink name="orderLink" editMode={EditMode.Edit} parent={null} 
                    ref={(el) => orderLink = el} labelText="Приказ"
                    emptyText={"Выбрать приказ"} />
                <CustomButton click={() => create(StaffDocumentType.Order, type)} text="Создать приказ"></CustomButton>
                <div className={showIf(needContractEventTypes.includes(type))} >
                    <CardLink name="contractLink" editMode={EditMode.Edit} parent={null} 
                        ref={(el) => contractLink = el} 
                        labelText={(type == EventTypes.Boarding ? "Договор" : "Доп. соглашение")} 
                        emptyText={"Выбрать договор"} />
                    <CustomButton parent={null} 
                        click={() => create(type == EventTypes.Boarding ? StaffDocumentType.Contract : StaffDocumentType.ContractAddition, type)}
                        text={"Создать " + (type == EventTypes.Boarding ? "договор" : "доп. соглашение")} ></CustomButton>
                </div>
                <div className="ident" />
                <CustomButton click={() => onSave(type)} text="Добавить событие"></CustomButton>
            </div>
        </CommonModalDialog>
    ));
    commonHost.mount();
}

const eventVariants = [
  {
    "key": "Boarding",
    "value": "прием на работу",
    "valueCode": EventTypes.Boarding
  },
  {
    "key": "ChangePosition",
    "value": "переход на другую должность",
    "valueCode": EventTypes.ChangePosition
  },
  {
    "key": "ChangeRate",
    "value": "изменение ставки",
    "valueCode": EventTypes.ChangeRate
  },
  {
    "key": "ChangeSalary",
    "value": "изменение зарплаты",
    "valueCode": EventTypes.ChangeSalary
  },
  {
    "key": "ChangeSalaryAccount",
    "value": "изменение счета для зарплаты",
    "valueCode": EventTypes.ChangeSalaryAccount
  },
  {
    "key": "ExtraCharge",
    "value": "изменение надбавки",
    "valueCode": EventTypes.ExtraCharge
  },
  {
    "key": "LeaveOfAbence",
    "value": "отпуск за свой счет",
    "valueCode": EventTypes.LeaveOfAbsence
  },
  {
    "key": "Unboarding",
    "value": "увольнение",
    "valueCode": EventTypes.Unboarding
  },
  {
    "key": "Vacation",
    "value": "Отпуск",
    "valueCode": EventTypes.Vacation
  }
];