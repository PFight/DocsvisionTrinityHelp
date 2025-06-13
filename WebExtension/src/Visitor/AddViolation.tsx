import { ModalDialog } from "@docsvision/web/components/modals/modal-dialog";
import { ModalHost } from "@docsvision/webclient/Helpers/ModalHost";
import { CommonModalDialog } from "@docsvision/webclient/Helpers/ModalDialog/CommonModalDialog";
import { Table } from "@docsvision/webclient/Platform/Table";
import { LayoutControl } from "@docsvision/webclient/System/BaseControl";
import React from "react";
import { RadioGroup } from "@docsvision/webclient/Platform/RadioGroup";
import { Button } from "@docsvision/web/components/form/button";
import { TextBox } from "@docsvision/webclient/Platform/TextBox";
import { CheckBox } from "@docsvision/webclient/Platform/CheckBox";
import { StaffDirectoryItems, StaffDirectoryItemsSingle } from "@docsvision/webclient/BackOffice/StaffDirectoryItems";
import { $CurrentEmployee } from "@docsvision/webclient/StandardServices";
import { DateTimePicker } from "@docsvision/webclient/Platform/DateTimePicker";
import { $MessageWindow } from "@docsvision/web/components/modals/message-box";
import { $ControlStore } from "@docsvision/webclient/System/LayoutServices";
import { Dropdown } from "@docsvision/webclient/Platform/Dropdown";
import { Block } from "@docsvision/webclient/Platform/Block";

export function addViolation(sender: LayoutControl) {
    let controls = sender.layout.getService($ControlStore);
    let table = controls.get<Table>("violations");
    
    let violationType: RadioGroup = null;
    let fixatedBy: StaffDirectoryItemsSingle = null;
    let violationDescription: TextBox = null;
    let violationDate: DateTimePicker = null;

    let services = sender.getControlServices();

    let onSave = async () => {
        if (!violationType.hasValue()) {
            sender.getService($MessageWindow).showWarning("Введите, пожалуйста, тип нарушения!");
            return;
        }

        let rowId = await table.addRow() as string;
        let rowIndex = table.getRowIndex(rowId);

        let violationTypeCell = controls.get<Dropdown[]>("violationType")[rowIndex];
        let fixatedByCell = controls.get<StaffDirectoryItemsSingle[]>("fixatedBy")[rowIndex];
        let violationDescriptionCell = controls.get<TextBox[]>("violationDescription")[rowIndex];
        let violationDateCell = controls.get<DateTimePicker[]>("violationDate")[rowIndex];
        
        violationTypeCell.value = violationType.value;
        fixatedByCell.value = fixatedBy.value;
        violationDescriptionCell.value = violationDescription.value;
        violationDateCell.value = violationDate.value;

        table.save();

        commonHost.unmount();
    };

    let commonHost = new ModalHost("common-dialog", () => (
        <CommonModalDialog  header={"Добавление категории посетителя"} onClose={() => commonHost.unmount()} 
            isOpen={true} services={services} maxWidth="800px">
            <RadioGroup name="categoryModal" parent={null} ref={(el) => violationType = el} items={violationVariants} labelText="Тип нарушения" />
            <TextBox parent={null} ref={(el) => violationDescription = el} labelText="Описание нарушения" placeHolder="Описание нарушения" />
            <DateTimePicker parent={null} ref={(el) => violationDate = el} value={new Date()} labelText="Дата нарушения" />
            <StaffDirectoryItems parent={null} ref={(el) => fixatedBy = el as StaffDirectoryItemsSingle} labelText="Зафиксировал"
                multipleSelection={false} default={sender.getService($CurrentEmployee)} />
            <div className="ident" />
            <Button onClick={() => onSave()}>Добавить</Button>
        </CommonModalDialog>
    ));
    commonHost.mount();
}

const violationVariants = [
  {
    "key": "TheftCenter",
    "value": "Воровство вещей с ограниченной выдачей",
    "valueCode": 2
  },
  {
    "key": "TheftVisitors",
    "value": "Воровство у других посетителей",
    "valueCode": 1
  },
  {
    "key": "Offense",
    "value": "Грубое оскробление сотрудника или другого посетителя",
    "valueCode": 8
  },
  {
    "key": "Deception",
    "value": "Обман с целью обхода ограничений",
    "valueCode": 7
  },
  {
    "key": "Entrance",
    "value": "Проникновение в служебные помещения",
    "valueCode": 6
  },
  {
    "key": "Mess",
    "value": "Разбрасывание вещей",
    "valueCode": 3
  },
  {
    "key": "Swearing",
    "value": "Ругань, споры",
    "valueCode": 4
  },
  {
    "key": "Assault",
    "value": "Рукоприкладство",
    "valueCode": 5
  },
  {
    "key": "Other",
    "value": "Другое",
    "valueCode": 9
  },
];