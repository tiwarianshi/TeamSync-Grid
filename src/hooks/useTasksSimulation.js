// src/hooks/useTasksSimulation.js
import React, { useState, useMemo } from 'react';
import { INITIAL_TASKS } from '../utils/constants';

/**
 * Manages the state and logic for tasks, filtered by the active board.
 */
export const useTasksSimulation = (activeBoardId) => {
    const [tasks, setTasks] = useState(INITIAL_TASKS);

    // Memoize the tasks relevant to the active board
    const activeTasks = useMemo(() => {
        if (!activeBoardId) return [];
        // Sort by order for initial display consistency
        return tasks.filter(t => t.boardId === activeBoardId).sort((a, b) => (a.order || 0) - (b.order || 0));
    }, [tasks, activeBoardId]);

    const saveTask = (task) => {
        if (tasks.some(t => t.id === task.id)) {
            setTasks(prev => prev.map(t => t.id === task.id ? { ...t, ...task } : t));
        } else {
            setTasks(prev => [...prev, {
                ...task,
                id: `t-${Date.now()}`,
                // Assign a high order number to appear at the end of the column
                order: Date.now(),
                boardId: activeBoardId
            }]);
        }
    };

    const deleteTask = (taskId) => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
    };

    const updateTaskStage = (taskId, newStage) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, stage: newStage, order: Date.now() } : t));
    };

    return { tasks: activeTasks, saveTask, deleteTask, updateTaskStage };
};
