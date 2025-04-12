import { formatDistanceToNowStrict } from "date-fns";
import {format} from "date-fns/format";

export function isServer () {
    return typeof window === "undefined";
}

export function generateSlug(input: string){
    return input
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim()
    .replace(/ +/g, " ")
    .replace(/\s/g, "-")
    .toLowerCase();
}
export function formatDate (dateString: string){
    return format(new Date(dateString), "MMM d, yyy")
}

export function formatRelativeDate(dateString: string){
    return formatDistanceToNowStrict(new Date(dateString), {addSuffix: true})
}