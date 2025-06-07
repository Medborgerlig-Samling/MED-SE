// utils/civi-api.ts
// This file contains utility functions to interact with the CiviCRM API
export async function callCiviApi(entity: string, action: string, params: Record<string, any>) {
  const config = useRuntimeConfig()
  const url = `${config.public.civicrmBaseUrl}${entity}/${action}`

  const body = new URLSearchParams({
    params: JSON.stringify(params)
  }).toString()

  return await $fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Civi-Auth': `Bearer ${config.civicrmApiKey}`,
      'User-Agent': 'NuxtWebhook/1.0'
    },
    body
  })
}