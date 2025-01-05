import React, { useState } from 'react';
import AddTaskPopup from './AddTaskPopup';
import EditTaskPopup from './EditTaskPopup';

type Task = {
  _id: string;
  title: string;
  priority: number;
  status: 'Pending' | 'Finished';
  start_time: string;
  end_time: string;
  total_time: number;
};

type TaskListProps = {
  tasks: Task[];
  onAddTask: (newTask: Omit<Task, '_id'>) => void;
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTasks: (taskIds: string[]) => void;
};

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTasks,
}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [sortOption, setSortOption] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const tasksPerPage = 5;
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  const openEditPopup = (task: Task) => {
    setSelectedTask(task);
    setIsEditPopupOpen(true);
  };

  const closeEditPopup = () => {
    setSelectedTask(null);
    setIsEditPopupOpen(false);
  };

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks((prev) => {
      const updated = new Set(prev);
      if (updated.has(taskId)) {
        updated.delete(taskId);
      } else {
        updated.add(taskId);
      }
      return updated;
    });
  };

  const deleteSelectedTasks = () => {
    onDeleteTasks(Array.from(selectedTasks));
    setSelectedTasks(new Set());
  };

  const filteredTasks = tasks
    .filter((task) => (priorityFilter ? task.priority === priorityFilter : true))
    .filter((task) => (statusFilter ? task.status === statusFilter : true));

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOption === 'Start time: ASC') {
      return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
    }
    if (sortOption === 'Start time: DESC') {
      return new Date(b.start_time).getTime() - new Date(a.start_time).getTime();
    }
    if (sortOption === 'End time: ASC') {
      return new Date(a.end_time).getTime() - new Date(b.end_time).getTime();
    }
    if (sortOption === 'End time: DESC') {
      return new Date(b.end_time).getTime() - new Date(a.end_time).getTime();
    }
    return 0;
  });

  const paginatedTasks = sortedTasks.slice(
    (currentPage - 1) * tasksPerPage,
    currentPage * tasksPerPage
  );

  return (
    <div className="p-6">
      <div className="mb-4 flex gap-4">
        <button
          onClick={() => setIsAddPopupOpen(true)}
          className="bg-purple-500 text-white px-4 py-2 rounded shadow"
        >
          + Add Task
        </button>
        <button
          onClick={deleteSelectedTasks}
          className="bg-red-500 text-white px-4 py-2 rounded shadow"
        >
          Delete Selected
        </button>
      </div>

      <div className="flex gap-6 mb-4">
        <div>
          <label className="block font-semibold mb-2">Sort</label>
          <select
            className="border border-gray-300 px-2 py-1 rounded"
            value={sortOption || ''}
            onChange={(e) => setSortOption(e.target.value || null)}
          >
            <option value="">Select Sort</option>
            <option>Start time: ASC</option>
            <option>Start time: DESC</option>
            <option>End time: ASC</option>
            <option>End time: DESC</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-2">Priority</label>
          <select
            className="border border-gray-300 px-2 py-1 rounded"
            value={priorityFilter || ''}
            onChange={(e) =>
              setPriorityFilter(e.target.value ? parseInt(e.target.value) : null)
            }
          >
            <option value="">All Priorities</option>
            {[1, 2, 3, 4, 5].map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-2">Status</label>
          <select
            className="border border-gray-300 px-2 py-1 rounded"
            value={statusFilter || ''}
            onChange={(e) => setStatusFilter(e.target.value || null)}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Finished">Finished</option>
          </select>
        </div>
      </div>

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedTasks(new Set(tasks.map((task) => task._id)));
                  } else {
                    setSelectedTasks(new Set());
                  }
                }}
                checked={selectedTasks.size === tasks.length}
              />
            </th>
            <th className="border border-gray-300 p-2">Task ID</th>
            <th className="border border-gray-300 p-2">Title</th>
            <th className="border border-gray-300 p-2">Priority</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Start Time</th>
            <th className="border border-gray-300 p-2">End Time</th>
            <th className="border border-gray-300 p-2">Edit</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTasks.map((task) => (
            <tr key={task._id} className="hover:bg-gray-100">
              <td className="border border-gray-300 p-2 text-center">
                <input
                  type="checkbox"
                  onChange={() => toggleTaskSelection(task._id)}
                  checked={selectedTasks.has(task._id)}
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">{task._id}</td>
              <td className="border border-gray-300 p-2">{task.title}</td>
              <td className="border border-gray-300 p-2 text-center">{task.priority}</td>
              <td className="border border-gray-300 p-2 text-center">{task.status}</td>
              <td className="border border-gray-300 p-2">
                {task.start_time ? new Date(task.start_time).toLocaleString() : 'N/A'}
              </td>
              <td className="border border-gray-300 p-2">
                {task.end_time ? new Date(task.end_time).toLocaleString() : 'N/A'}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <button
                  onClick={() => openEditPopup(task)}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 mx-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2 mx-1">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-4 py-2 mx-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {isAddPopupOpen && (
        <AddTaskPopup
          onSave={(newTask) => {
            onAddTask(newTask);
            setIsAddPopupOpen(false);
          }}
          onClose={() => setIsAddPopupOpen(false)}
        />
      )}

      {isEditPopupOpen && selectedTask && (
        <EditTaskPopup
          task={selectedTask}
          onSave={(updatedTask) => {
            onUpdateTask(updatedTask);
            closeEditPopup();
          }}
          onClose={closeEditPopup}
        />
      )}
    </div>
  );
};

export default TaskList;
