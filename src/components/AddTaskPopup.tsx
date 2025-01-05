import React, { useState } from 'react';

type Task = {
  title: string;
  priority: number;
  status: 'Pending' | 'Finished';
  start_time: string;
  end_time: string;
  total_time: number;
};

type AddTaskPopupProps = {
  onSave: (newTask: Task) => void;
  onClose: () => void;
};

const AddTaskPopup: React.FC<AddTaskPopupProps> = ({ onSave, onClose }) => {
  const [newTask, setNewTask] = useState<Omit<Task, 'total_time'>>({
    title: '',
    priority: 1,
    status: 'Pending',
    start_time: '',
    end_time: '',
  });

  const handleChange = (key: keyof Omit<Task, 'total_time'>, value: any) => {
    setNewTask((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!newTask.start_time || !newTask.end_time) {
        alert('Start time and end time are required.');
        return;
    }

    const start_time = new Date(newTask.start_time).toISOString();
    const end_time = new Date(newTask.end_time).toISOString();

    if (new Date(start_time) >= new Date(end_time)) {
        alert('Start time must be before end time.');
        return;
    }

    const total_time = (new Date(end_time).getTime() - new Date(start_time).getTime()) / 3600000;

    console.log('Task being sent to backend:', {
        ...newTask,
        start_time,
        end_time,
        total_time,
    });

    onSave({
        ...newTask,
        start_time,
        end_time,
        total_time,
    });
};


  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 w-[400px] shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add Task</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            value={newTask.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Priority</label>
          <input
            type="number"
            min="1"
            max="5"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            value={newTask.priority}
            onChange={(e) => handleChange('priority', parseInt(e.target.value))}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Status</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="Pending"
                checked={newTask.status === 'Pending'}
                onChange={() => handleChange('status', 'Pending')}
                className="mr-2"
              />
              Pending
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="Finished"
                checked={newTask.status === 'Finished'}
                onChange={() => handleChange('status', 'Finished')}
                className="mr-2"
              />
              Finished
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Start Time</label>
          <input
            type="datetime-local"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            value={newTask.start_time}
            onChange={(e) => handleChange('start_time', e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">End Time</label>
          <input
            type="datetime-local"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            value={newTask.end_time}
            onChange={(e) => handleChange('end_time', e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskPopup;
