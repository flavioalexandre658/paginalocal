import { useQuery } from '@tanstack/react-query'
import { getUserSubscription } from '@/actions/subscriptions/get-user-subscription.action'

export const getUserSubscriptionQueryKey = () => ['user-subscription']

export function useUserSubscription() {
  return useQuery({
    queryKey: getUserSubscriptionQueryKey(),
    queryFn: async () => {
      const result = await getUserSubscription()
      return result?.data || null
    },
  })
}
