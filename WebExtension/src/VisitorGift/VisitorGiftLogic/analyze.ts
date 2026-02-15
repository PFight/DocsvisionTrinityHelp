import { app } from "@docsvision/webclient/App";
import { getGifts, importGift, saveGift } from "./firebase";
import { Gift, GiftItem } from "./interfaces";
import { itemNames } from "./items";
import { MessageBox } from "@docsvision/webclient/Helpers/MessageBox/MessageBox";
import { $RequestManager } from "@docsvision/webclient/System/$RequestManager";
import { $ApplicationSettings } from "@docsvision/webclient/StandardServices";
import { Layout } from "@docsvision/webclient/System/Layout";


const NOT_SPECIFIED = "Не указано";
export async function initAnalytics(sender: Layout) {
    const services = sender.getService<$RequestManager & $ApplicationSettings>();
    let generateByVisitors = document.getElementById("generateByVisitors");
    let generateByVisits = document.getElementById("generateByVisits");
    let generateByItems = document.getElementById("generateByNames");
    let generateByDays = document.getElementById("generateByDays");
    let generateByCategories = document.getElementById("generateByCategories");
    let importFromOldBase = document.getElementById("importFromOldBase");

    let from = document.getElementById("from") as HTMLInputElement;
    let to = document.getElementById("to") as HTMLInputElement;

    generateByVisits?.addEventListener("click", async () => {
        let data = await getGifts(from.valueAsDate, to.valueAsDate, services);
        let csv = "Дата, Количество вещей, Номер телефона, Номер паспорта, Фио, Номер анкеты, Нарушение, Колличество имен";
        for (let code in itemNames) {
            csv += ', ' + itemNames[code];
        }
        csv += "\r\n";
        for (let gift of data) {
            if (gift.date) {
                csv += new Date(gift.date).toLocaleDateString() + ", " +
                    (gift.items?.length ?? 0) + ", " +
                    (gift.phone || "")+ ", " + 
                    (gift.passport || "")+ ", " + 
                    (gift.fio || "")+ ", " + 
                    gift.id + ", " +
                    gift.offender + ", ";
                let itemsMap = {} as any;
                let personsMap = {} as any;
                for (let item of gift.items) {
                    let itemCode;
                    if (typeof(item) == "object") {
                        itemCode = item.id;
                        personsMap[item.person] = personsMap[item.person] ?? 0;
                        personsMap[item.person]++;
                    } else {
                        itemCode = item;
                    }
                    itemsMap[itemCode] = itemsMap[itemCode] ?? 0;
                    itemsMap[itemCode]++;
                }
                csv += Object.keys(personsMap).length + ', ';
                for (let code in itemNames) {
                    csv += (itemsMap[code] ?? 0) + ', ';
                }
                csv += "\r\n";
            }
        }
        let fileName = getFileName("visits", from, to);
        download(fileName, csv);
    });

    generateByVisitors?.addEventListener("click", async () => {
        let data = await getGifts(from.valueAsDate, to.valueAsDate, services);
        let csv = "ID посетителя, Количество посещений, Даты, Количество вещей, Номера анкет, Нарушение, Колличество имен, Имена";
        for (let code in itemNames) {
            csv += ', ' + itemNames[code];
        }
        csv += "\r\n";
        let visitorsMap = {} as { [key: string]: Gift[] };
        for (let gift of data) {
            let identity = (gift.visitorId);
            visitorsMap[identity] = visitorsMap[identity] || [];
            visitorsMap[identity].push(gift);
        }
        for (let identity in visitorsMap) {
            let gifts = visitorsMap[identity];
            let items: (number | string | GiftItem)[] = gifts.reduce((a, b) => a.concat(b.items ?? []), [] as any[]);
            let dates = gifts.reduce((a, b) => a + (a ? "; " : "") + new Date(b.date).toLocaleDateString(), "");
            let ids = gifts.reduce((a, b) => a + (a ? "; " : "") + b.id, "");
            csv += identity + ", " + 
                gifts.length + ", " +
                dates + ", " +
                (items.length ?? 0) + ", " +
                ids + ", " +
                (gifts.some(x => x.offender) ? "да" : "нет") + ", ";
            let itemsMap = {} as any;
            let personsMap = {} as any;
            for (let gift of gifts) {
                if (gift.date) {
                    for (let item of gift.items) {
                        let itemCode;
                        if (typeof(item) == "object") {
                            itemCode = item.id;
                            personsMap[item.person] = personsMap[item.person] ?? 0;
                            personsMap[item.person]++;
                        } else {
                            itemCode = item;
                        }
                        itemsMap[itemCode] = itemsMap[itemCode] ?? 0;
                        itemsMap[itemCode]++;
                    }
                }
            }
            csv += Object.keys(personsMap).length + ', ';
            let names = Object.keys(personsMap).reduce((a, b) => a + (a ? "; " : "") + b, "");
            csv += names + ", ";
            for (let code in itemNames) {
                csv += (itemsMap[code] ?? 0) + ', ';
            }
            csv += "\r\n";
        }
        let fileName = getFileName("visitors", from, to);
        download(fileName, csv);
    });

    generateByItems?.addEventListener("click", async () => {
        let data = await getGifts(from.valueAsDate, to.valueAsDate, services);
        let csv = "Номер анкеты, Дата, Номер телефона, Номер паспорта, Фио, Имя, Нарушение, Вещь, Название";
        csv += "\r\n";
        for (let gift of data) {
            if (gift.date) {
                for (let item of gift.items) {
                    let itemCode;
                    let person = NOT_SPECIFIED;
                    if (typeof(item) == "object") {
                        itemCode = item.id;
                        if (item.person) {
                            person = item.person;
                        }
                    } else {
                        itemCode = item;
                    }
                    csv += gift.id + ", " +
                        new Date(gift.date).toISOString() + ", " +
                        (gift.phone || "") + ", " +
                        (gift.passport || "") + ", " +
                        (gift.fio || "") + ", " +
                        person + ", " +
                        gift.offender + ", " +                        
                        itemCode + ", " +
                        itemNames[itemCode] +
                        "\r\n";
                }
            }
        }
        let fileName = getFileName("items", from, to);
        download(fileName, csv);
    });

    importFromOldBase?.addEventListener("click", async () => {
        var result = document.querySelector<HTMLElement>("#result");
        let data = await getGifts(from.valueAsDate, to.valueAsDate, services);
        let csv = "Номер анкеты, Дата, Номер телефона, Номер паспорта, Успешно, VisitId, Результат";
        csv += "\r\n";
        let errCount = 0;
        for (let gift of data) {
            if (gift.date) {
                let result;
                let success = false;
                let visitId = "";
                try {
                    let response = await importGift(gift, app);
                    success = !!response.visitId;
                    visitId = response.visitId;
                    result = JSON.stringify(response).replace(",", ";");
                } catch (err) {
                    result = err?.message ?? err;
                    success = false;
                }
                if (!success) {
                    errCount++;
                    // await MessageBox.ShowConfirmation("Ошибка импорта, продолжить?");
                }

                csv += gift.id + ", " +
                    new Date(gift.date).toISOString() + ", " +
                    (gift.phone || "") + ", " +
                    (gift.passport || "") + ", " +
                    success + ", " +
                    visitId + ", " +
                    result +
                    "\r\n";
            }
            result.innerText = "Complete " + (data.indexOf(gift)+1) + " of " + data.length + ". Err count: " + errCount;
        }
        let fileName = getFileName("imported", from, to);
        download(fileName, csv);
    });

    const reportByDays = async (noSpecial: boolean) => {
        let data = await getGifts(from.valueAsDate, to.valueAsDate, services);
        let daysData: { [key: string]: any[] } = {};
        for (let gift of data) {
            if (gift.offender && noSpecial) {
                continue;
            }
            if (gift.date) {
                let key = gift.date.toLocaleDateString();
                daysData[key] = daysData[key] || [];
                daysData[key].push(gift);
            }
        }
        let csv = "Дата, Количество посетителей, Количество вещей" + "\r\n";
        for (let day in daysData) {            
            csv += day + ", " +
                daysData[day].length + ", " +
                daysData[day].reduce((a, b) => a + b.items?.length, 0) +
                "\r\n";
        }
        let fileName = getFileName("days" + (noSpecial ? " no special" : ""), from, to);
        download(fileName, csv);
    }
    generateByDays?.addEventListener("click", () => reportByDays(false));
    
    
    generateByCategories?.addEventListener("click", async () => {
        let data = await getGifts(from.valueAsDate, to.valueAsDate, services);
        let categoriesData: { [key: string]: { count: number, visitors: number } } = {};
        for (let gift of data) {
            if (gift.items) {
                let visitorUniqueItems: string[] = [];
                for (let item of gift.items) {
                    let category = item as string;
                    if (typeof(item) === "object") {
                        category = (item as GiftItem).id;
                    }
                    categoriesData[category] = categoriesData[category] || { count: 0, visitors: 0 };
                    categoriesData[category].count += 1;
                    if (!visitorUniqueItems.includes(category)) {
                        categoriesData[category].visitors += 1;
                        visitorUniqueItems.push(category);
                    }
                }
            }
        }
        let csv = "Категория, Количество вещей выдано, Количество посетителей взяли" + "\r\n";
        for (let category in categoriesData) {            
            csv += (itemNames[category] ?? category) + ", " +
                categoriesData[category].count + ", " +
                categoriesData[category].visitors +
                "\r\n";
        }
        let fileName = getFileName("categories", from, to);
        download(fileName, csv);
    });   
    
}

function getFileName(baseName: string, from: HTMLInputElement, to: HTMLInputElement) {
    let fileName = baseName;
    if (from.valueAsDate) {
        fileName += " from " + from.valueAsDate.toLocaleDateString();
    }
    if (to.valueAsDate) {
        fileName += " to " + to.valueAsDate.toLocaleDateString();
    }
    fileName += ".csv";
    return fileName;
}

function download(filename: string, text: string) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }