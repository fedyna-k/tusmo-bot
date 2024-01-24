import DICTIONNARY from "./dictionnary.json" assert { type: "json" };
import * as readline from "readline";


/**
 * @typedef WordFilter
 * @property {string} letter
 * @property {{right: number, wrong: number}} masks
 * @property {number} count
 * @property {boolean} isCountFinal
 */


/**
 * @param {string} word The word to test
 * @param {WordFilter[]} filters 
 */
function isPossibleWord(word, filters) {
    let counts = countLetters(word);

    for (let filter of filters) {
        // Reject letters with bad counting
        if (filter.isCountFinal && (counts[filter.letter] ?? 0) != filter.count || !filter.isCountFinal && (counts[filter.letter] ?? 0) < filter.count) {
            return false;
        }

        if (filter.masks == undefined) {
            continue;
        }

        for (let i = 0 ; i < word.length ; i++) {
            // Check if letter is in right place for bitmask
            if (getBit(filter.masks.right, i, word.length) && word[i] != filter.letter) {
                return false;
            }

            // Check if letter is in different place for bitmask
            if (getBit(filter.masks.wrong, i, word.length) && word[i] == filter.letter) {
                return false;
            }
        }
    }

    return true;
}


/**
 * @param {string} word The word to count letters
 */
function countLetters(word) {
    let counts = {};
    for (let letter of word) {
        if (!counts[letter]) {
            counts[letter] = 0;
        }

        counts[letter]++;
    }

    return counts;
}


/**
 * @param {string} word The word to count letters
 */
function countDifferentLetters(word) {
    let letters = [];
    
    for (let letter of word) {
        if (letters.indexOf(letter) == -1) {
            letters.push(letter);
        }
    }

    return letters.length;
}


/**
 * @param {number} number 
 * @param {number} index 
 * @param {number} length 
 * @returns {1|0}
 */
function getBit(number, index, length) {
    return (number >> (length - index - 1)) & 1;
}

/**
 * @param {number} index 
 * @param {number} length 
 * @returns {number}
 */
function getMask(index, length) {
    return 1 << (length - index - 1);
}


/**
 * @param {string} first_letter 
 * @param {number} length 
 * @param {WordFilter[]} filters 
 * @returns {string[]}
 */
function filterWords(first_letter, length, filters) {
    let words = DICTIONNARY[first_letter][length].filter(e => isPossibleWord(e, filters));
    words = words.sort((a, b) => countDifferentLetters(b) - countDifferentLetters(a));

    return words;
}


/**
 * @param {string} letter 
 * @param {WordFilter[]} filters 
 * @returns {number}
 */
function getFilterIndex(letter, filters) {
    for (let i = 0 ; i < filters.length ; i++) {
        if (filters[i].letter == letter) {
            return i;
        }
    }

    return -1;
}


/**
 * @param {string} word
 * @param {string} mask
 * @param {WordFilter[]} filters
 * @returns {WordFilter[]}
 */
function updateFilters(word, mask, filters) {
    if (word.length != mask.length) {
        return filters;
    }

    let counts = {};

    for (let i = 0 ; i < word.length ; i++) {
        // "." tells that letter is not in word
        if (mask[i] == ".") {
            let filter_index = getFilterIndex(word[i], filters);

            if (filter_index == -1) {
                filters.push({
                    letter: word[i],
                    count: 0,
                    isCountFinal: true
                });
            } else {
                filters[filter_index].isCountFinal = true;
            }
        }

        // "x" tells that letter is in wrong place
        if (mask[i] == "x") {
            let filter_index = getFilterIndex(word[i], filters);

            if (filter_index == -1) {
                filters.push({
                    letter: word[i],
                    masks: {
                        wrong: getMask(i, word.length),
                        right: 0
                    },
                });
            } else {
                filters[filter_index].masks.wrong |= getMask(i, word.length);
            }

            if (counts[word[i]] == undefined) {
                counts[word[i]] = 1;
            } else {
                counts[word[i]]++;
            }

            filters.at(filter_index).count = counts[word[i]];
        }

        // "o" tells that letter is in right place
        if (mask[i] == "o") {
            let filter_index = getFilterIndex(word[i], filters);

            if (filter_index == -1) {
                filters.push({
                    letter: word[i],
                    masks: {
                        right: getMask(i, word.length),
                        wrong: 0
                    },
                });
            } else {
                filters[filter_index].masks.right |= getMask(i, word.length);
            }

            if (counts[word[i]] == undefined) {
                counts[word[i]] = 1;
            } else {
                counts[word[i]]++;
            }

            filters.at(filter_index).count = counts[word[i]];
        }
    }

    return filters;
}


const inputs = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


function ask_word(first_letter, length, filters, index=0) {
    let word = filterWords(first_letter, length, filters)[index];

    inputs.question(`Word "${word}" mask is : `, answer => {
        if (answer == "") {
            ask_word(first_letter, length, filters, index + 1);
        } else if (answer != "ok") {
            ask_word(first_letter, length, updateFilters(word, answer, filters));
        } else {
            process.exit(0);
        }
    });
}

ask_word(process.argv[2], process.argv[3], []);