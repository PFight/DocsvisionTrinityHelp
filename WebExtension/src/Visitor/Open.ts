import { CustomButton } from "@docsvision/webclient/Platform/CustomButton";
import { DateTimePicker } from "@docsvision/webclient/Platform/DateTimePicker";
import { TextBox } from "@docsvision/webclient/Platform/TextBox";
import { $ControlStore } from "@docsvision/webclient/System/LayoutServices";

const url = "https://pfight.github.io/tag-generator/visitor.html";

export function openVisitor(sender: CustomButton) {
    const phone = sender.getService($ControlStore).get<TextBox>("phone");
    const passport = sender.getService($ControlStore).get<TextBox>("passport");
    const birthDate = sender.getService($ControlStore).get<DateTimePicker>("birthDate");
    const personsTextBoxes = sender.getService($ControlStore).get<TextBox[]>("recipientFirstName");
    const firstName = sender.getService($ControlStore).get<TextBox>("firstName");

    let personsParam = "";
    let persons = [firstName.params.value];
    let recipients = personsTextBoxes?.filter(x => x.hasValue()).map(x => x.value);
    if (recipients) {
        persons = [...persons, ...recipients];
    }
    personsParam = "&persons=" + encodeURIComponent(JSON.stringify(persons));

    if (passport.hasValue()) {
        window.open(url + "?passport=" + encodeURIComponent(passport.value) + personsParam, "_blank");
    } else if (phone.hasValue()) {
        window.open(url + "?phone=" + encodeURIComponent(phone.value) + personsParam, "_blank");
    } else if (birthDate.hasValue()) {
        const dateStr = birthDate.value.toLocaleString('ru-RU',{
            year: '2-digit',
            month: '2-digit',
            day: '2-digit'
        }).replace(".", "");
        window.open(url + "?phone=" + encodeURIComponent(dateStr) + personsParam, "_blank");
    }
}