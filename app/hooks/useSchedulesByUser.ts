import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getSchedulesWithUsers } from '~/libs/radio.service';

export function useSchedulesByUser(token: string, filters: { mes: number; anio: number, semana: number }) {
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ['schedules-por-usuario', page, filters],
    queryFn: async () => getSchedulesWithUsers(token, {
        page: String(page),
        mes: String(filters.mes),
        anio: String(filters.anio),
        semana: String(filters.semana),
    }),
    placeholderData: (previousData) => previousData,
  });

  return { ...query, page, setPage };
}