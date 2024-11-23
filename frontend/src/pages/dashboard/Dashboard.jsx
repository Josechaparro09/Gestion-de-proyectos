import { useEffect, useState } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { ProjectsOverview } from '../../components/dashboard/ProjectsOverview';
import { TasksProgress } from '../../components/dashboard/TasksProgress';
import { MetricsCards } from '../../components/dashboard/MetricsCards';
import { Loading } from '../../components/common/Loading';
import { Error } from '../../components/common/Error';
import api from '../../utils/axios';
import { useAuth } from '../../hooks/useAuth';

export const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const { user } = useAuth();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get('/metrics/dashboard', {
        params: {
          faculty: user.facultad,
          program: user.programa
        }
      });
      setDashboardData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} retry={fetchDashboardData} />;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Dashboard
            </h2>
          </div>
        </div>

        <MetricsCards data={dashboardData} />
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ProjectsOverview data={dashboardData.projects_summary} />
          <TasksProgress data={dashboardData.tasks_summary} />
        </div>
      </div>
    </MainLayout>
  );
};