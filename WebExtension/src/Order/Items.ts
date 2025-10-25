import { GenModels } from "@docsvision/webclient/Generated/DocsVision.WebClient.Models";
import { IRowEventArgs } from "@docsvision/webclient/Platform/IRowEventArgs";
import { NumberControl } from "@docsvision/webclient/Platform/Number";
import { Table } from "@docsvision/webclient/Platform/Table";
import { $MessageBox } from "@docsvision/webclient/System/$MessageBox";
import { $ControlStore, $LayoutInfo } from "@docsvision/webclient/System/LayoutServices";

// On table row added
export async function generateItemNumber(sender: Table, args: IRowEventArgs) {
    const index = sender.params.rows.indexOf(args.rowId);
    const controls = sender.getService($ControlStore);
    const orderItemNumbers = controls.get<NumberControl[]>("orderItemNumber");

    orderItemNumbers[index].params.value = index + 1;

    if (sender.getService($LayoutInfo).action === GenModels.LayoutAction.Create) {
        for (let i = 0; i < orderItemNumbers.length; i++) {
            orderItemNumbers[i].params.value = i + 1;
        }
    }
}