import { useQuery } from '@tanstack/vue-query';
import axios from 'axios';

export const useTodoQuery = () =>
  useQuery({
    staleTime: 3 * 1000,
    queryKey: ['todos'],
    queryFn: async () => {
      const { data } = await axios.get('/api/todos', {
        params: {
          pageNum: 1,
          pageSize: 3,
        },
      });
      if (data.code === 0) {
        return data.list;
      } else {
        throw new Error('Error fetching todos');
      }
    },
  });
