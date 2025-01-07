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

export function addCategory(sender: LayoutControl) {
    let controls = sender.layout.getService($ControlStore);
    let table = controls.get<Table>("categories");
    
    let category: RadioGroup = null;
    let comment: TextBox = null;
    let verified: CheckBox = null;
    let verification: RadioGroup = null;
    let verficationDetails: TextBox = null;
    let verifiedBy: StaffDirectoryItemsSingle = null;
    let verifiedDate: DateTimePicker = null;

    let services = sender.getControlServices();

    let onSave = async () => {
        if (!category.hasValue()) {
            sender.getService($MessageWindow).showWarning("Выберите, категорию, пожалуйста!");
            return;
        }

        let rowId = await table.addRow() as string;
        let rowIndex = table.getRowIndex(rowId);
        let categoryCell = controls.get<Dropdown[]>("category")[rowIndex];
        let commentCell = controls.get<TextBox[]>("comment")[rowIndex];
        let categoryVerifiedCell = controls.get<CheckBox[]>("categoryVerified")[rowIndex];
        let verificationTypeCell = controls.get<Dropdown[]>("categoryVerificationType")[rowIndex];
        let verificationDescriptionCell = controls.get<TextBox[]>("verificationDescription")[rowIndex];
        let verifiedByCell = controls.get<StaffDirectoryItemsSingle[]>("verifiedBy")[rowIndex];
        let verificationDateCell = controls.get<DateTimePicker[]>("verificationDate")[rowIndex];

        categoryCell.value = category.value;
        commentCell.value = comment.value;
        categoryVerifiedCell.value = verified.value;
        verificationTypeCell.value = verification.value;
        verificationDescriptionCell.value = verficationDetails.value;
        verifiedByCell.value = verifiedBy.value;
        verificationDateCell.value = verifiedDate.value;

        table.save();

        commonHost.unmount();
    };

    let commonHost = new ModalHost("common-dialog", () => (
        <CommonModalDialog  header={"Добавление категории посетителя"} onClose={() => commonHost.unmount()} 
            isOpen={true} services={services} maxWidth="800px">
            <RadioGroup name="category" parent={null} ref={(el) => category = el} items={categories} labelText="Категория" />
            <TextBox parent={null} ref={(el) => comment = el} labelText="Комментарий" placeHolder="Комментарий" />
            <CheckBox parent={null} ref={(el) => verified = el} labelText="Проверено"  />
            <RadioGroup name="verficationType" parent={null} ref={(el) => verification = el} items={verifications} labelText="Как проверено?" />
            <TextBox parent={null} ref={(el) => verficationDetails = el} labelText="Подробности проверки" placeHolder="Подробности проверки" />
            <StaffDirectoryItems parent={null} ref={(el) => verifiedBy = el as StaffDirectoryItemsSingle} labelText="Кто проверил"
                multipleSelection={false} default={sender.getService($CurrentEmployee)} />
            <DateTimePicker parent={null} ref={(el) => verifiedDate = el} value={new Date()} labelText="Дата проверки" />
            <div className="ident" />
            <Button onClick={() => onSave()}>Добавить</Button>
        </CommonModalDialog>
    ));
    commonHost.mount();
}

const categories = [
    {
      "key": "BigFamily",
      "value": "Многодетные",
      "valueCode": 0
    },
    {
      "key": "Refugee",
      "value": "Беженец",
      "valueCode": 1
    },
    {
      "key": "SingleParent",
      "value": "Единственный родитель",
      "valueCode": 2
    },
    {
      "key": "Retired",
      "value": "Пенсионер",
      "valueCode": 3
    },
    {
      "key": "Homeless",
      "value": "Бездомный",
      "valueCode": 4
    },
    {
      "key": "Gypsies",
      "value": "Цыгане",
      "valueCode": 5
    },
    {
      "key": "Orthodox",
      "value": "Православный христианин",
      "valueCode": 6
    },
    {
      "key": "Priest",
      "value": "Священник / дьякон",
      "valueCode": 7
    },
    {
      "key": "DisableInFamily",
      "value": "Инвалид в семье",
      "valueCode": 8
    },
    {
      "key": "Poor",
      "value": "Малообеспеченный",
      "valueCode": 9
    }
];

const verifications =  [
    {
      "key": "Other",
      "value": "Другое",
      "valueCode": 5
    },
    {
      "key": "Personal",
      "value": "Знаю лично",
      "valueCode": 2
    },
    {
      "key": "ByLook",
      "value": "По виду",
      "valueCode": 3
    },
    {
      "key": "Recomendation",
      "value": "По рекомендации",
      "valueCode": 4
    },
    {
      "key": "Reference",
      "value": "Справка",
      "valueCode": 1
    }
  ];