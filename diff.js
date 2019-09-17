let newArr = [1,2,3,5,7,9,11,13];
let oldArr = [1,2,3,4,5,6,7,8];
let differenceAB = diff(newArr, oldArr);
let differenceBA = diff(oldArr, newArr);

function diff(newArr, oldArr) {
    let newSet = new Set(newArr);
    let oldSet = new Set(oldArr);
    return [...oldSet].filter(x => !newSet.has(x));
}

console.log("new unfollowers: " + JSON.stringify(differenceAB))
console.log("new followers: " + JSON.stringify(differenceBA))