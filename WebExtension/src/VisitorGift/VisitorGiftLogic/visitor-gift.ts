import { Layout } from "@docsvision/webclient/System/Layout";
import { getGift, saveGift } from "./firebase";
import { Gift, GiftItem } from "./interfaces";
import { itemNames, itemRestrictions } from "./items";
import { addPerson, initPersonSelect } from "./person-select";
import Toastify from "toastify-js";
import { TextBox } from "@docsvision/webclient/Platform/TextBox";
import { DateTimePicker } from "@docsvision/webclient/Platform/DateTimePicker";
import { getVisitorBirthDateCode } from "../../Visitor/GetVisitorBirthDateCode";
import { $MessageBox } from "@docsvision/webclient/System/$MessageBox";
import { $RequestManager } from "@docsvision/webclient/System/$RequestManager";
import { $ApplicationSettings, $CurrentEmployeeId } from "@docsvision/webclient/StandardServices";
import { $CardId } from "@docsvision/webclient/System/LayoutServices";
import { EMPTY_GUID } from "@docsvision/webclient/System/GuidUtils";
import { Table } from "@docsvision/webclient/Platform/Table";
import { Dropdown } from "@docsvision/webclient/Platform/Dropdown";

export let onVisitorGiftAddedCallback: (gift: Gift) => void;

export function setOnVisitorGiftAddedCallback(callback: typeof onVisitorGiftAddedCallback) {
    onVisitorGiftAddedCallback = callback;
}

export let onLoadGift: (gift: Gift) => Promise<void>;

export function setOnOnLoadGiftCallback(callback: typeof onLoadGift) {
    onLoadGift = callback;
}

var loadGiftIml: (giftNumber: string) => void = () => {};

export function loadGift(giftNumber: string) {
    loadGiftIml(giftNumber);
}

let currentSeason: Gift | undefined = undefined;

export function processCurrentSeasonVisits(visits: Gift) {
    currentSeason = visits;
}

let getSelectedPerson = () => {
    let personList = document.getElementById("personList")! as HTMLElement;

    let person = personList.querySelector(".gift-add-item__person-list-item.selected");
    if (person) {
        return { name: person.getAttribute("data-name"), id: person.getAttribute("data-id") };
    } else {
        return null;
    }
}

export function onVisitorGiftOpen(layout: Layout) {
    let addItemInput = document.getElementById("addItemName")! as HTMLInputElement;
    let addItemButton = document.getElementById("addItemButton")!;
    let addItemButton2 = document.getElementById("addItemButton2")!;
    let addItemButton3 = document.getElementById("addItemButton3")!;
    let addItemButton4 = document.getElementById("addItemButton4")!;
    let addItemButton5 = document.getElementById("addItemButton5")!;
    let clearItemButton = document.getElementById("clearItemButton")!;
    let autoClearInput = document.getElementById("autoClearInput")! as HTMLInputElement;
    let addItemCards = document.querySelectorAll<HTMLElement>(".gift-add-item__card");

    let passportTextBox = layout.controls.get<TextBox>('passport');
    let phoneTextBox = layout.controls.get<TextBox>("phone");
    let birthDatePicker = layout.controls.get<DateTimePicker>("birthDate");
    
    
 
    let items = document.getElementById("giftItems")!;
    let itemTemplate = document.getElementById("giftItemTemplate")! as HTMLTemplateElement;
    let dateInput = document.getElementById("dateInput")! as HTMLInputElement;
    dateInput.value = getDateTimeInputValue(new Date());
    let saveButton = document.getElementById("save")!;
    let giftNumber = document.getElementById("giftNumber")! as HTMLInputElement;
    let loadGiftButton = document.getElementById("loadGift")! as HTMLButtonElement;



    let addItem = async (id: string, person: { id: string, name: string }, count: number = 1) => {
        let code: number | null = null;
        try {
            code = parseInt(id)
        } catch {
        }
        let deleteItem = (itemElement: HTMLElement) => {
            itemElement.remove();
            let gift = getCurrentGift(layout.getService());
            onVisitorGiftAddedCallback(gift);
            loadCardRestrictions();
        }

        let deleteItemClick = (ev: Event) => {
            deleteItem((ev.target as HTMLElement).parentElement as HTMLElement);
            let gift = getCurrentGift(layout.getService());
            onVisitorGiftAddedCallback(gift);
            loadCardRestrictions();
        }
        let item: HTMLElement;
        for (let i = 0; i < count; i++) {
            if (code) {
                let name = itemNames[code];
                let itemElement = document.importNode(itemTemplate.content, true);
                itemElement.querySelector(".gift-item__name")!.textContent = name;
                itemElement.querySelector(".gift-item__person")!.textContent = person?.name ?? "";
                itemElement.querySelector<HTMLElement>(".gift-item__person")!.setAttribute("data-id", person?.id);
                itemElement.querySelector(".gift-item__id")!.textContent = id;
                itemElement.querySelector(".gift-item__delete")!.addEventListener("click", deleteItemClick)
                item = itemElement.querySelector<HTMLElement>(".gift-item")!;
                items!.prepend(itemElement);
            } else {
                let itemElement = document.importNode(itemTemplate.content, true);
                itemElement.querySelector(".gift-item__id")!.textContent = id;
                itemElement.querySelector(".gift-item__person")!.textContent = person?.name ?? "";
                itemElement.querySelector<HTMLElement>(".gift-item__person")!.setAttribute("data-id", person?.id);
                itemElement.querySelector(".gift-item__delete")?.addEventListener("click", deleteItemClick)
                item = itemElement.querySelector<HTMLElement>(".gift-item")!;
                items!.prepend(itemElement);
            }
        }

        if (onVisitorGiftAddedCallback) {
            let gift = getCurrentGift(layout.getService());
            onVisitorGiftAddedCallback(gift);
        }

        loadCardRestrictions();

        showAddItemToast(person?.name, code!, () => deleteItem(item));
    }
    let onAddItem = (count: number = 1, clearInput: boolean | null = null) => {
        addItem(addItemInput.value, getSelectedPerson(), count);
        if (clearInput || (clearInput === null && autoClearInput.checked)) {
            addItemInput.value = "";
            addItemInput.focus();
        }
    }
    addItemInput.addEventListener("keypress", (ev) => {
        if (ev.key === "Enter") {
            onAddItem();
        }
    });
    addItemInput.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter" && ev.ctrlKey) {
            ev?.preventDefault();
            onAddItem(1, false);
        }
        if (ev.key === "Backspace") {
            addItemInput.value = "";
        }
    });
    addItemButton.addEventListener("click", () => onAddItem(1));
    addItemButton2.addEventListener("click", () => onAddItem(2));
    addItemButton3.addEventListener("click", () => onAddItem(3));
    addItemButton4.addEventListener("click", () => onAddItem(4));
    addItemButton5.addEventListener("click", () => onAddItem(5));

    for (let i = 0;  i < addItemCards.length; i++) {
        let card = addItemCards[i];
        card.addEventListener("click", () => {
            let cardValue = card.getAttribute("data-code") as string;
            addItem(cardValue, getSelectedPerson(), 1);
        });
    }


    clearItemButton.addEventListener("click", () => {
        addItemInput.value = "";
        addItemInput.focus();
    });

    const disableAutoClearInputKey = "disableAutoClearInput";
    autoClearInput.addEventListener("change", () => {
        if (!autoClearInput.checked) {
            localStorage[disableAutoClearInputKey] = "true";
        } else {
            delete localStorage[disableAutoClearInputKey];
        }
    });
    autoClearInput.checked = !localStorage[disableAutoClearInputKey];

    let saving = false;

    let save = async () => {
        if (!phoneTextBox.hasValue() && !passportTextBox.hasValue() && !birthDatePicker.hasValue()) {
            alert("Укажите либо номер телефона, либо номер паспорта, либо дату рождения!");
            return;
        }

        if (saving) {
            console.info("Already saving...");
            return;
        }
        saving = true;
        try {
            let gift = getCurrentGift(layout.getService());
            let id = await saveGift(gift as any, layout.getService<$RequestManager & $ApplicationSettings>());
            giftNumber.value = id;
        } finally {
            saving = false;
        }
    }

    let getCurrentGift = (services: $CardId & $CurrentEmployeeId) => {
        let itemsElements = document.querySelectorAll(".gift-item");
        let items = [].map.call(itemsElements, (element: HTMLElement) => {
            let id = element.querySelector(".gift-item__id")!.textContent as any;
            let person = element.querySelector(".gift-item__person")!.textContent;
            let personId = element.querySelector(".gift-item__person")!.getAttribute("data-id");
            let name = element.querySelector(".gift-item__name")!.textContent;
            return { id: id || name, person, personId } as GiftItem;
        });

        let phone = phoneTextBox.value ?? "";
        if (!phoneTextBox.hasValue() && !passportTextBox.hasValue()) {
            phone = getVisitorBirthDateCode(birthDatePicker);
        }

        return {
            visitorId: services.cardId,
            dutyId: services.currentEmployeeId,
            id: giftNumber.value,
            fio: "",
            phone: phone,
            passport: passportTextBox.value ?? "",
            date: new Date(dateInput.value),
            offender: false,
            items
        } as Gift;
    }
    saveButton.addEventListener("click", save);

    let load = async () => {
        items.innerHTML = "";
        let gift = await getGift(giftNumber.value, layout.getService<$RequestManager>()); 
        if (onLoadGift) {
            await onLoadGift(gift);
        }

        if (gift.visitorId != layout.getService($CardId)) {
            layout.getService($MessageBox).showWarning("Это посещение другого посетителя!");
            return;
        }

        giftNumber.value = gift.id;
        dateInput.value = getDateTimeInputValue(gift.date);
        for (let item of gift.items) {
            if (typeof(item) == "object") {
                addItem(item.id, { name: item.person, id: item.personId });
            } else {
                addItem(item.toString(), null);
            }
        }
    };
    loadGiftButton.addEventListener("click", load);

    const urlParams = new URLSearchParams(window.location.search);
    const urlGiftNumber = urlParams.get('gift');
    if (urlGiftNumber) {
        giftNumber.value = urlGiftNumber;
        urlParams.delete('gift');
        load();
    }
    loadGiftIml = (number) => {
        giftNumber.value = number;
        load();
    }

    initPersonSelect(layout);
}

export function loadCardRestrictions() {
    let addItemCards = document.querySelectorAll<HTMLElement>(".gift-add-item__card");

    let selectedPerson = getSelectedPerson();
    if (currentSeason) {
        let currentPersonSeasonItems = currentSeason.items.filter(x => (x as GiftItem).person === selectedPerson.name &&
            ((x as GiftItem).personId == null || (x as GiftItem).personId == selectedPerson.id ));
        for (let i = 0; i < addItemCards.length; i++) {
            let card = addItemCards[i];
            let cardValue = card.getAttribute("data-code")!;
            let currentSeasonCount = currentPersonSeasonItems.filter(x => (x as GiftItem).id === cardValue).length;
            let restriction = itemRestrictions[cardValue];
            if (restriction && currentSeasonCount >= restriction) {
                card.classList.add("gift-add-item__card_restricted")
            } else {
                card.classList.remove("gift-add-item__card_restricted")
            }
        }
    }
}

export function loadPersons(layout: Layout) {
    let personList = document.getElementById("personList")! as HTMLElement;
    personList.innerHTML = "";

    const firstNameTextBox = layout.controls.get<TextBox>("firstName");
    addPerson(firstNameTextBox.value, EMPTY_GUID);
    const recipientFirstNameControls = layout.controls.tryGet<TextBox[]>("recipientFirstName");
    const recipientLastNameControls = layout.controls.tryGet<TextBox[]>("recipientLastName");
    const relationshipControls = layout.controls.tryGet<Dropdown[]>("relationship");
    
    const recipientsTable = layout.controls.get<Table>("recipients");
    for (let i = 0; i < recipientsTable.params.rows.length; i++) {
        const relationship = relationshipControls[i].params.items.find(x => x.key == relationshipControls[i].value)?.value
        let name = recipientFirstNameControls[i].value;
        if (recipientLastNameControls[i].value) {
            name += " " + recipientLastNameControls[i].value;
        }
        if (relationship) {
            name += " (" + relationship + ")";
        }
        addPerson(name, recipientsTable.params.rows[i]);
    }
}

export function cleanGift() {
    let personList = document.getElementById("personList")! as HTMLElement; 
    let items = document.getElementById("giftItems")!;
    let dateInput = document.getElementById("dateInput")! as HTMLInputElement;
    dateInput.value = getDateTimeInputValue(new Date());
    let giftNumber = document.getElementById("giftNumber")! as HTMLInputElement;

    items.innerHTML = "";         
    dateInput.value = getDateTimeInputValue(new Date());
    giftNumber.value = "";
    personList.innerHTML = "";
}

function getDateTimeInputValue(date: Date) {
    if (!date) 
        return "";
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().substring(0,16);
}

function showAddItemToast(person: string, code: number, deleteItem: () => void) {
    let addItemToastTemplate = document.getElementById("addItemToast") as HTMLTemplateElement;
    let addItemToast = document.importNode(addItemToastTemplate.content, true);
    addItemToast.querySelector(".add-item-toast__person")!.textContent = person;
    addItemToast.querySelector<HTMLImageElement>(".add-item-toast__image")!.src = code + ".png";
    addItemToast.querySelector(".add-item-toast__text")!.textContent = `${itemNames[code]}`;
    addItemToast.querySelector(".add-item-toast__cancel")!.addEventListener("click", () => {
        toast.hideToast();
        deleteItem();
        Toastify({
            text: `Отменено ${itemNames[code]} у ${person}!`
        }).showToast();
    });
    var toast = Toastify({
        node: addItemToast.querySelector<HTMLElement>(".add-item-toast")!,
        duration: 2000,
        close: false,
        gravity: "top",
        position: "right",
        newWindow: true,
    });
    toast.showToast();
}



