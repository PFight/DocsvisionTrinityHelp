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
import { NumberControl } from "@docsvision/webclient/Platform/Number";

export function addRecipient(sender: LayoutControl) {
    let controls = sender.layout.getService($ControlStore);
    let table = controls.get<Table>("recipients");
    
    let name: TextBox = null;
    let lastName: TextBox = null;
    let sex: RadioGroup = null;
    let age: NumberControl = null;
    let birthYear: NumberControl = null;
    let relation: RadioGroup = null;
    let comment: TextBox = null;
    let verified: CheckBox = null;
    let verification: RadioGroup = null;
    let verficationDetails: TextBox = null;
    let verifiedBy: StaffDirectoryItemsSingle = null;
    let verifiedDate: DateTimePicker = null;

    let services = sender.getControlServices();

    let onSave = async () => {
        if (!name.hasValue()) {
            sender.getService($MessageWindow).showWarning("Введите имя, пожалуйста!");
            return;
        }

        let rowId = await table.addRow() as string;
        let rowIndex = table.getRowIndex(rowId);

        let nameCell = controls.get<TextBox[]>("recipientFirstName")[rowIndex];
        let lastNameCell = controls.get<TextBox[]>("recipientLastName")[rowIndex];
        let sexCell = controls.get<Dropdown[]>("recipientSex")[rowIndex];
        let recipientBirthYearCell = controls.get<NumberControl[]>("recipientBirthYear")[rowIndex];
        let relationshipCell = controls.get<TextBox[]>("relationship")[rowIndex];
        let commentCell = controls.get<TextBox[]>("recipientComment")[rowIndex];
        let recipientVerifiedCell = controls.get<CheckBox[]>("recipientVerified")[rowIndex];
        let verificationTypeCell = controls.get<Dropdown[]>("recipientVerificationType")[rowIndex];
        let verificationDescriptionCell = controls.get<TextBox[]>("recipientVerificationDescription")[rowIndex];
        let verifiedByCell = controls.get<StaffDirectoryItemsSingle[]>("recipientVerifiedBy")[rowIndex];
        let verificationDateCell = controls.get<DateTimePicker[]>("recipientVerificationDate")[rowIndex];

        nameCell.value = name.value;
        lastNameCell.value = lastName.value;
        sexCell.value = sex.value;
        if (age.hasValue()) {
          recipientBirthYearCell.value = (new Date()).getFullYear() - age.value;
        }
        if (birthYear.hasValue()) {
          recipientBirthYearCell.value = birthYear.value;
        }
        relationshipCell.value = relation.value;
        commentCell.value = comment.value;
        recipientVerifiedCell.value = verified.value;
        verificationTypeCell.value = verification.value;
        verificationDescriptionCell.value = verficationDetails.value;
        verifiedByCell.value = verifiedBy.value;
        verificationDateCell.value = verifiedDate.value;

        table.save();

        commonHost.unmount();
    };

    let commonHost = new ModalHost("common-dialog", () => (
        <CommonModalDialog  header={"Добавление получателя"} onClose={() => commonHost.unmount()} 
            isOpen={true} services={services} maxWidth="800px">
            <TextBox parent={null} ref={(el) => name = el} labelText="Имя" placeHolder="Имя" />
            <TextBox parent={null} ref={(el) => lastName = el} labelText="Фамилия (если отличается)" placeHolder="Фамилия (если отличается)" />
            <RadioGroup name="sexModal" parent={null} ref={(el) => sex = el} items={sexVariants} labelText="Пол" />
            <NumberControl parent={null} ref={(el) => age = el} labelText="Возраст (для детей)" placeHolder="Возраст (для детей)" />
            <NumberControl parent={null} ref={(el) => birthYear = el} labelText="Год рождения (для детей)" placeHolder="Год рождения (для детей)" />
            <RadioGroup name="relationModal" parent={null} ref={(el) => relation = el} items={realtionshipVariants} labelText="Связь" />
            <TextBox parent={null} ref={(el) => comment = el} labelText="Комментарий" placeHolder="Комментарий" />
            <CheckBox parent={null} ref={(el) => verified = el} labelText="Проверено"  />
            <RadioGroup name="verficationTypeModal" parent={null} ref={(el) => verification = el} items={verifications} labelText="Как проверено?" />
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

const sexVariants = [
  {
    "key": "Male",
    "value": "М",
    "valueCode": 0
  },
  {
    "key": "Female",
    "value": "Ж",
    "valueCode": 1
  }
];

const realtionshipVariants  = [
  {
    "key": "Child",
    "value": "Ребенок",
    "valueCode": 0
  },
  {
    "key": "Spouse",
    "value": "Супруг(а)",
    "valueCode": 1
  },
  {
    "key": "Grandson",
    "value": "Внук",
    "valueCode": 2
  },
  {
    "key": "GreatGrandson",
    "value": "Правнук",
    "valueCode": 3
  },
  {
    "key": "Godson",
    "value": "Крестник",
    "valueCode": 4
  },
  {
    "key": "Relative",
    "value": "Родственник",
    "valueCode": 5
  },
  {
    "key": "Friend",
    "value": "Друг",
    "valueCode": 6
  },
  {
    "key": "Familiar",
    "value": "Знакомый",
    "valueCode": 7
  }
];

const verifications =  [
  {
    "key": "Pasport",
    "value": "По паспорту",
    "valueCode": 1
  },
  {
    "key": "Personal",
    "value": "Знаю лично",
    "valueCode": 4
  },
  {
    "key": "Recomendation",
    "value": "Рекомендация",
    "valueCode": 5
  },
  {
    "key": "Other",
    "value": "Другое",
    "valueCode": 6
  },
  {
    "key": "Certificate",
    "value": "По свидетельству",
    "valueCode": 2
  },
  {
    "key": "OtherDocument",
    "value": "По другому документу",
    "valueCode": 3
  }
];