import moment from "moment";

export function getTime(time: Date | string | undefined = undefined, format: string = "YYYY-MM-DD HH:mm:ss") {
    return moment(time).format(format);
}

export function updateDate(dateElement: string, value: number) {
    const newDateElement = setDateFormat(dateElement);
    const date = new Date(`"${newDateElement}"`);
    date.setDate(date.getDate() + value);
    return getTime(date, "YY-MM-DD");
}

export function getDateArray(startDate: string, dueDate: string) {
    let dateArray: string[] = [];
    for (let dateElement = startDate; dateElement <= dueDate; dateElement = updateDate(dateElement, 1)) {
        const date = dateElement.split("-")[0]?.length !== 4 ? dateElement : dateElement.substr(2);
        dateArray.push(date);
    }
    return dateArray;
}

export function setDateFormat(date: string) {
    return date.split("-")[0]?.length !== 4 ? `20${date}` : date;
}
