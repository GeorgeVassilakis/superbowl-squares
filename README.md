# Super Bowl LIX Squares 🏈

A digital Super Bowl squares board for Super Bowl LIX between the Kansas City Chiefs and the Philadelphia Eagles. This web application allows participants to view their squares and track winners throughout the game.

## Features

- 10x10 grid with randomly assigned squares based on participant entries
- Live display of current winning square with flashing animation
- Quarter-by-quarter winner tracking
- Trophy indicators for previous quarter winners
- Responsive design that works on both desktop and mobile
- Team-colored interface (Chiefs red and Eagles green)

## How It Works

- The top row (x-axis) represents the Eagles' score digit
- The left column (y-axis) represents the Chiefs' score digit
- Winners are determined by matching the last digit of each team's score at the end of each quarter
- Each winner receives $125 per quarter

## Technical Details

This project is built with:
- React
- Vite
- Tailwind CSS
- PapaParse (for CSV processing)
- Lucide React (for icons)
- GitHub Pages (for hosting)

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the main branch. You can view the live site at: https://yourusername.github.io/SuperBowl-squares/

## License

MIT License - feel free to use and modify for your own Super Bowl squares!