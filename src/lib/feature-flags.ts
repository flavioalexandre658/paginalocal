export function isV2EnabledForStore(storeId: string): boolean {
  if (process.env.ENABLE_V2_RENDERER === "true") return true;
  const betaStores =
    process.env.V2_BETA_STORES?.split(",").map((s) => s.trim()) ?? [];
  return betaStores.includes(storeId);
}

export function isV2GloballyEnabled(): boolean {
  return process.env.ENABLE_V2_RENDERER === "true";
}
