"use client"

import { useUserPlanLimits } from '@/hooks/queries/use-user-plan-limits'

export function usePlanRestrictions() {
  const { data: limits, isLoading, error } = useUserPlanLimits()

  const canCreateStore = (currentStoreCount: number): boolean => {
    if (!limits) return false
    return currentStoreCount < limits.maxStores
  }

  const canUploadPhoto = (currentPhotoCount: number): boolean => {
    if (!limits) return false
    return currentPhotoCount < limits.maxPhotosPerStore
  }

  const canUseAiRewrite = (): boolean => {
    if (!limits?.hasActiveSubscription) return false
    if (limits.aiRewritesPerMonth === null) return true
    return limits.aiRewritesUsed < limits.aiRewritesPerMonth
  }

  const getRemainingAiRewrites = (): number | null => {
    if (!limits?.hasActiveSubscription) return 0
    if (limits.aiRewritesPerMonth === null) return null
    return Math.max(0, limits.aiRewritesPerMonth - limits.aiRewritesUsed)
  }

  const canUseCustomDomain = (): boolean => {
    return limits?.canUseCustomDomain || false
  }

  const canUseGmbSync = (): boolean => {
    return limits?.canUseGmbSync || false
  }

  const canUseGmbAutoUpdate = (): boolean => {
    return limits?.canUseGmbAutoUpdate || false
  }

  const canUseUnifiedDashboard = (): boolean => {
    return limits?.canUseUnifiedDashboard || false
  }

  const hasActiveSubscription = (): boolean => {
    return limits?.hasActiveSubscription || false
  }

  const canActivateStore = (): boolean => {
    return limits?.hasActiveSubscription || false
  }

  const getPlanName = (): string => {
    return limits?.planName || 'Gratuito'
  }

  const getPlanType = () => {
    return limits?.planType || null
  }

  const isFreeTier = (): boolean => {
    return !limits?.hasActiveSubscription
  }

  return {
    limits,
    isLoading,
    error,
    canCreateStore,
    canUploadPhoto,
    canUseAiRewrite,
    getRemainingAiRewrites,
    canUseCustomDomain,
    canUseGmbSync,
    canUseGmbAutoUpdate,
    canUseUnifiedDashboard,
    hasActiveSubscription,
    canActivateStore,
    getPlanName,
    getPlanType,
    isFreeTier,
  }
}
