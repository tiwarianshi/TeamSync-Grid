// src/views/BoardView.jsx
import React, { useState, useMemo } from 'react';
import { Power, Search, Plus, Zap, LayoutGrid, Users, ZapOff } from 'lucide-react';
import { TaskCard } from '../components/TaskCard.jsx';
import { TaskModal } from '../components/TaskModal.jsx';
import { MemberManagerModal } from '../components/MemberManagerModal.jsx';
import { STAGE_MAP } from '../utils/constants.js';

/**
 * The main Kanban board view.
 */
export const BoardView = ({ userId, userPersona, activeBoardId, activeBoard, setView, tasks, saveTask, deleteTask, updateTaskStage, logout }) => {
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [modal, setModal] = useState({ isOpen: false, task: null, stage: 'todo' });
    const [isMemberManagerOpen, setIsMemberManagerOpen] = useState(false);

    const boardName = activeBoard?.name || "No Grid Selected";

    const handleDragStart = (e, taskId) => {
        e.dataTransfer.setData("taskId", taskId);
        e.currentTarget.classList.add('opacity-50', 'border-dashed', 'border-4', 'border-red-500');
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, targetStage) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData("taskId");
        const taskToUpdate = tasks.find(t => t.id === taskId);

        // Remove drag styles on drop
        e.currentTarget.classList.remove('border-dashed', 'border-4', STAGE_MAP[targetStage].text.replace('text', 'border'));

        if (!activeBoardId || !taskToUpdate || taskToUpdate.stage === targetStage) return;

        updateTaskStage(taskId, targetStage);
    };

    const handleDragEnter = (e, stageKey) => {
        e.currentTarget.classList.add('border-dashed', 'border-4', STAGE_MAP[stageKey].text.replace('text', 'border'));
    };

    const handleDragLeave = (e, stageKey) => {
        e.currentTarget.classList.remove('border-dashed', 'border-4', STAGE_MAP[stageKey].text.replace('text', 'border'));
    };

    const filteredAndSortedTasks = useMemo(() => {
        let filtered = tasks;
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            filtered = tasks.filter(task =>
                task.title?.toLowerCase().includes(lowerQuery) ||
                task.description?.toLowerCase().includes(lowerQuery) ||
                task.assignedTo?.toLowerCase().includes(lowerQuery)
            );
        }
        return filtered.sort((a, b) => (a.order || 0) - (b.order || 0));
    }, [tasks, searchQuery]);

    const tasksByStage = (stage) => filteredAndSortedTasks.filter(task => task.stage === stage);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-500 text-3xl font-bold">
                <Zap className="w-8 h-8 mr-3 animate-pulse" /> Zords Mobilizing...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
            <header className="sticky top-0 z-40 bg-gray-800 shadow-xl p-4 border-b-4 border-red-600">
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    <button onClick={() => setView('home')} className="flex items-center text-3xl font-extrabold text-red-500 uppercase tracking-wider hover:text-yellow-400 transition">
                        <Power className="w-6 h-6 inline-block mr-2 text-yellow-400" /> TeamSync Grid
                    </button>

                    <div className="flex items-center space-x-4 w-full md:w-auto">
                        <div
                            onClick={() => setView('grid_setup')}
                            className="hidden md:flex items-center text-sm font-semibold p-2 px-4 rounded-full bg-gray-700 hover:bg-gray-600 cursor-pointer transition duration-300 border border-blue-500"
                            title="Click to change mission grid"
                        >
                            <LayoutGrid className="w-4 h-4 mr-2 text-blue-400" />
                            <span className="text-blue-400">{boardName}</span>
                        </div>

                        {activeBoardId && (
                            <button
                                onClick={() => setIsMemberManagerOpen(true)}
                                className="hidden sm:inline-flex items-center px-3 py-2 border border-red-400 text-sm font-medium rounded-full shadow-lg text-red-400 bg-gray-900 hover:bg-red-400 hover:text-gray-900 transition duration-300"
                            >
                                <Users className="w-4 h-4 mr-2" /> Manage Rangers
                            </button>
                        )}

                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search Zord Missions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-700 border border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                            />
                        </div>

                        <button
                            onClick={() => setView('grid_setup')}
                            className="p-2 rounded-full bg-red-600 hover:bg-red-700 transition duration-300 md:hidden"
                            title="Select Grid"
                        >
                            <LayoutGrid className="w-6 h-6 text-white" />
                        </button>
                        {activeBoardId && (
                            <button
                                onClick={() => setIsMemberManagerOpen(true)}
                                className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition duration-300 md:hidden"
                                title="Manage Members"
                            >
                                <Users className="w-6 h-6 text-white" />
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-grow p-4 md:p-8 overflow-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {Object.entries(STAGE_MAP).map(([stageKey, stageInfo]) => (
                        <div
                            key={stageKey}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, stageKey)}
                            onDragEnter={(e) => handleDragEnter(e, stageKey)}
                            onDragLeave={(e) => handleDragLeave(e, stageKey)}
                            className={`p-4 rounded-xl shadow-2xl ${stageInfo.secondary} transition duration-500 transform hover:shadow-[0_0_40px_rgba(255,0,0,0.5)]`}
                        >
                            <div className={`flex justify-between items-center p-3 rounded-t-lg mb-4 font-bold uppercase text-lg tracking-wider ${stageInfo.color} ${stageInfo.text}`}>
                                <h2>{stageInfo.name}</h2>
                                <span className="text-xl">{tasksByStage(stageKey).length}</span>
                            </div>

                            <div className="min-h-[200px] space-y-3">
                                {tasksByStage(stageKey).map(task => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        onEdit={(t) => setModal({ isOpen: true, task: t, stage: stageKey })}
                                        onDelete={deleteTask}
                                        onDragStart={handleDragStart}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={() => setModal({ isOpen: true, task: null, stage: stageKey })}
                                className={`w-full mt-4 py-2 rounded-lg font-bold text-sm text-gray-900 transition duration-300 ${stageInfo.color} ${stageInfo.hover} shadow-lg hover:shadow-xl hover:scale-[1.01]`}
                            >
                                <Plus className="w-4 h-4 inline-block mr-1" /> Add Mission
                            </button>
                        </div>
                    ))}
                </div>
            </main>

            {modal.isOpen && (
                <TaskModal
                    task={modal.task}
                    stage={modal.stage}
                    closeModal={() => setModal({ isOpen: false, task: null, stage: 'todo' })}
                    saveTask={saveTask}
                    userPersona={userPersona}
                />
            )}

            {isMemberManagerOpen && activeBoardId && (
                <MemberManagerModal
                    activeBoard={activeBoard}
                    userId={userId}
                    closeModal={() => setIsMemberManagerOpen(false)}
                />
            )}

            <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2">
                <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-700 text-white rounded-lg shadow-lg hover:bg-red-800 transition duration-300 text-sm font-semibold"
                >
                    <ZapOff className="w-4 h-4 inline-block mr-1" /> Log Out ({userPersona})
                </button>

                <div className="bg-gray-800 text-yellow-400 p-2 rounded-lg shadow-xl text-xs">
                    Ranger ID: {userId}
                </div>
            </div>

        </div>
    );
};
