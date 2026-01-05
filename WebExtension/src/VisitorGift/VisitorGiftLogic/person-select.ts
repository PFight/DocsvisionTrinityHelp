import { Layout } from "@docsvision/webclient/System/Layout";
import { loadCardRestrictions } from "./visitor-gift";
import { CustomButton } from "@docsvision/webclient/Platform/CustomButton";

export function initPersonSelect(layout: Layout) {
    let addItemPerson = document.getElementById("addItemPerson")! as HTMLButtonElement;
    
    let showDialog = async () => {
        const button = layout.controls.get<CustomButton>("addRecipient");
        button.performClick();
    }

    addItemPerson.addEventListener('click', () => showDialog());
    addItemPerson.addEventListener('keyup', (event) => {
        if (event.key != "Tab" && event.key != "Escape" && event.target == addItemPerson) {
            event.stopImmediatePropagation();
            setTimeout(() => showDialog());
        }
    });
}

const SELECTED_PERSON_CLASS = "selected";
export function addPerson(name: string) {
    let personList = document.getElementById("personList")! as HTMLElement;
    let personListItemTemplate = document.getElementById("personListItem")! as HTMLTemplateElement;
    let personListItemFragment = document.importNode(personListItemTemplate.content, true);
    let personListItem = personListItemFragment.querySelector(".gift-add-item__person-list-item")!;
    personListItem.textContent = name || "<не указано>";
    personListItem.setAttribute("data-name", name);
    personListItem.addEventListener("click", (event) => {
        selectPerson((event.target as HTMLElement).getAttribute("data-name"));

    });
    personList.appendChild(personListItem);
    selectPerson(name);
}

export function selectPerson(name: string | null) {
    let personList = document.getElementById("personList")! as HTMLElement;
    let items = personList.querySelectorAll(".gift-add-item__person-list-item");
    for (let i = 0; i < items.length; i++) {
        if (items[i].getAttribute("data-name") == name) {
            items[i].classList.add(SELECTED_PERSON_CLASS);
        } else {
            items[i].classList.remove(SELECTED_PERSON_CLASS);
        }
    }
    loadCardRestrictions()
}
    