import { OperationExecutingEventArgs } from "@docsvision/webclient/BackOffice/OperationExecutingEventArgs";
import { StateButtons } from "@docsvision/webclient/BackOffice/StateButtons";
import { DateTimePicker } from "@docsvision/webclient/Platform/DateTimePicker";
import { CancelableEventArgs } from "@docsvision/webclient/System/CancelableEventArgs";
import { $ControlStore } from "@docsvision/webclient/System/LayoutServices";

export async function onOrderStateChanging(sender: StateButtons, args: CancelableEventArgs<OperationExecutingEventArgs>) {
    const controls = sender.getService($ControlStore);
    args.wait();

    try {
        if (args.data.operationData.displayName == "В работу") {
            const dateStartCollection = controls.get<DateTimePicker>("dateStartCollection");
            dateStartCollection.value = new Date();
            await dateStartCollection.save();
        }
        if (args.data.operationData.displayName == "Дополнить") {
            const dateStartCollection = controls.get<DateTimePicker>("dateStartCollection");
            dateStartCollection.value = null
            await dateStartCollection.save();
        }
        if (args.data.operationData.displayName == "Собран") {
            const dateStartCollection = controls.get<DateTimePicker>("dateEndCollection");
            dateStartCollection.value = new Date();
            await dateStartCollection.save();
        }
        if (args.data.operationData.displayName == "Дособрать") {
            const dateStartCollection = controls.get<DateTimePicker>("dateEndCollection");
            dateStartCollection.value = null;
            await dateStartCollection.save();
        }
        if (args.data.operationData.displayName == "Выдан") {
            const completionDate = controls.get<DateTimePicker>("completionDate");
            completionDate.value = new Date();
            await completionDate.save();
        }
        
    } finally {
        args.accept();
    }
}