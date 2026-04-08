const express = require('express')
const cors = require('cors')
const db = require('./database')
const officialSiteData = require('./officialSiteData')

const app = express()
const PORT = process.env.PORT || 5000
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || ''

const allowedStatuses = new Set(['pending', 'reviewed', 'contacted', 'completed', 'rejected'])
const allowedLocales = new Set(['zh', 'en'])
const allowedInquiryPrivacy = new Set(['public', 'confidential'])
const keyPattern = /^[a-z0-9_-]+$/i
const normalizeOrigin = (value) => value.replace(/\/+$/, '')
const defaultOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
]
const allowedOrigins = (process.env.CORS_ORIGINS || defaultOrigins.join(','))
  .split(',')
  .map((origin) => normalizeOrigin(origin.trim()))
  .filter(Boolean)

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(normalizeOrigin(origin))) {
        callback(null, true)
        return
      }
      callback(new Error('CORS_BLOCKED'))
    }
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((err, req, res, next) => {
  if (err && err.message === 'CORS_BLOCKED') {
    res.status(403).json({ error: 'Origin is not allowed by CORS policy' })
    return
  }
  next(err)
})

const requireAdmin = (req, res, next) => {
  if (!ADMIN_TOKEN) {
    res.status(503).json({ error: 'Admin API is not configured. Set ADMIN_TOKEN on server.' })
    return
  }

  const authHeader = req.headers.authorization || ''
  if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  next()
}

const parseId = (value) => {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

const isValidLocale = (value) => allowedLocales.has(value)
const isValidKey = (value) => typeof value === 'string' && keyPattern.test(value)

const isRecord = (value) => !!value && typeof value === 'object' && !Array.isArray(value)
const isString = (value) => typeof value === 'string'
const isStringArray = (value) => Array.isArray(value) && value.every(isString)

const isProductCardArray = (value) =>
  Array.isArray(value) &&
  value.every(
    (item) =>
      isRecord(item) &&
      Number.isFinite(item.id) &&
      isString(item.name) &&
      isString(item.category) &&
      isString(item.image)
  )

const isHeroMetricArray = (value) =>
  Array.isArray(value) &&
  value.every((item) => isRecord(item) && isString(item.value) && isString(item.label))

const isNarrativeNoteArray = (value) =>
  Array.isArray(value) &&
  value.every(
    (item) =>
      isRecord(item) &&
      isString(item.code) &&
      isString(item.title) &&
      isString(item.description)
  )

const isNarrativeStepArray = (value) =>
  Array.isArray(value) &&
  value.every(
    (item) =>
      isRecord(item) &&
      isString(item.step) &&
      isString(item.title) &&
      isString(item.description)
  )

const parsePortalContent = (content) => {
  if (!content || typeof content !== 'object' || Array.isArray(content)) {
    return null
  }

  const title = typeof content.title === 'string' ? content.title.trim() : ''
  const kind = typeof content.kind === 'string' ? content.kind.trim() : ''
  if (!title || !kind) {
    return null
  }

  return {
    ...content,
    title,
    kind
  }
}

const parseHomeContent = (content) => {
  if (!isRecord(content)) {
    return null
  }

  const next = { ...content }
  const stringFields = [
    'heroTitle',
    'heroSubtitle',
    'featuredTitle',
    'viewProductsButton',
    'requestQuoteButton',
    'viewAllProductsButton',
    'brandEssenceTitle',
    'brandEssenceHeadline',
    'brandFrameEyebrow',
    'brandFrameTitle',
    'brandFrameText',
    'curatedSelectionTitle',
    'nextMoveEyebrow',
    'nextMoveTitle',
    'nextMoveText',
    'contactButtonLabel'
  ]

  for (const field of stringFields) {
    if (field in next && !isString(next[field])) {
      return null
    }
  }

  if ('featuredProducts' in next && !isProductCardArray(next.featuredProducts)) {
    return null
  }
  if ('heroMetrics' in next && !isHeroMetricArray(next.heroMetrics)) {
    return null
  }
  if ('designNotes' in next && !isNarrativeNoteArray(next.designNotes)) {
    return null
  }
  if ('processSteps' in next && !isNarrativeStepArray(next.processSteps)) {
    return null
  }
  if ('curatedProductNotes' in next && !isStringArray(next.curatedProductNotes)) {
    return null
  }
  if ('cad' in next && next.cad !== undefined && !isRecord(next.cad)) {
    return null
  }

  return next
}

const parseContent = (sectionKey, content) => {
  if (sectionKey === 'home') {
    return parseHomeContent(content)
  }

  return parsePortalContent(content)
}

const parseCmsRow = (row) => {
  try {
    const parsed = JSON.parse(row.content_json)
    return {
      sectionKey: row.section_key,
      pageId: row.page_id,
      content: parsed,
      updatedAt: row.updated_at
    }
  } catch (error) {
    return null
  }
}

const parseSiteResourcesRow = (row) => {
  try {
    const parsed = JSON.parse(row.content_json)
    if (!isRecord(parsed)) {
      return null
    }

    return {
      content: parsed,
      updatedAt: row.updated_at
    }
  } catch (error) {
    return null
  }
}

const mergeSiteResourceValue = (base, override) => {
  if (override === undefined || override === null) {
    return base
  }

  if (Array.isArray(base)) {
    return Array.isArray(override) ? override : base
  }

  if (isRecord(base) && isRecord(override)) {
    const result = { ...base }
    Object.keys(override).forEach((key) => {
      result[key] = key in base ? mergeSiteResourceValue(base[key], override[key]) : override[key]
    })
    return result
  }

  return override
}

const parseSiteResourcesContent = (content) => {
  return isRecord(content) ? content : null
}

const loadMergedSiteResources = (callback) => {
  db.get(
    'SELECT content_json, updated_at FROM site_resource_overrides WHERE scope = ?',
    ['default'],
    (err, row) => {
      if (err) {
        callback(err)
        return
      }

      if (!row) {
        callback(null, {
          content: officialSiteData,
          hasOverride: false,
          updatedAt: null
        })
        return
      }

      const parsed = parseSiteResourcesRow(row)
      if (!parsed) {
        callback(new Error('Failed to parse site resource override'))
        return
      }

      callback(null, {
        content: mergeSiteResourceValue(officialSiteData, parsed.content),
        hasOverride: true,
        updatedAt: parsed.updatedAt
      })
    }
  )
}

const dbGetAsync = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err)
        return
      }

      resolve(row)
    })
  })

const dbAllAsync = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err)
        return
      }

      resolve(rows)
    })
  })

const loadMergedSiteResourcesAsync = () =>
  new Promise((resolve, reject) => {
    loadMergedSiteResources((err, result) => {
      if (err) {
        reject(err)
        return
      }

      resolve(result)
    })
  })

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Hytorist API is running' })
})

app.get('/api/admin/overview', requireAdmin, async (req, res) => {
  try {
    const inquiryRow = (await dbGetAsync(
      `
        SELECT
          COUNT(*) AS total,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
          SUM(CASE WHEN status = 'reviewed' THEN 1 ELSE 0 END) AS reviewed,
          SUM(CASE WHEN status = 'contacted' THEN 1 ELSE 0 END) AS contacted,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed,
          SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) AS rejected,
          SUM(CASE WHEN date(created_at) = date('now', 'localtime') THEN 1 ELSE 0 END) AS todayCount,
          MAX(created_at) AS newestAt
        FROM inquiries
      `
    )) || {}

    const cmsRow = (await dbGetAsync(
      `
        SELECT
          COUNT(*) AS totalOverrides,
          SUM(CASE WHEN locale = 'zh' THEN 1 ELSE 0 END) AS zhCount,
          SUM(CASE WHEN locale = 'en' THEN 1 ELSE 0 END) AS enCount,
          COUNT(DISTINCT section_key) AS sectionCount,
          MAX(updated_at) AS lastUpdatedAt
        FROM cms_page_overrides
      `
    )) || {}

    const cmsTopSections = await dbAllAsync(
      `
        SELECT section_key AS sectionKey, COUNT(*) AS count
        FROM cms_page_overrides
        GROUP BY section_key
        ORDER BY count DESC, section_key ASC
        LIMIT 6
      `
    )

    const siteResourceResult = await loadMergedSiteResourcesAsync()
    const resourceContent = siteResourceResult.content || {}
    const productCategories = Array.isArray(resourceContent.productCategories)
      ? resourceContent.productCategories
      : []
    const caseCategories = Array.isArray(resourceContent.caseCategories) ? resourceContent.caseCategories : []
    const mailboxes =
      resourceContent.contacts && Array.isArray(resourceContent.contacts.mailboxes)
        ? resourceContent.contacts.mailboxes
        : []
    const newsArticles =
      resourceContent.newsArticles && typeof resourceContent.newsArticles === 'object'
        ? Object.keys(resourceContent.newsArticles)
        : []

    res.json({
      server: {
        adminConfigured: Boolean(ADMIN_TOKEN),
        port: PORT
      },
      inquiries: {
        total: Number(inquiryRow.total || 0),
        pending: Number(inquiryRow.pending || 0),
        reviewed: Number(inquiryRow.reviewed || 0),
        contacted: Number(inquiryRow.contacted || 0),
        completed: Number(inquiryRow.completed || 0),
        rejected: Number(inquiryRow.rejected || 0),
        todayCount: Number(inquiryRow.todayCount || 0),
        newestAt: inquiryRow.newestAt || null
      },
      cms: {
        totalOverrides: Number(cmsRow.totalOverrides || 0),
        zhCount: Number(cmsRow.zhCount || 0),
        enCount: Number(cmsRow.enCount || 0),
        sectionCount: Number(cmsRow.sectionCount || 0),
        lastUpdatedAt: cmsRow.lastUpdatedAt || null,
        topSections: Array.isArray(cmsTopSections)
          ? cmsTopSections.map((item) => ({
              sectionKey: item.sectionKey,
              count: Number(item.count || 0)
            }))
          : []
      },
      resources: {
        hasOverride: Boolean(siteResourceResult.hasOverride),
        updatedAt: siteResourceResult.updatedAt || null,
        productCategoryCount: productCategories.length,
        caseCategoryCount: caseCategories.length,
        mailboxCount: mailboxes.length,
        newsArticleCount: newsArticles.length
      }
    })
  } catch (error) {
    console.error('Error loading admin overview:', error.message)
    res.status(500).json({ error: 'Failed to load admin overview' })
  }
})

app.get('/api/site-resources', (req, res) => {
  loadMergedSiteResources((err, result) => {
    if (err) {
      console.error('Error loading site resources:', err.message)
      res.status(500).json({ error: 'Failed to load site resources' })
      return
    }

    res.json(result.content)
  })
})

app.post('/api/inquiries', (req, res) => {
  const data = req.body || {}
  const name = typeof data.name === 'string' ? data.name.trim() : ''
  const email = typeof data.email === 'string' ? data.email.trim() : ''
  const phone = typeof data.phone === 'string' ? data.phone.trim() : ''
  const message = typeof data.message === 'string' ? data.message.trim() : ''
  const privacy = typeof data.privacy === 'string' ? data.privacy.trim() : 'confidential'

  if (!name || !email || !phone || !message) {
    res.status(400).json({ error: 'Name, email, phone, and message are required' })
    return
  }

  if (!allowedInquiryPrivacy.has(privacy)) {
    res.status(400).json({ error: 'Invalid privacy value' })
    return
  }

  const sql =
    'INSERT INTO inquiries (name, email, phone, company, product, quantity, category, privacy, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  const params = [
    name,
    email,
    phone,
    typeof data.company === 'string' ? data.company.trim() : null,
    typeof data.product === 'string' ? data.product.trim() : null,
    typeof data.quantity === 'string' ? data.quantity.trim() : null,
    typeof data.category === 'string' ? data.category.trim() || null : null,
    privacy,
    message
  ]

  db.run(sql, params, function (err) {
    if (err) {
      console.error('Error inserting inquiry:', err.message)
      res.status(500).json({ error: 'Failed to submit inquiry' })
      return
    }

    res.status(201).json({ message: 'Inquiry submitted successfully', id: this.lastID })
  })
})

app.get('/api/inquiries', requireAdmin, (req, res) => {
  const sql = 'SELECT * FROM inquiries ORDER BY created_at DESC'
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching inquiries:', err.message)
      res.status(500).json({ error: 'Failed to fetch inquiries' })
      return
    }

    res.json(rows)
  })
})

app.get('/api/inquiries/:id', requireAdmin, (req, res) => {
  const id = parseId(req.params.id)
  if (!id) {
    res.status(400).json({ error: 'Invalid inquiry id' })
    return
  }

  db.get('SELECT * FROM inquiries WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching inquiry:', err.message)
      res.status(500).json({ error: 'Failed to fetch inquiry' })
      return
    }

    if (!row) {
      res.status(404).json({ error: 'Inquiry not found' })
      return
    }

    res.json(row)
  })
})

app.put('/api/inquiries/:id/status', requireAdmin, (req, res) => {
  const id = parseId(req.params.id)
  if (!id) {
    res.status(400).json({ error: 'Invalid inquiry id' })
    return
  }

  const status = typeof req.body?.status === 'string' ? req.body.status.trim() : ''
  if (!allowedStatuses.has(status)) {
    res.status(400).json({ error: 'Invalid status value' })
    return
  }

  db.run('UPDATE inquiries SET status = ? WHERE id = ?', [status, id], function (err) {
    if (err) {
      console.error('Error updating inquiry status:', err.message)
      res.status(500).json({ error: 'Failed to update status' })
      return
    }

    if (this.changes === 0) {
      res.status(404).json({ error: 'Inquiry not found' })
      return
    }

    res.json({ message: 'Status updated successfully' })
  })
})

app.get('/api/cms/pages/:locale', (req, res) => {
  const { locale } = req.params
  if (!isValidLocale(locale)) {
    res.status(400).json({ error: 'Invalid locale' })
    return
  }

  const sql =
    'SELECT section_key, page_id, content_json, updated_at FROM cms_page_overrides WHERE locale = ? ORDER BY updated_at DESC'
  db.all(sql, [locale], (err, rows) => {
    if (err) {
      console.error('Error fetching CMS pages:', err.message)
      res.status(500).json({ error: 'Failed to fetch CMS pages' })
      return
    }

    const pages = rows.map(parseCmsRow).filter(Boolean)
    res.json({ locale, pages })
  })
})

app.get('/api/cms/page/:locale/:sectionKey/:pageId', (req, res) => {
  const { locale, sectionKey, pageId } = req.params
  if (!isValidLocale(locale) || !isValidKey(sectionKey) || !isValidKey(pageId)) {
    res.status(400).json({ error: 'Invalid CMS page path' })
    return
  }

  const sql =
    'SELECT section_key, page_id, content_json, updated_at FROM cms_page_overrides WHERE locale = ? AND section_key = ? AND page_id = ?'
  db.get(sql, [locale, sectionKey, pageId], (err, row) => {
    if (err) {
      console.error('Error fetching CMS page:', err.message)
      res.status(500).json({ error: 'Failed to fetch CMS page' })
      return
    }

    if (!row) {
      res.status(404).json({ error: 'CMS page override not found' })
      return
    }

    const page = parseCmsRow(row)
    if (!page) {
      res.status(500).json({ error: 'Failed to parse CMS page content' })
      return
    }

    res.json({ locale, ...page })
  })
})

app.put('/api/cms/page/:locale/:sectionKey/:pageId', requireAdmin, (req, res) => {
  const { locale, sectionKey, pageId } = req.params
  if (!isValidLocale(locale) || !isValidKey(sectionKey) || !isValidKey(pageId)) {
    res.status(400).json({ error: 'Invalid CMS page path' })
    return
  }

  const normalizedContent = parseContent(sectionKey, req.body?.content)
  if (!normalizedContent) {
    res.status(400).json({ error: 'Invalid content payload' })
    return
  }

  const contentJson = JSON.stringify(normalizedContent)
  const sql = `
    INSERT INTO cms_page_overrides (locale, section_key, page_id, content_json, updated_at)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(locale, section_key, page_id)
    DO UPDATE SET content_json = excluded.content_json, updated_at = CURRENT_TIMESTAMP
  `

  db.run(sql, [locale, sectionKey, pageId, contentJson], (err) => {
    if (err) {
      console.error('Error saving CMS page:', err.message)
      res.status(500).json({ error: 'Failed to save CMS page' })
      return
    }

    res.json({ message: 'CMS page saved successfully' })
  })
})

app.delete('/api/cms/page/:locale/:sectionKey/:pageId', requireAdmin, (req, res) => {
  const { locale, sectionKey, pageId } = req.params
  if (!isValidLocale(locale) || !isValidKey(sectionKey) || !isValidKey(pageId)) {
    res.status(400).json({ error: 'Invalid CMS page path' })
    return
  }

  const sql = 'DELETE FROM cms_page_overrides WHERE locale = ? AND section_key = ? AND page_id = ?'
  db.run(sql, [locale, sectionKey, pageId], function (err) {
    if (err) {
      console.error('Error deleting CMS page:', err.message)
      res.status(500).json({ error: 'Failed to delete CMS page' })
      return
    }

    if (this.changes === 0) {
      res.status(404).json({ error: 'CMS page override not found' })
      return
    }

    res.json({ message: 'CMS page override deleted successfully' })
  })
})

app.get('/api/cms/site-resources', requireAdmin, (req, res) => {
  loadMergedSiteResources((err, result) => {
    if (err) {
      console.error('Error loading CMS site resources:', err.message)
      res.status(500).json({ error: 'Failed to load CMS site resources' })
      return
    }

    res.json(result)
  })
})

app.put('/api/cms/site-resources', requireAdmin, (req, res) => {
  const normalizedContent = parseSiteResourcesContent(req.body?.content)
  if (!normalizedContent) {
    res.status(400).json({ error: 'Invalid site resources payload' })
    return
  }

  const contentJson = JSON.stringify(normalizedContent)
  const sql = `
    INSERT INTO site_resource_overrides (scope, content_json, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(scope)
    DO UPDATE SET content_json = excluded.content_json, updated_at = CURRENT_TIMESTAMP
  `

  db.run(sql, ['default', contentJson], (err) => {
    if (err) {
      console.error('Error saving site resources:', err.message)
      res.status(500).json({ error: 'Failed to save site resources' })
      return
    }

    res.json({ message: 'Site resources saved successfully' })
  })
})

app.delete('/api/cms/site-resources', requireAdmin, (req, res) => {
  db.run('DELETE FROM site_resource_overrides WHERE scope = ?', ['default'], function (err) {
    if (err) {
      console.error('Error deleting site resources override:', err.message)
      res.status(500).json({ error: 'Failed to delete site resources override' })
      return
    }

    if (this.changes === 0) {
      res.status(404).json({ error: 'Site resources override not found' })
      return
    }

    res.json({ message: 'Site resources override deleted successfully' })
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Allowed CORS origins: ${allowedOrigins.join(', ')}`)
  if (!ADMIN_TOKEN) {
    console.log('Warning: ADMIN_TOKEN is not set, admin APIs will return 503')
  }
})
