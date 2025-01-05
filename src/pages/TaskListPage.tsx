import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskList from '../components/TaskList';

type Task = {
  _id: string;
  title: string;
  priority: number;
  status: 'Pending' | 'Finished';
  start_time: string;
  end_time: string;
  total_time: number;
};

const TaskListPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('https://reunion-assignment-backend-production-0ca3.up.railway.app/api/tasks');
        const mappedTasks = response.data.map((task: any) => ({
          ...task,
          start_time: task.startTime,
          end_time: task.endTime,
        }));
        console.log('Mapped Tasks:', mappedTasks);
        setTasks(mappedTasks);
      } catch (err) {
        setError('Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };
  
    fetchTasks();
  }, [tasks]);
  

  const addTask = async (newTask: Omit<Task, '_id'>) => {
    try {
        console.log('Task payload being sent:', newTask);
        const response = await axios.post('https://reunion-assignment-backend-production-0ca3.up.railway.app/api/tasks', newTask);
        setTasks((prev) => [...prev, response.data]);
    } catch (err) {
        const error = err as any;
        console.error('Failed to add task:', error.response?.data || error.message);
        setError(error.response?.data?.error || 'Failed to add task');
    }
};


  const updateTask = async (updatedTask: Task) => {
    try {
      await axios.put(`https://reunion-assignment-backend-production-0ca3.up.railway.app/api/tasks/${updatedTask._id}`, updatedTask);
      setTasks((prev) =>
        prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const deleteTasks = async (taskIds: string[]) => {
    try {
      await axios.delete('https://reunion-assignment-backend-production-0ca3.up.railway.app/api/tasks', {
        data: { ids: taskIds },
      });
      setTasks((prev) => prev.filter((task) => !taskIds.includes(task._id)));
    } catch (err) {
      setError('Failed to delete tasks');
    }
  };

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Task List</h1>
      <TaskList
        tasks={tasks}
        onAddTask={addTask}
        onUpdateTask={updateTask}
        onDeleteTasks={deleteTasks}
      />
    </div>
  );
};

export default TaskListPage;
 