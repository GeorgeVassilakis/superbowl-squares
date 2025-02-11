import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Trophy, Loader } from 'lucide-react';
import _ from 'lodash';

const ADMIN_PASSWORD = 'superbowl2024'; // You should change this to your desired password

const SuperBowlSquares = () => {
  const [squares, setSquares] = useState(Array(100).fill(null));
  const [score, setScore] = useState({ chiefs: 0, eagles: 0 });
  const [quarterWinners, setQuarterWinners] = useState({});
  const [currentQuarter, setCurrentQuarter] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [keyPresses, setKeyPresses] = useState([]);

  useEffect(() => {
    loadAndAssignNames();
    loadGameState();

    // Key press handler for admin panel
    const handleKeyPress = (e) => {
      if (e.key === 'a') {
        const now = Date.now();
        setKeyPresses(prev => {
          const newPresses = [...prev, now].filter(time => now - time < 1000);
          if (newPresses.length === 3) {
            setShowAdmin(true);
            return [];
          }
          return newPresses;
        });
      } else if (e.key === 'Escape') {
        setShowAdmin(false);
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, []);

  const loadGameState = async () => {
    try {
      const res = await fetch('gameState.json');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const gameState = await res.json();
      setScore(gameState.score);
      setQuarterWinners(gameState.quarterWinners);
      setCurrentQuarter(gameState.currentQuarter);
    } catch (error) {
      console.error('Error loading game state:', error);
      // If there's an error loading game state, we'll just use the defaults
    }
  };

  const loadAndAssignNames = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('static_squares.csv');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const response = await res.text();
      const parsed = Papa.parse(response, { 
        header: true, 
        skipEmptyLines: true,
        dynamicTyping: true 
      });
      
      // Convert the parsed data back into our squares array
      const squaresArray = new Array(100).fill(null);
      parsed.data.forEach(square => {
        const index = square.row * 10 + square.col;
        squaresArray[index] = square.name;
      });
      
      setSquares(squaresArray);
    } catch (error) {
      console.error('Error loading squares:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getLastDigit = (num) => num % 10;

  const getWinningSquareIndex = () => {
    const chiefsDigit = getLastDigit(score.chiefs);
    const eaglesDigit = getLastDigit(score.eagles);
    return chiefsDigit * 10 + eaglesDigit;
  };

  const handleAdminAuth = (e) => {
    e.preventDefault();
    const password = e.target.password.value;
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    }
    e.target.reset();
  };

  const updateScore = (team, value) => {
    setScore(prev => ({
      ...prev,
      [team]: Math.max(0, prev[team] + value)
    }));
  };

  const lockQuarter = () => {
    const winningIndex = getWinningSquareIndex();
    setQuarterWinners(prev => ({
      ...prev,
      [currentQuarter]: {
        name: squares[winningIndex],
        score: `${score.chiefs}-${score.eagles}`
      }
    }));
    setCurrentQuarter(prev => Math.min(4, prev + 1));
  };

  const resetGame = () => {
    if (window.confirm('Are you sure you want to reset the game? This will clear all scores and winners.')) {
      setScore({ chiefs: 0, eagles: 0 });
      setQuarterWinners({});
      setCurrentQuarter(1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading squares...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-2 md:p-4">
      <div className="mb-6 md:mb-8 text-center">
        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text mb-2">
          GO BIRRRRRRRRRRRDS!!!!!!!!!!!
        </h1>
        <div className="text-xl md:text-2xl font-bold">
          <span className="text-red-600">Chiefs</span> vs <span className="text-green-700">Eagles</span>
        </div>
      </div>
      
      {/* Score Display */}
      <div className="mb-8 md:mb-12 p-3 md:p-4 bg-gradient-to-r from-red-100 to-green-100 rounded-lg">
        <div className="text-xl md:text-2xl font-bold text-center">
          <div className="mb-2">Quarter {currentQuarter}</div>
          <span className="text-red-600">Chiefs {score.chiefs}</span> - <span className="text-green-700">Eagles {score.eagles}</span>
        </div>
      </div>

      {/* Grid Container */}
      <div className="flex justify-center mb-8 overflow-x-auto pb-4">
        <div className="min-w-fit">
          {/* Eagles Label */}
          <div className="text-center mb-4">
            <span className="font-bold text-green-700 text-base md:text-lg">Eagles →</span>
          </div>
          
          <div className="flex">
            {/* Chiefs Label */}
            <div className="pr-4 pt-12">
              <span className="font-bold text-red-600 text-base md:text-lg">Chiefs ↓</span>
            </div>

            {/* Main Grid */}
            <table className="border-collapse">
              <thead>
                <tr>
                  <th className="w-12 h-12 md:w-16 md:h-16 border bg-purple-100"></th>
                  {Array(10).fill(null).map((_, i) => (
                    <th key={i} className="w-12 h-12 md:w-16 md:h-16 border bg-green-100 text-center font-bold">
                      {i}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array(10).fill(null).map((_, row) => (
                  <tr key={row}>
                    <th className="w-12 h-12 md:w-16 md:h-16 border bg-red-100 text-center font-bold">
                      {row}
                    </th>
                    {Array(10).fill(null).map((_, col) => {
                      const index = row * 10 + col;
                      const isWinning = getWinningSquareIndex() === index;
                      const hasWon = Object.entries(quarterWinners).some(
                        ([quarter, winner]) => {
                          const winningIndex = (getLastDigit(parseInt(winner.score.split('-')[0])) * 10) + 
                                             getLastDigit(parseInt(winner.score.split('-')[1]));
                          return winningIndex === index;
                        }
                      );
                      
                      return (
                        <td
                          key={col}
                          className={`w-12 h-12 md:w-16 md:h-16 border text-center relative ${
                            isWinning ? 'animate-pulse bg-green-200' : ''
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1 p-1">
                            <span className="text-[10px] md:text-sm">{squares[index]}</span>
                            {hasWon && <Trophy size={12} className="text-yellow-500 md:size-4" />}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Winners Display */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Quarter Winners</h2>
        {Object.entries(quarterWinners).map(([quarter, winner]) => (
          <div key={quarter} className="mb-2">
            <p className="text-lg">
              🏆 {winner.name} has won $125 for quarter {quarter} with a score of {winner.score}, congrats!
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuperBowlSquares;