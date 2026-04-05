import { useEffect, useState } from 'react'
import axios from 'axios'

let siteResourcesCache: unknown = null
let siteResourcesPromise: Promise<unknown> | null = null

const loadSiteResources = async () => {
  if (siteResourcesCache !== null) {
    return siteResourcesCache
  }

  if (!siteResourcesPromise) {
    siteResourcesPromise = axios
      .get('/api/site-resources')
      .then((response) => {
        siteResourcesCache = response.data
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

    if (siteResourcesCache !== null) {
      return () => {
        cancelled = true
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
    }
  }, [])

  return data
}

export default useSiteResources
