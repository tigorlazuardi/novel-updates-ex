import { contentEvent } from "../../events";
import { Origin, Rating, ReleaseDetail } from "./extract_tables";

export function extractDetailFromHTML(html: string): ReleaseDetail {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    return {
        image: extractImageCover(doc),
        origin: extractOrigin(doc),
        description: extractDescription(doc),
        rating: extractRating(doc),
    };
}

function extractImageCover(doc: Document) {
    let el = doc.querySelector(".serieseditimg>img") as HTMLImageElement | null;
    if (!el) {
        el = doc.querySelector(".seriesimg>img") as HTMLImageElement | null;
    }
    if (!el) {
        return "#";
    }
    return el.src;
}

function extractDescription(doc: Document): string[] {
    const out: string[] = [];

    const elements =
        doc.querySelectorAll<HTMLParagraphElement>("#editdescription>p");
    for (const p of elements) {
        const text = p.textContent?.trim();
        if (!text) {
            continue;
        }
        out.push(text);
    }

    return out;
}

const ratingRegex = /\((.*)\s\/.*,\s(\d+).*/;

function extractRating(doc: Document): Rating {
    const rating: Rating = {
        votes: 0,
        rating: 0,
    };
    const el = doc.querySelector<HTMLSpanElement>("span.uvotes");
    if (!el) {
        return rating;
    }
    const text = el.textContent?.trim();
    const match = ratingRegex.exec(text ?? "");
    if (!match) {
        return rating;
    }
    rating.rating = parseFloat(match[1]);
    rating.votes = parseInt(match[2]);
    return rating;
}

function extractOrigin(doc: Document): Origin {
    const el = doc.querySelector<HTMLSpanElement>("div#showtype > span");
    if (!el) {
        return "";
    }
    const text = el.textContent?.trim();
    if (!text) {
        return "";
    }
    return mapOrigin(text);
}

function mapOrigin(origin: string): Origin {
    switch (origin) {
        case "(CN)":
            return "[CN]";
        case "(KR)":
            return "[KR]";
        case "(JP)":
            return "[JP]";
        default:
            return "";
    }
}
