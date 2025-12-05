// src/views/GridSetupView.jsx
import React, { useState } from 'react';
import { LayoutGrid } from 'lucide-react';

/**
 * View for selecting or creating a Mission Grid (Board).
 */
export const GridSetupView = ({
  boards,
  activeBoardId,
  setActiveBoardId,
  createBoard,
  setView,
  userId,
  userPersona
}) => {

  const [newBoardName, setNewBoardName] = useState('');
  const [creationLoading, setCreationLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateBoard = () => {
    if (!newBoardName.trim()) return;

    setError('');
    setCreationLoading(true);
    setTimeout(() => {
      createBoard(newBoardName.trim(), userPersona);
      setNewBoardName('');
      setCreationLoading(false);
      setView('board');
    }, 500);
  };

  const handleSelectBoard = (boardId) => {
    setActiveBoardId(boardId);
    setView('board');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
      <div className="w-full max-w-xl p-8 space-y-8 bg-gray-800 rounded-2xl shadow-[0_0_50px_rgba(255,165,0,0.5)] border-2 border-yellow-600">

        <h1 className="text-4xl font-extrabold text-yellow-500 text-center uppercase tracking-widest flex items-center justify-center">
          <LayoutGrid className="w-8 h-8 mr-2 animate-pulse" /> Choose Your Mission Grid
        </h1>

        <p className="text-center text-gray-400">
          Ranger ID: {userId} | Persona: <span className="text-red-400 font-bold">{userPersona}</span>
        </p>

        {/* ---- JOIN EXISTING BOARD ---- */}
        <div className="p-4 bg-gray-700 rounded-xl">
          <h2 className="text-2xl font-bold mb-4 text-blue-400">Join Existing Mission</h2>

          <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
            {boards.length === 0 ? (
              <p className="text-gray-400">No active Mission Grids found. Create one below!</p>
            ) : (
              boards.map(board => (
                <div
                  key={board.id}
                  onClick={() => handleSelectBoard(board.id)}
                  className={`p-3 rounded-lg flex justify-between items-center cursor-pointer transition duration-300 transform hover:bg-gray-600 
                    ${board.id === activeBoardId ? 'bg-yellow-800 border border-yellow-500 shadow-md scale-[1.02]' : 'bg-gray-600'}`}
                >
                  <span className="font-semibold text-gray-100">{board.name}</span>
                  <span className="text-xs text-gray-400">Rangers: {board.members?.length || 1}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ---- CREATE BOARD ---- */}
        <div className="space-y-3 p-4 bg-gray-700 rounded-xl border border-red-500">
          <h2 className="text-2xl font-bold text-red-400">Create New Mission Grid</h2>

          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="New Grid Name (e.g., Megazord Repairs)"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              className="flex-grow p-3 bg-gray-600 border border-gray-500 rounded-lg text-gray-100 focus:ring-red-500 focus:border-red-500"
              required
            />

            <button
              onClick={handleCreateBoard}
              disabled={creationLoading || !newBoardName.trim()}
              className="px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition duration-300 disabled:opacity-50 flex items-center"
            >
              {creationLoading ? 'Launching...' : 'Launch Grid'}
            </button>
          </div>

          {error && <p className="text-sm text-yellow-400 font-bold mt-2">{error}</p>}
        </div>

        <div className="text-center">
          <button
            onClick={() => setView('home')}
            className="text-sm text-gray-500 hover:text-gray-300 transition duration-300 underline"
          >
            &larr; Back to Command Center
          </button>
        </div>

      </div>
    </div>
  );
};
