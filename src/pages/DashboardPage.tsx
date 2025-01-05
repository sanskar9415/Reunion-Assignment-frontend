// src/pages/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DashboardPage: React.FC = () => {
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedPercentage, setCompletedPercentage] = useState(0);
  const [pendingPercentage, setPendingPercentage] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [totalTimeLapsed, setTotalTimeLapsed] = useState(0);
  const [totalTimeToFinish, setTotalTimeToFinish] = useState(0);
  const [averageCompletionTime, setAverageCompletionTime] = useState<number | null>(null);
  const [pendingTaskSummary, setPendingTaskSummary] = useState<any[]>([]);

  useEffect(() => {
    const fetchStatistics = async () => {
        try {
            const response = await axios.get('https://reunion-assignment-backend-production-0ca3.up.railway.app/api/tasks/statistics');
            const {
              totalTasks,
              completedPercentage,  
              pendingPercentage,
              pendingTasks,
              totalTimeLapsed,
              totalTimeToFinish,
              averageCompletionTime,
              pendingTaskSummary,
            } = response.data;

        setTotalTasks(totalTasks);
        setCompletedPercentage(completedPercentage);
        setPendingPercentage(pendingPercentage);
        setPendingTasks(pendingTasks);
        setTotalTimeLapsed(totalTimeLapsed);
        setTotalTimeToFinish(totalTimeToFinish);
        setAverageCompletionTime(averageCompletionTime);
        setPendingTaskSummary(pendingTaskSummary);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Total Tasks</h2>
          <p className="text-2xl font-bold text-purple-600">{totalTasks}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Tasks Completed</h2>
          <p className="text-2xl font-bold text-purple-600">{completedPercentage}%</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Tasks Pending</h2>
          <p className="text-2xl font-bold text-purple-600">{pendingPercentage}%</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Avg Time per Task</h2>
          <p className="text-2xl font-bold text-purple-600">
            {averageCompletionTime !== null && !isNaN(averageCompletionTime) ? `${averageCompletionTime.toFixed(1)} hrs` : 'N/A'}
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Pending Task Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-100 p-4 rounded shadow">
            <h3 className="text-xl font-semibold">Pending Tasks</h3>
            <p className="text-2xl font-bold text-purple-600">{pendingTasks}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded shadow">
            <h3 className="text-xl font-semibold">Total Time Lapsed</h3>
            <p className="text-2xl font-bold text-purple-600">{totalTimeLapsed} hrs</p>
          </div>
          <div className="bg-gray-100 p-4 rounded shadow">
            <h3 className="text-xl font-semibold">Total Time to Finish</h3>
            <p className="text-2xl font-bold text-purple-600">{totalTimeToFinish} hrs</p>
          </div>
        </div>

        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Task Priority</th>
              <th className="border border-gray-300 p-2">Pending Tasks</th>
              <th className="border border-gray-300 p-2">Time Lapsed (hrs)</th>
              <th className="border border-gray-300 p-2">Time to Finish (hrs)</th>
            </tr>
          </thead>
          <tbody>
            {pendingTaskSummary.map((row, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2 text-center">{row.priority}</td>
                <td className="border border-gray-300 p-2 text-center">{row.pendingTasks}</td>
                <td className="border border-gray-300 p-2 text-center">{row.timeLapsed}</td>
                <td className="border border-gray-300 p-2 text-center">{row.timeToFinish}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;
