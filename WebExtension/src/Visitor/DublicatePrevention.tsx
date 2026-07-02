import { LayoutControl } from "@docsvision/webclient/System/BaseControl";
import { Layout } from "@docsvision/webclient/System/Layout";
import { $Visitor } from "./$Visitor/$Visitor";
import { $CardId, $ControlStore } from "@docsvision/webclient/System/LayoutServices";
import { DateTimePicker } from "@docsvision/webclient/Platform/DateTimePicker";
import { TextBox } from "@docsvision/webclient/Platform/TextBox";
import { toServerDateString } from "@docsvision/webclient/System/DateTimeUtils";
import { $MessageWindow } from "@docsvision/web/components/modals/message-box";
import React from "react";
import { ICancelableEventArgs } from "@docsvision/webclient/System/ICancelableEventArgs";
import { CustomButton } from "@docsvision/webclient/Platform/CustomButton";
import { FoundVisitor } from "./$Visitor/Models/FoundVisitor";
import { mergeVisitorDublicates } from "../VisitorGift/VisitorGiftLogic/firebase";
import { $Layout } from "@docsvision/webclient/System/$Layout";
import { FindVisitorsRequest } from "./$Visitor/Models/FindVisitorsRequest";

export async function onCardSaving(sender: LayoutControl, args: ICancelableEventArgs<any>) {
    args.wait();

    const visitors = await loadDublicates(sender);

    if (visitors.length > 0) {
        const messageWindow = sender.layout.getService($MessageWindow);
        try {
            await messageWindow.showConfirmation((
                <React.Fragment>
                    <b>В базе уже есть похожие посетители:</b>
                    <ul>
                        {visitors.map(visitor => (
                            <li>
                                {renderDublicateVisitor(visitor)}
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

function renderDublicateVisitor(visitor: FoundVisitor, renderOpenButton: boolean = true) {
    return (
        <span>
            <span>{visitor.lastName + " " + visitor.firstName + " " + (visitor.secondaryName ?? "")}</span>
            <>&nbsp;</>
            <span>паспорт: {visitor.passport ?? "не указан"}</span>,
            <>&nbsp;</>
            <span>телефон: {visitor.phone ?? "не указан"}</span>,
            <>&nbsp;</>
            {visitor.birthDate && <span>дата рождения: {visitor.birthDate}</span>},
            {renderOpenButton && (
                <a href={`#/CardView/${visitor.cardId}`} target="_blank">
                    Открыть
                </a>
            )}
        </span>
    );
}

async function loadDublicates(sender: LayoutControl) {
    const visitorService = sender.layout.getService($Visitor);
    const request: FindVisitorsRequest = getVisitorInfo(sender);
    let visitors = await visitorService.find(request);

    visitors = visitors.filter(x => x.cardId !== sender.getService($CardId));

    return visitors;
}

function getVisitorInfo(sender: LayoutControl) {
    const controls = sender.layout.getService($ControlStore);
    const phone = controls.get<TextBox>("phone").value;
    const contanctPhone = controls.get<TextBox>("contanctPhone").value;
    const passport = controls.get<TextBox>("passport").value;
    const birthDate = controls.get<DateTimePicker>("birthDate").value;
    const firstName = controls.get<TextBox>("firstName").value;
    const lastName = controls.get<TextBox>("lastName").value;
    const secondaryName = controls.get<TextBox>("secondaryName").value;

    const request: FindVisitorsRequest = {
        passport, phone, contactPhone: contanctPhone, birthDate: toServerDateString(birthDate, sender.layout.getService()),
        firstName, lastName, secondaryName
    };
    return request;
}

export async function mergeDublicates(sender: CustomButton) {
    const visitors = await loadDublicates(sender);
    
    if (visitors.length > 0) {
        const messageWindow = sender.layout.getService($MessageWindow);
        let dublicateVisitorId: string = '';
        const onSelected = (event: React.FormEvent) => {
            dublicateVisitorId = (event.target as HTMLInputElement).value;
        }

        const birthDate = sender.getService($ControlStore).get<DateTimePicker>("birthDate").value;
        const visitorInfo = getVisitorInfo(sender);

        await messageWindow.showConfirmation((
            <React.Fragment>
                <b className="select-dublicate-header">Текущий посетитель:</b>
                <div className="select-dublicate-block">
                    {renderDublicateVisitor({
                        cardId: sender.getService($CardId),
                        firstName: visitorInfo.firstName,
                        lastName: visitorInfo.lastName,
                        passport: visitorInfo.passport,
                        phone: (visitorInfo.phone ?? "") + " " + (visitorInfo.contactPhone ?? ""),
                        birthDate: birthDate.toLocaleDateString(),
                        secondaryName: visitorInfo.secondaryName
                    }, false)}
                </div>
                <b className="select-dublicate-header">Выберите дубликат:</b>
                <ul onChange={onSelected}>
                    {visitors.map(visitor => (
                        <li>
                            <label className="select-dublicate-label">
                                <input type="radio" name="dublicate" value={visitor.cardId} ></input>
                                {renderDublicateVisitor(visitor, true)}
                            </label>
                        </li>    
                    ))}
                </ul>
            </React.Fragment>
        ));

        if (dublicateVisitorId) {
            try {
                await mergeVisitorDublicates(sender.getService($CardId), dublicateVisitorId, sender.layout.getService())
            } catch (err) {
                sender.getService($MessageWindow).showError("Ошибка: " + err)
            }
            await sender.getService($Layout).reloadFromServer();
            sender.getService($MessageWindow).showInfo("Операция выполнена успешно!");
        }
     
    } else {
        sender.getService($MessageWindow).showInfo("Дубликаты не найдены!");
    }

}