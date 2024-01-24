import { readFileSync, writeFileSync } from "fs";

const dictionnary = readFileSync("gutenberg.txt", { encoding: "utf-8" });

/**
 * Generate json dictionnary.
 * @param {string} dictionnary A list of word separated by lines
 */
function createJson(dictionnary) {
    let words = dictionnary.replaceAll("\r", "").toUpperCase();
    words = words.normalize("NFD").replace(/\p{Diacritic}/gu, "");
    words = words.split("\n");
 
    let json = {};
    for (let word of words) {
        let first_letter = word[0];
        let length = word.length;

        // Create letter category
        if (!json[first_letter]) {
            json[first_letter] = {};
        }

        // Create length category
        if (!json[first_letter][length]) {
            json[first_letter][length] = [];
        }

        // Add word if not in list
        if (json[first_letter][length].indexOf(word) == -1) {
            json[first_letter][length].push(word);
        }
    }

    return json;
}

writeFileSync("dictionnary.json", JSON.stringify(createJson(dictionnary)));