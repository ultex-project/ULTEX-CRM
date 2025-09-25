import { useState, useEffect } from 'react';

type AdminMetrics = {
  activeClients: number;
  newProspects: number;
  totalOpportunityAmount: number;
  opportunitiesByStage: { stage: string; count: number }[];
};

export const useAdminMetrics = () => {
  const [metrics, setMetrics] = useState<AdminMetrics>({
    activeClients: 142,
    newProspects: 28,
    totalOpportunityAmount: 84200,
    opportunitiesByStage: [
      { stage: 'LEAD', count: 12 },
      { stage: 'NEGOTIATION', count: 8 },
      { stage: 'WON', count: 5 },
      { stage: 'LOST', count: 3 },
    ],
  });
  const [loading, setLoading] = useState(false);

  // Later: replace with API calls to your backend services
  useEffect(() => {
    setLoading(false);
  }, []);

  return { metrics, loading };
};
