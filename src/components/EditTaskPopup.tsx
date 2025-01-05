import React, { useState } from 'react';

type Task = {
  _id: string;
  title: string;
  priority: number;
  status: 'Pending' | 'Finished';
  start_time: string;
  end_time: string;
  total_time: number;
};

type EditTaskPopupProps = {
  task: Task;
  onSave: (updatedTask: Task) => void;
  onClose: () => void;
};

const EditTaskPopup: React.FC<EditTaskPopupProps> = ({ task, onSave, onClose }) => {
  const [editedTask, setEditedTask] = useState<Task>(task);

  const handleChange = (key: keyof Task, value: any) => {
    setEditedTask((prev) => {
      if (key === 'status' && value === 'Finished') {
        return {
          ...prev,
          [key]: value,
          end_time: new Date().toISOString(),
        };
      }
      return { ...prev, [key]: value };
    });
  };

  const handleSave = () => {
    if (editedTask.start_time && editedTask.end_time) {
      const startTime = new Date(editedTask.start_time).getTime();
      const endTime = new Date(editedTask.end_time).getTime();

      if (startTime >= endTime) {
        alert('Start time must be before end time.');
        return;
      }
    }
    onSave(editedTask);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 w-[400px] shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            value={editedTask.title}
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
            value={editedTask.priority}
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
                checked={editedTask.status === 'Pending'}
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
                checked={editedTask.status === 'Finished'}
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
            value={editedTask.start_time}
            onChange={(e) => handleChange('start_time', e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">End Time</label>
          <input
            type="datetime-local"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            value={editedTask.end_time}
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
            className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskPopup;
