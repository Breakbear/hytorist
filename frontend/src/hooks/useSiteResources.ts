import { useEffect, useState } from 'react'
import axios from 'axios'

let siteResourcesCache: unknown = null
let siteResourcesPromise: Promise<unknown> | null = null
const siteResourcesListeners = new Set<(value: unknown | null) => void>()

const publishSiteResources = (value: unknown | null) => {
  siteResourcesCache = value
  siteResourcesListeners.forEach((listener) => listener(value))
}

export const syncSiteResourcesCache = (value: unknown | null) => {
  publishSiteResources(value)
}

const loadSiteResources = async () => {
  if (siteResourcesCache !== null) {
    return siteResourcesCache
  }

  if (!siteResourcesPromise) {
    siteResourcesPromise = axios
      .get('/api/site-resources')
      .then((response) => {
        publishSiteResources(response.data)
        return response.data
      })
      .finally(() => {
        siteResourcesPromise = null
      })
  }

  return siteResourcesPromise
}

const useSiteResources = <TData = Record<string, unknown>>() => {
  const [data, setData] = useState<TData | null>(() =>
    siteResourcesCache !== null ? (siteResourcesCache as TData) : null
  )

  useEffect(() => {
    let cancelled = false
    const handleUpdate = (value: unknown | null) => {
      if (!cancelled) {
        setData(value !== null ? (value as TData) : null)
      }
    }

    siteResourcesListeners.add(handleUpdate)

    if (siteResourcesCache !== null) {
      return () => {
        cancelled = true
        siteResourcesListeners.delete(handleUpdate)
      }
    }

    const fetchData = async () => {
      try {
        const result = await loadSiteResources()
        if (!cancelled) {
          setData(result as TData)
        }
      } catch {
        if (!cancelled) {
          setData(null)
        }
      }
    }

    void fetchData()

    return () => {
      cancelled = true
      siteResourcesListeners.delete(handleUpdate)
    }
  }, [])

  return data
}

export default useSiteResources
