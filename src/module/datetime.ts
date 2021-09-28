import moment from "moment";

export function getTime(time: Date | string | undefined = undefined, format: string = "YYYY-MM-DD HH:mm:ss") {
    return moment(time).format(format);
}

export function updateDate(dateElement: string, value: number) {
    dateElement = setDateFormat(dateElement);
    const date = new Date(dateElement);
    date.setDate(date.getDate() + value);
    return getTime(date, "YY-MM-DD");
}

export function setDateFormat(date: string) {
    return date.split("-")[0]?.length !== 4 ? `20${date}` : date;
}
