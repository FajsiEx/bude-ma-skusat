const input = require("input");

async function main() {
    const params = await getParams();

    console.log("Params get. Testing students for raw weights...")
    
    const studentWeights = testStudents(params);

    console.log("Balancing...")
    
    const balancedWeights = balanceWeights(studentWeights);

    console.log(balancedWeights);
}

async function getParams() {
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
        console.log(`Raw weight for student #${i} is ${studentWeight}`)
        studentWeights.push({
            studentNo: i,
            weight: studentWeight
        });
        i++;
    }

    return studentWeights;
}

let chances = []

function testStudentNo(studIndex, params) {
    chances = [];

    // Now let's check if I'm gonna go to hell
    logChance('same as day', 1, studIndex === params.dayNum);
    logChance('same as month', 0.5, studIndex === params.monthNum);

    return getStudentWeight();
}

function logChance(name, weight, isValid) {
    chances.push({
        name,
        weight,
        isValid
    })
}

function getStudentWeight() {
    let studentWeight = 0;

    for (const chance of chances) {
        if (chance.isValid) {
            studentWeight += chance.weight;
        }
    }

    return studentWeight;
}

main();