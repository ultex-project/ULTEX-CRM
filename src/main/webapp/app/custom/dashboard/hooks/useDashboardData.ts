import { useState, useEffect } from 'react';
import axios from 'axios';

type DashboardData = {
  activeClients: number;
  newProspects: number;
  totalOpportunityAmount: number;
};

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, prospectsRes, opportunitiesRes] = await Promise.all([
          axios.get('/api/clients'),
          axios.get('/api/prospects'),
          axios.get('/api/opportunities'),
        ]);

        const activeClients = clientsRes.data.filter((c: any) => c.status === 'ACTIVE').length;
        const newProspects = prospectsRes.data.filter((p: any) => p.status === 'NEW').length;
        const totalOpportunityAmount = opportunitiesRes.data.reduce((sum: number, opp: any) => sum + (opp.amount || 0), 0);

        setData({ activeClients, newProspects, totalOpportunityAmount });
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading };
};
