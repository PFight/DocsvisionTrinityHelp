import { LayoutControl } from "@docsvision/webclient/System/BaseControl";
import { Layout } from "@docsvision/webclient/System/Layout";
import { $Visitor } from "./$Visitor/$Visitor";
import { $ControlStore } from "@docsvision/webclient/System/LayoutServices";
import { DateTimePicker } from "@docsvision/webclient/Platform/DateTimePicker";
import { TextBox } from "@docsvision/webclient/Platform/TextBox";
import { toServerDateString } from "@docsvision/webclient/System/DateTimeUtils";
import { $MessageWindow } from "@docsvision/web/components/modals/message-box";
import React from "react";
import { ICancelableEventArgs } from "@docsvision/webclient/System/ICancelableEventArgs";

export async function onCardSaving(sender: LayoutControl, args: ICancelableEventArgs<any>) {
    args.wait();

    const visitorService = sender.layout.getService($Visitor);
    const controls = sender.layout.getService($ControlStore);
    const phone = sender.getService($ControlStore).get<TextBox>("phone").value;
    const contanctPhone = sender.getService($ControlStore).get<TextBox>("contanctPhone").value;
    const passport = sender.getService($ControlStore).get<TextBox>("passport").value;
    const birthDate = sender.getService($ControlStore).get<DateTimePicker>("birthDate").value;
    const firstName = sender.getService($ControlStore).get<TextBox>("firstName").value;
    const lastName = sender.getService($ControlStore).get<TextBox>("lastName").value;
    const secondaryName = sender.getService($ControlStore).get<TextBox>("secondaryName").value;

    const visitors = await visitorService.find({
        passport, phone, contactPhone: contanctPhone, birthDate: toServerDateString(birthDate, sender.layout.getService()), 
        firstName, lastName, secondaryName
    });

    if (visitors.length > 0) {
        const messageWindow = sender.layout.getService($MessageWindow);
        try {
            await messageWindow.showConfirmation((
                <React.Fragment>
                    <b>В базе уже есть похожие посетители:</b>
                    <ul>
                        {visitors.map(visitor => (
                            <li>
                                <a href={`#/CardView/${visitor.cardId}`} target="_blank" >
                                    <span>{visitor.lastName + " " + visitor.firstName + " " + (visitor.secondaryName ?? "")}</span>
                                    <>&nbsp;</>
                                    <span>паспорт: {visitor.passport ?? "не указан"}</span>,
                                    <>&nbsp;</>
                                    <span>телефон: {visitor.phone ?? "не указан"}</span>,
                                    <>&nbsp;</>
                                    {visitor.birthDate && <span>дата рождения: {visitor.birthDate}</span>},
                                </a>
                            </li>    
                        ))}
                    </ul>
                    <div>Продолжить создание?</div>
                </React.Fragment>
            ));
            args.accept();
        } catch {
            args.cancel();
        }
    } else {
        args.accept();
    }
}