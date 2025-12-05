// src/hooks/useBoardsSimulation.js
import React, { useState, useMemo } from 'react';
import { INITIAL_BOARDS, FIRST_BOARD_ID } from '../utils/constants';

/**
* Simulates board selection and management.
*/
export const useBoardsSimulation = (userId, rangerPersona) => {
const [boards, setBoards] = useState(INITIAL_BOARDS);
const [activeBoardId, setActiveBoardId] = useState(FIRST_BOARD_ID);

const activeBoard = useMemo(() => boards.find(b => b.id === activeBoardId), [boards,
activeBoardId]);

const createBoard = (name, ownerPersona) => {
const newBoard = {
id: `grid-${Date.now()}`,
name: name,
ownerId: userId,
members: [{ uid: userId, displayName: ownerPersona }],
};

setBoards(prev => [...prev, newBoard]);
setActiveBoardId(newBoard.id);
};

return { boards, activeBoardId, activeBoard, setActiveBoardId, createBoard };
};