import DICTIONNARY from "./dictionnary.json" assert { type: "json" };


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


function updateFilters(word, mask, filters) {
    if (word.length != mask.length) {
        return filters;
    }

    
}