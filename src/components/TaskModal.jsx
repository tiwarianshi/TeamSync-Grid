// src/components/TaskModal.jsx
import React, { useState, useMemo } from 'react';
import { STAGE_MAP, RANGER_OPTIONS } from '../utils/constants.js';

/**
 * Modal for creating or editing a task.
 */
export const TaskModal = ({ task, stage, closeModal, saveTask, userPersona }) => {
    const [title, setTitle] = useState(task ? task.title : '');
    const [description, setDescription] = useState(task ? task.description : '');
    const [assignedTo, setAssignedTo] = useState(task ? task.assignedTo : userPersona);

    const assignmentOptions = useMemo(() => {
        const staff = ['Zordon', 'Alpha 5'];
        let rangers = RANGER_OPTIONS.map(r => r.name);
        if (userPersona && !rangers.includes(userPersona)) {
            rangers.push(userPersona);
        }
        if (assignedTo && !rangers.includes(assignedTo) && !staff.includes(assignedTo)) {
            rangers.push(assignedTo);
        }
        return [...staff, ...rangers].sort();
    }, [assignedTo, userPersona]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !description) return;

        const newTask = {
            id: task ? task.id : `new-${Date.now()}`,
            title,
            description,
            assignedTo,
            stage: task ? task.stage : stage,
        };
        saveTask(newTask);
        closeModal();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={closeModal}>
            <div className="bg-gray-800 p-6 rounded-xl w-full max-w-lg shadow-[0_0_70px_rgba(0,255,255,0.7)] border-2 border-blue-600 transition duration-500 transform hover:scale-[1.01]" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-3xl font-bold mb-4 text-blue-500">{task ? 'Edit Mission' : `New ${STAGE_MAP[stage].name} Mission`}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Task Title (Mission Briefing)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                    <textarea
                        placeholder="Detailed Description (Action Plan)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="4"
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                    <select
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                    >
                        {assignmentOptions.map(name => (
                            <option key={name} value={name}>{name} {name === userPersona && "(You)"}</option>
                        ))}
                    </select>
                    <div className="flex justify-end space-x-4 pt-2">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition duration-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`px-6 py-2 ${STAGE_MAP.progress.color} text-white rounded-lg font-semibold hover:bg-yellow-500 transition duration-300 transform hover:scale-[1.05]`}
                        >
                            {task ? 'Update Mission' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
