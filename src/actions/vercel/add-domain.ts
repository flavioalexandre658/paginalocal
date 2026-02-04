"use server"

import { z } from "zod"

const addDomainSchema = z.object({
  domain: z.string().min(1),
})

interface VercelDomainResponse {
  success: boolean
  data?: {
    name: string
    apexName: string
    projectId: string
    verified: boolean
    verification?: {
      type: string
      domain: string
      value: string
      reason: string
    }[]
  }
  error?: string
}

export async function addDomainToVercel(domain: string): Promise<VercelDomainResponse> {
  try {
    const parsed = addDomainSchema.safeParse({ domain })
    
    if (!parsed.success) {
      return {
        success: false,
        error: "Domínio inválido",
      }
    }

    const vercelToken = process.env.VERCEL_TOKEN
    const vercelProjectId = process.env.VERCEL_PROJECT_ID
    const vercelTeamId = process.env.VERCEL_TEAM_ID

    if (!vercelToken || !vercelProjectId) {
      console.warn("Vercel API not configured, skipping domain addition")
      return {
        success: true,
        data: {
          name: parsed.data.domain,
          apexName: parsed.data.domain,
          projectId: vercelProjectId || "",
          verified: false,
        },
      }
    }

    const teamQuery = vercelTeamId ? `&teamId=${vercelTeamId}` : ""
    
    const response = await fetch(
      `https://api.vercel.com/v10/projects/${vercelProjectId}/domains?${teamQuery}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${vercelToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: parsed.data.domain,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      if (data.error?.code === "domain_already_in_use") {
        return {
          success: true,
          data: {
            name: parsed.data.domain,
            apexName: parsed.data.domain,
            projectId: vercelProjectId,
            verified: false,
          },
        }
      }
      
      return {
        success: false,
        error: data.error?.message || "Erro ao adicionar domínio na Vercel",
      }
    }

    return {
      success: true,
      data: {
        name: data.name,
        apexName: data.apexName,
        projectId: data.projectId,
        verified: data.verified,
        verification: data.verification,
      },
    }
  } catch (error) {
    console.error("Error adding domain to Vercel:", error)
    return {
      success: false,
      error: "Erro ao conectar com a Vercel",
    }
  }
}

export async function removeDomainFromVercel(domain: string): Promise<{ success: boolean; error?: string }> {
  try {
    const vercelToken = process.env.VERCEL_TOKEN
    const vercelProjectId = process.env.VERCEL_PROJECT_ID
    const vercelTeamId = process.env.VERCEL_TEAM_ID

    if (!vercelToken || !vercelProjectId) {
      return { success: true }
    }

    const teamQuery = vercelTeamId ? `?teamId=${vercelTeamId}` : ""
    
    const response = await fetch(
      `https://api.vercel.com/v9/projects/${vercelProjectId}/domains/${encodeURIComponent(domain)}${teamQuery}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${vercelToken}`,
        },
      }
    )

    if (!response.ok && response.status !== 404) {
      const data = await response.json()
      return {
        success: false,
        error: data.error?.message || "Erro ao remover domínio da Vercel",
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error removing domain from Vercel:", error)
    return {
      success: false,
      error: "Erro ao conectar com a Vercel",
    }
  }
}

interface DnsIntendedRecord {
  type: "A" | "AAAA" | "CNAME" | "TXT"
  host: string
  value: string
}

interface DomainConfigResponse {
  success: boolean
  data?: {
    name: string
    verified: boolean
    misconfigured: boolean
    configuredBy?: "CNAME" | "A" | null
    cnames?: string[]
    aValues?: string[]
    intendedNameservers?: string[]
    intendedRecords?: DnsIntendedRecord[]
    verification?: {
      type: string
      domain: string
      value: string
      reason: string
    }[]
  }
  error?: string
}

export async function getDomainConfigFromVercel(domain: string): Promise<DomainConfigResponse> {
  try {
    const vercelToken = process.env.VERCEL_TOKEN
    const vercelProjectId = process.env.VERCEL_PROJECT_ID
    const vercelTeamId = process.env.VERCEL_TEAM_ID

    if (!vercelToken || !vercelProjectId) {
      console.warn("Vercel API not configured")
      return {
        success: true,
        data: {
          name: domain,
          verified: false,
          misconfigured: true,
        },
      }
    }

    const teamQuery = vercelTeamId ? `?teamId=${vercelTeamId}` : ""

    const [domainResponse, configResponse] = await Promise.all([
      fetch(
        `https://api.vercel.com/v9/projects/${vercelProjectId}/domains/${encodeURIComponent(domain)}${teamQuery}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${vercelToken}`,
          },
          cache: "no-store",
        }
      ),
      fetch(
        `https://api.vercel.com/v6/domains/${encodeURIComponent(domain)}/config${teamQuery}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${vercelToken}`,
          },
          cache: "no-store",
        }
      ),
    ])

    if (!domainResponse.ok) {
      const errorData = await domainResponse.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.error?.message || "Domínio não encontrado",
      }
    }

    const domainData = await domainResponse.json()
    const configData = configResponse.ok ? await configResponse.json() : null

    console.log("[Vercel Domain Data]", JSON.stringify(domainData, null, 2))
    console.log("[Vercel Config Data]", JSON.stringify(configData, null, 2))

    const verified = domainData.verified === true
    const misconfigured = configData?.misconfigured === true
    const configuredBy = configData?.configuredBy || null

    const isReallyWorking = verified && !misconfigured && configuredBy !== null

    let intendedRecords: DnsIntendedRecord[] = []
    
    if (configData?.acceptedChallenges) {
      for (const challenge of configData.acceptedChallenges) {
        if (challenge === "dns-01") {
          intendedRecords.push({
            type: "A",
            host: "@",
            value: "76.76.21.21",
          })
        }
      }
    }
    
    if (Array.isArray(configData?.cnames) && configData.cnames.length > 0) {
      intendedRecords = []
      intendedRecords.push({
        type: "CNAME",
        host: "@",
        value: configData.cnames[0],
      })
    }
    
    if (Array.isArray(configData?.aValues) && configData.aValues.length > 0) {
      intendedRecords = []
      intendedRecords.push({
        type: "A",
        host: "@",
        value: configData.aValues[0],
      })
    }
    
    if (intendedRecords.length === 0) {
      if (domainData.apexName && domainData.name === domainData.apexName) {
        intendedRecords.push({
          type: "A",
          host: "@",
          value: "76.76.21.21",
        })
      }
      
      if (domainData.name && domainData.name !== domainData.apexName) {
        const subdomain = domainData.name.replace(`.${domainData.apexName}`, "")
        intendedRecords.push({
          type: "CNAME",
          host: subdomain,
          value: "cname.vercel-dns.com",
        })
      }
    }

    return {
      success: true,
      data: {
        name: domainData.name,
        verified: isReallyWorking,
        misconfigured: misconfigured,
        configuredBy: configuredBy,
        cnames: configData?.cnames || [],
        aValues: configData?.aValues || [],
        intendedNameservers: configData?.intendedNameservers || [],
        intendedRecords: intendedRecords,
        verification: domainData.verification || [],
      },
    }
  } catch (error) {
    console.error("Error getting domain config from Vercel:", error)
    return {
      success: false,
      error: "Erro ao consultar domínio",
    }
  }
}

export async function verifyDomainOnVercel(domain: string): Promise<{
  success: boolean
  verified: boolean
  misconfigured: boolean
  error?: string
}> {
  const result = await getDomainConfigFromVercel(domain)
  
  if (!result.success) {
    return {
      success: false,
      verified: false,
      misconfigured: false,
      error: result.error,
    }
  }

  return {
    success: true,
    verified: result.data?.verified ?? false,
    misconfigured: result.data?.misconfigured ?? false,
  }
}

