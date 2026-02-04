import { useQuery } from '@tanstack/react-query'
import { getPlans } from '@/actions/subscriptions/get-plans.action'

export const getPlansQueryKey = () => ['plans']

export function usePlans() {
  return useQuery({
    queryKey: getPlansQueryKey(),
    queryFn: async () => {
      const result = await getPlans()
      return result?.data || []
    },
    staleTime: 1000 * 60 * 5,
  })
}
