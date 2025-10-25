import { CustomButton } from "@docsvision/webclient/Platform/CustomButton";
import { $Order } from "./$Order";
import { $CardId, $ControlStore } from "@docsvision/webclient/System/LayoutServices";
import { TextBox } from "@docsvision/webclient/Platform/TextBox";
import { $MessageBox } from "@docsvision/webclient/System/$MessageBox";
import { getCardEditRoute } from "@docsvision/webclient/Platform/ExistingCardRouteHelpers";
import { $RouterNavigation } from "@docsvision/webclient/System/$Router";

export async function createVisitorOrder(sender: CustomButton) {
    const orderService = sender.getService($Order);
    const visitorId = sender.getService($CardId);
    const contactPhone = sender.getService($ControlStore).get<TextBox>("contanctPhone");

    if (!contactPhone.hasValue()) {
        sender.getService($MessageBox).showWarning("Укажите, пожалуйста, контактный номер телефона.")
        return;
    }

    const result = await orderService.create({ visitorId });
    const url = getCardEditRoute(result.orderId);
    sender.getService($RouterNavigation).goTo(url);
}