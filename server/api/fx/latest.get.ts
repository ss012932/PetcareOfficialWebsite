export default defineEventHandler(async () => {
  try {
    const data = await $fetch<{
      result?: string
      time_last_update_unix?: number
      rates?: Record<string, number>
    }>("https://open.er-api.com/v6/latest/TWD")

    if (!data?.rates || data.result !== "success") {
      return {
        success: false,
        updatedAt: null,
        rates: {},
      }
    }

    return {
      success: true,
      updatedAt: data.time_last_update_unix ?? null,
      rates: data.rates,
    }
  } catch {
    return {
      success: false,
      updatedAt: null,
      rates: {},
    }
  }
})
