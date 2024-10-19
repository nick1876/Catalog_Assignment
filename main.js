// Importing the necessary libraries for file system and JSON handling
const fs = require('fs');

// Function to decode the value from its given base
function decodeValue(base, value) {
    return parseInt(value, base);  // Convert the value from the specified base to decimal
}

// Function to perform Lagrange Interpolation and find the constant term 'c'
function lagrangeInterpolation(points) {
    let constantTerm = 0;

    points.forEach((pointI, i) => {
        const [xi, yi] = pointI;
        let li = 1;

        points.forEach((pointJ, j) => {
            if (i !== j) {
                const [xj] = pointJ;
                li *= (0 - xj) / (xi - xj);  // Lagrange basis polynomial at x = 0
            }
        });

        constantTerm += yi * li;  // Accumulate weighted yi values
    });

    return Math.round(constantTerm);  // Return rounded constant term 'c'
}

// Main function to read the JSON input and solve for the secret constant
function findSecretFromJSON(jsonFilePath) {
    // Read and parse the input JSON file
    const data = JSON.parse(fs.readFileSync(jsonFilePath));

    // Extract the required number of points 'k' from the input
    const { k } = data.keys;

    // Prepare an array to hold (x, y) points for interpolation
    const points = Object.keys(data)
        .filter(key => key !== 'keys')  // Ignore the 'keys' object
        .slice(0, k)                    // Take only the first 'k' points
        .map(key => {
            const { base, value } = data[key];
            return [parseInt(key), decodeValue(parseInt(base), value)];
        });

    // Find the constant term 'c' using Lagrange interpolation
    const secret = lagrangeInterpolation(points);

    // Output the result
    console.log(`Secret for ${jsonFilePath}:`, secret);
}

// Execute the function with provided input file(s)
findSecretFromJSON('input.json');
findSecretFromJSON('input1.json');

