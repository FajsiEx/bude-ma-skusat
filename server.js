const input = require("input");

const priezviska = [
    "Null",
    "Baranovsky",
    "Brazda",
    "Bucko",
    "Cavajda",
    "Darocz",
    "Dinusova",
    "Gasparik",
    "Holarek",
    "Chornyi",
    "Jegh",
    "Katona",
    "Kovacs",
    "Losonsky",
    "Magdin",
    "Magyerka",
    "Mesko",
    "Rakus",
    "Reznak",
    "Sith",
    "Smolar",
    "Semberova",
    "Toth",
    "Turcar",
    "Valnicek",
    "Varmuza",
    "Vodrazka"
];

async function main() {
    const params = await getParams();

    console.log("Params get. Testing students for raw weights...")
    
    const studentWeights = testStudents(params);

    console.log("Balancing...")
    
    const results = balanceWeights(studentWeights);

    console.log("\nResults:")

    for (let result of results) {
        drawStudentResult(result);
    }
}

async function getParams() {
    return {
        totalStuds: 26,
        dayNum: 24,
        monthNum: 9
    }

    let totalStuds = await input.text('Vsetkych studentov:');

    totalStuds = parseInt(totalStuds);
    if (!totalStuds) { throw("Not a number"); }



    let dayNum = await input.text('Den:');

    dayNum = parseInt(dayNum);
    if (!dayNum) { throw("Not a number"); }



    let monthNum = await input.text('Mesiac:');

    monthNum = parseInt(monthNum);
    if (!monthNum) { throw("Not a number"); }

    return {
        totalStuds,
        dayNum,
        monthNum
    }
}

function balanceWeights(unbalancedWeights) {
    const weights = [];
    let totalWeight = 0;

    for (const weight of unbalancedWeights) {
        totalWeight += weight.weight;
    }

    for (const weight of unbalancedWeights) {
        weight.weight = weight.weight / totalWeight;
        weights.push(weight);
    }

    return weights;
}

function testStudents(params) {
    const studentWeights = [];
    let i = 1;
    while (i <= params.totalStuds) {
        const studentWeight = testStudentNo(i, params);
        studentWeights.push({
            studentNo: i,
            studentName: priezviska[i],
            weight: studentWeight
        });
        i++;
    }

    return studentWeights;
}

let chances = []

function testStudentNo(studIndex, params) {
    chances = [];

    const d = params.dayNum;
    const m = params.monthNum;

    console.log(`Testing #${studIndex} ${priezviska[studIndex]}...`);

    // Now let's check if I'm gonna go to hell

    //? Basics
    // If student # is the day or month
    logChance('same as day', 1, studIndex === d);
    logChance('same as month', 1, studIndex === m);
    
    // Basic arithmetics
    logChance('day + month', 1, studIndex === d+m);
    logChance('day - month', 1, studIndex === d-m);
    logChance('month - day', 1, studIndex === m-d);
    logChance('day * month', 1, studIndex === d*m); // Almost always out of range but whatever
    logChance('day / month rounded', .5, studIndex === Math.round(d/m)); // We do both round and floor because you never know
    logChance('day / month floored', .5, studIndex === Math.floor(d/m)); // Half the weight to not double up at number like 4.25
    logChance('month / day rounded', .5, studIndex === Math.round(m/d));
    logChance('month / day floored', .5, studIndex === Math.floor(m/d));
    
    //? Digit SUM
    // Digit sum of day and month
    logChance('da(day)', 1, studIndex === da(d));
    logChance('da(month)', 1, studIndex === da(m));

    // Digit sum of above operations
    logChance('da(day+month)', 1.5, studIndex === da(d+m)); // Used 1 time
    logChance('da(day-month)', 1, studIndex === da(d-m));
    logChance('da(month-day)', 1, studIndex === da(m-d));

    // Digit sum of day combined with month
    logChance('da(day) + month', 1, studIndex === da(d) + m); 
    logChance('da(day) - month', 1, studIndex === da(d) - m);
    
    //? Digit SUB
    // Digit sub of day and month not present since it does not make sense
    
    // Digit sub of above operations
    logChance('ds(day+month)', 1, studIndex === ds(d+m));
    logChance('ds(day-month)', 1, studIndex === ds(d-m));
    logChance('ds(month-day)', 1, studIndex === ds(m-d));
    
    //? Digit SUB REVERSED
    // Digit sub reversed of day and month not present since it does not make sense
    
    // Digit sub reversed of above operations
    logChance('dsr(day+month)', 1, studIndex === dsr(d+m));
    logChance('dsr(day-month)', 1, studIndex === dsr(d-m));
    logChance('dsr(month-day)', 1, studIndex === dsr(m-d));
    
    // Sum all the digits in the date
    logChance('Add all digits in the date', 1, studIndex === da(d) + da(m) );


    return getStudentWeight();
}

function da(num) {
    num = num.toString();
    numArray = num.split('');

    let sum = 0;

    for (const digit of numArray) {
        sum += parseInt(digit);
    }

    console.log(`[DEBUG] digit addition of ${num} is ${sum}`);

    return sum;
}

function ds(num) {
    num = num.toString();
    numArray = num.split('');

    let sum = parseInt(numArray.shift()); // Remove the first digit and store it in sum

    for (const digit of numArray) {
        sum -= parseInt(digit);
    }

    return sum;
}

function dsr(num) {
    num = num.toString();
    numArray = num.split('').reverse();

    let sum = parseInt(numArray.shift()); // Remove the first digit and store it in sum

    for (const digit of numArray) {
        sum -= parseInt(digit);
    }

    return sum;
}

function logChance(name, weight, isValid) {
    chances.push({
        name,
        weight,
        isValid
    })
}

function getStudentWeight() {
    let studentWeight = 1; // Start with 1 as anyone can get to hell

    for (const chance of chances) {
        if (chance.isValid) {
            console.log(`[tripped] "${chance.name}" chance check`)
            studentWeight += chance.weight;
        }
    }

    return studentWeight;
}

function drawStudentResult(studentResult) {
    const bar = "▓".repeat(studentResult.weight / (1/100));
    const weightPerc = Math.round(studentResult.weight * 100000) / 1000;

    console.log(`#${studentResult.studentNo} ${studentResult.studentName}\t${weightPerc}%\t${bar}`);
}

main();