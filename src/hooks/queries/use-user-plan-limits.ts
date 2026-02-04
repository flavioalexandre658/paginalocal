import { useQuery } from '@tanstack/react-query'
import { getUserPlanLimits } from '@/actions/subscriptions/get-user-plan-limits.action'
import type { IUserPlanLimits } from '@/interfaces/subscription.interface'

export const getUserPlanLimitsQueryKey = () => ['user-plan-limits']

const DEFAULT_LIMITS: IUserPlanLimits = {
  maxStores: 1,
  maxPhotosPerStore: 3,
  aiRewritesPerMonth: 0,
  aiRewritesUsed: 0,
  canUseCustomDomain: false,
  canUseGmbSync: false,
  canUseGmbAutoUpdate: false,
  canUseUnifiedDashboard: false,
  hasActiveSubscription: false,
  planType: null,
  planName: 'Gratuito',
}

export function useUserPlanLimits() {
  return useQuery({
    queryKey: getUserPlanLimitsQueryKey(),
    queryFn: async () => {
      const result = await getUserPlanLimits()
      return result?.data || DEFAULT_LIMITS
    },
  })
}
