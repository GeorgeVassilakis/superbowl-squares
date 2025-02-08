import fs from 'fs';
import Papa from 'papaparse';
import _ from 'lodash';

// Read the participants CSV
const participantsFile = fs.readFileSync('../public/participants.csv', 'utf-8');
const parsed = Papa.parse(participantsFile, { 
  header: true, 
  skipEmptyLines: true,
  dynamicTyping: true 
});

// Process participants data
const participants = parsed.data
  .filter(row => row['What is your name?'] && row['How many squares do you want?'])
  .map(row => ({
    name: row['What is your name?'].trim(),
    squares: row['How many squares do you want?']
  }));

// Validate total squares
const totalSquares = participants.reduce((sum, p) => sum + p.squares, 0);
if (totalSquares !== 100) {
  throw new Error(`Invalid total squares: ${totalSquares}. Expected 100.`);
}

// Create array of names based on number of squares
const nameArray = participants.flatMap(p => 
  Array(p.squares).fill(p.name)
);

// Shuffle the names
const shuffledNames = _.shuffle(nameArray);

// Create grid data
const gridData = Array(10).fill(null).map((_, row) => 
  Array(10).fill(null).map((_, col) => {
    const index = row * 10 + col;
    return {
      row,
      col,
      name: shuffledNames[index]
    };
  })
).flat();

// Convert to CSV
const csv = Papa.unparse(gridData);

// Save to static_squares.csv
fs.writeFileSync('../public/static_squares.csv', csv);

console.log('Successfully generated static_squares.csv!'); 