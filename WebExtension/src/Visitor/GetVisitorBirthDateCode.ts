import { DateTimePicker } from "@docsvision/webclient/Platform/DateTimePicker";

export function getVisitorBirthDateCode(birthDatePicker: DateTimePicker) {
    return birthDatePicker.value.toLocaleString('ru-RU',{
        year: '2-digit',
        month: '2-digit',
        day: '2-digit'
    }).replace(".", "");
}