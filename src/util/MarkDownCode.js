import Prism from "../prism";

export const linesNumbers = (str) => {
    let lines = str.split("\n").length - 1;

    let l = [];

    for (let i = 0; i < lines; i++) {
        l.push("<span class='line'>" + (i+1) + "</span>");
    }

    return l.join("\n");
}

export const highlightCode = (code, lang, l) => {
    try {
        return Prism.highlight(code, lang, l);
    } catch (e) {
        return null;
    }
}