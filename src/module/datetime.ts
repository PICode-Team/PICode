import moment from 'moment'

export function getTime(time: Date | string | undefined = undefined, format: string = 'YYYY-MM-DD HH:mm:ss') {
    return moment(time).format(format)
}