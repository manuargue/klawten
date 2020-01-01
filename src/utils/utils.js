/** return a shuffled copy of an array */
function shuffleArray(array) {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

function popFromSet(set) {
    let value;
    for (value of set);
    set.delete(value);
    return value;
};

module.exports = {
    shuffleArray,
    popFromSet
};