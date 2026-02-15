// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
import "firebase/firestore";
import Firebase from "firebase/index";
import { GenerateOptions, Generation, Gift, GiftItem } from "./interfaces";
import { $RequestManager } from "@docsvision/webclient/System/$RequestManager";
import { getDateTimeStringifyServerFormatter, parseServerDateTime } from "@docsvision/webclient/System/DateTimeUtils";
import { $ApplicationSettings } from "@docsvision/webclient/StandardServices";
import { VisitorVisit } from "../Models/VisitorVisit";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjSSoXs-xNIyq310lsCzVcYu8Zz9puiPQ",
  authDomain: "tag-generator-3.firebaseapp.com",
  projectId: "tag-generator-3",
  storageBucket: "tag-generator-3.appspot.com",
  messagingSenderId: "25589238377",
  appId: "1:25589238377:web:b089f263d21e9b18d330f8"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

export async function saveGift(gift: Gift, services: $RequestManager & $ApplicationSettings) {
   const response = await services.requestManager.post("api/Visit/Create", JSON.stringify({
        visitNumber: gift.id,
        date: gift.date,
        visitorPassport: gift.passport,
        visitorPhone: gift.phone,
        visitorId: gift.visitorId,
        dutyId: gift.dutyId,
        comment: gift.comment,
        items: gift.items.map(x => typeof(x) === "object" ? ({
            code: x.id,
            recipientName: x.person,
            recipient: x.personId,
            comment: x.comment
        }) : ({ code: x }))
   }, getDateTimeStringifyServerFormatter(services))) as any;
   return response.visitNumber;
}

export async function importGift(gift: Gift, services: $RequestManager & $ApplicationSettings) {
    const response = await services.requestManager.post("api/Visit/Create", JSON.stringify({
         visitNumber: gift.id,
         date: gift.date,
         visitorPassport: gift.passport,
         visitorPhone: gift.phone,
         visitorId: gift.visitorId,
         dutyId: gift.dutyId,
         comment: gift.comment,
         items: gift.items.map(x => typeof(x) === "object" ? ({
             code: x.id,
             recipientName: x.person,
             recipient: x.personId,
             comment: x.comment
         }) : ({ code: x }))
    }, getDateTimeStringifyServerFormatter(services))) as any;
    return response;
 }

export async function getGifts(from: Date, to: Date, services: $RequestManager & $ApplicationSettings): Promise<Gift[]> {
    let visits = await services.requestManager.post("api/Visit/FindVisitsByDate", 
        JSON.stringify({ from, to }, getDateTimeStringifyServerFormatter(services))) as VisitorVisit[];
    return visits.map(getGiftFromVisit);
}

export async function getGift(number: string, services: $RequestManager): Promise<Gift> {
    let visit = await services.requestManager.get("api/Visit/GetVisitByNumber?visitNumber=" + number) as VisitorVisit;
    return getGiftFromVisit(visit);
}

export async function getVisitorGifts(visitorId: string, services: $RequestManager): Promise<Gift[]> {
    const visits = await services.requestManager.get("api/Visit/GetVisits?visitorId=" + encodeURIComponent(visitorId)) as VisitorVisit[];

    var result = [];
    for (var gift of visits) {
        result.push(getGiftFromVisit(gift));
    }
    return result;
}

function getGiftFromVisit(visit: VisitorVisit): Gift {
    return {
        id: visit.visitNumber,
        cardId: visit.id,
        phone: undefined,
        passport: undefined,
        visitorId: visit.visitorId,
        items: visit.items.map(item => ({
            id: item.code,
            personId: item.recipient,
            person: item.recipientName,
            comment: item.comment
        } as GiftItem)),
        date: new Date(visit.date),
        offender: undefined,
        dutyId: visit.dutyId,
        dutyName: visit.dutyName,
        fio: undefined,
        comment: visit.comment
    } as Gift;
}

function getGiftItems(gen: any) {
    return (gen.get("items") as string[]).map(x => {
        try { return JSON.parse(x) } catch { return x } 
    }) as (GiftItem | number | string)[];
}

const namesKey = "VisitorNames";

export async function getNames(): Promise<string[]> {
    var namesLocalStorage = localStorage.getItem(namesKey);
    if (namesLocalStorage) {
        return JSON.parse(namesLocalStorage);
    } else {
        let namesRequest = firebase.firestore().collection("names") as firebase.firestore.Query<any>;
        let names = await namesRequest.get();
        var result = [];
        for (var name of names.docs) {
            result.push(name.get("name"));
        }
        localStorage.setItem(namesKey, JSON.stringify(result));
        return result;
    }
}

export async function addNames(names: string[]): Promise<void> {
    let namesCollection = firebase.firestore().collection("names");
    for (let name of names) {
        await namesCollection.doc().set({ name: name });
    }
    var namesLocalStorage = localStorage.getItem(namesKey);
    if (namesLocalStorage) {
        let allNames = JSON.parse(namesLocalStorage);
        names.forEach(x => allNames.push(x));
        localStorage.setItem(namesKey, JSON.stringify(allNames));
    }
}