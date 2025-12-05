// src/components/TaskCard.jsx
import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { STAGE_MAP } from '../utils/constants.js';

/**
 * Renders a single task card in the Kanban column.
 */
export const TaskCard = ({ task, onEdit, onDelete, onDragStart }) => {
    const assignedRanger = task.assignedTo || 'Alpha 5';
    const stageInfo = STAGE_MAP[task.stage] || STAGE_MAP.todo;

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, task.id)}
            onDragEnd={(e) => e.currentTarget.classList.remove('opacity-50', 'border-dashed', 'border-4', 'border-red-500')}
            className={`p-4 mb-3 rounded-lg shadow-xl ${stageInfo.secondary} border-l-4 border-red-500 cursor-grab transition duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,0,0.7)]`}
        >
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-md text-gray-900">{task.title}</h4>
                <div className="flex space-x-1">
                    <button onClick={() => onEdit(task)} className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-white transition"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => onDelete(task.id)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-white transition"><Trash2 className="w-4 h-4" /></button>
                </div>
            </div>
            <p className="text-sm text-gray-700 mb-3">{task.description}</p>
            <div className="flex justify-between items-center text-xs">
                <span className="font-semibold px-2 py-1 rounded-full inline-block text-white bg-red-600">
                    Assigned: {assignedRanger}
                </span>
                <span className="text-gray-500">Simulated Update</span>
            </div>
        </div>
    );
};
