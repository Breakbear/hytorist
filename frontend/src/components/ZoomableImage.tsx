import { type ImgHTMLAttributes, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { resolveOfficialAssetUrl } from '../content/officialAssetMap'

interface ZoomableImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string
  showHint?: boolean
  hintVisibility?: 'hover' | 'always'
  previewLabel?: string
  closeLabel?: string
  fitToWindowLabel?: string
  originalSizeLabel?: string
  openOriginalLabel?: string
  imageHintLabel?: string
  caption?: string
}

const ZoomableImage = ({
  wrapperClassName = 'relative h-full w-full',
  className = '',
  showHint = true,
  hintVisibility = 'hover',
  previewLabel = 'View Full Image',
  closeLabel = 'Close Image',
  fitToWindowLabel,
  originalSizeLabel,
  openOriginalLabel,
  imageHintLabel,
  caption,
  alt = '',
  src,
  ...imgProps
}: ZoomableImageProps) => {
  const [open, setOpen] = useState(false)
  const [actualSize, setActualSize] = useState(false)
  const resolvedSrc = typeof src === 'string' ? resolveOfficialAssetUrl(src) : src
  const canPreview = typeof resolvedSrc === 'string' && resolvedSrc.trim().length > 0
  const imageCaption = caption || alt || previewLabel
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const imageScrollRef = useRef<HTMLDivElement | null>(null)
  const lastActiveElementRef = useRef<HTMLElement | null>(null)
  const hintVisibilityClass =
    hintVisibility === 'always'
      ? 'sm:translate-y-0 sm:opacity-100'
      : 'sm:translate-y-1 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100'
  const isChineseCopy = /[\u4e00-\u9fff]/.test(`${previewLabel}${closeLabel}${imageCaption}`)
  const fitLabel = fitToWindowLabel || (isChineseCopy ? '适应窗口' : 'Fit to Window')
  const originalLabel = originalSizeLabel || (isChineseCopy ? '原始尺寸' : 'Original Size')
  const openSourceLabel = openOriginalLabel || (isChineseCopy ? '打开原图' : 'Open Original')
  const hintLabel =
    imageHintLabel ||
    (isChineseCopy ? '双击图片可切换“适应窗口 / 原始尺寸”。' : 'Double-click image to toggle fit and original size.')

  useEffect(() => {
    if (!open) {
      setActualSize(false)
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      return
    }
    imageScrollRef.current?.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [open, actualSize])

  useEffect(() => {
    if (!open) {
      return
    }

    lastActiveElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    const getFocusableElements = () => {
      if (!dialogRef.current) {
        return []
      }
      const selector =
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      return Array.from(dialogRef.current.querySelectorAll<HTMLElement>(selector)).filter((element) => {
        if (element.hasAttribute('disabled')) {
          return false
        }
        if (element.getAttribute('aria-hidden') === 'true') {
          return false
        }
        return true
      })
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        return
      }
      if (event.key !== 'Tab') {
        return
      }

      const focusable = getFocusableElements()
      if (focusable.length === 0) {
        event.preventDefault()
        closeButtonRef.current?.focus()
        return
      }

      const firstElement = focusable[0]
      const lastElement = focusable[focusable.length - 1]
      const activeElement = document.activeElement as HTMLElement | null
      const activeInsideDialog =
        activeElement && dialogRef.current?.contains(activeElement)

      if (event.shiftKey) {
        if (!activeInsideDialog || activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
        return
      }

      if (!activeInsideDialog || activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      lastActiveElementRef.current?.focus()
    }
  }, [open])

  return (
    <>
      <div className={`group relative ${wrapperClassName}`}>
        <img
          {...imgProps}
          src={resolvedSrc}
          alt={alt}
          className={`${className} ${canPreview ? 'cursor-zoom-in' : ''}`.trim()}
          onClick={() => {
            if (canPreview) {
              setOpen(true)
            }
          }}
        />

        {showHint && canPreview && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={`absolute bottom-3 right-3 z-[1] inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.7)] bg-[rgba(31,37,45,0.68)] px-3.5 py-2 text-[12px] font-semibold text-white shadow-[0_10px_24px_rgba(18,24,31,0.22)] backdrop-blur-md transition-all duration-300 hover:bg-[rgba(31,37,45,0.82)] sm:bottom-4 sm:right-4 ${hintVisibilityClass}`}
            aria-label={previewLabel}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M7 3.5H3.5V7M13 3.5H16.5V7M16.5 13V16.5H13M7 16.5H3.5V13M7 10H13"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{previewLabel}</span>
          </button>
        )}
      </div>

      {open &&
        canPreview &&
        createPortal(
          <div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-[rgba(17,22,29,0.82)] p-4 backdrop-blur-md sm:p-6"
            onClick={() => setOpen(false)}
          >
            <div
              ref={dialogRef}
              className="w-full max-w-[96rem] overflow-hidden rounded-[24px] bg-[rgba(251,248,242,0.98)] shadow-[0_30px_80px_rgba(10,14,18,0.28)]"
              role="dialog"
              aria-modal="true"
              aria-label={imageCaption}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex flex-col gap-3 border-b border-[#d7cfbf] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
                <p className="min-w-0 text-[0.92rem] font-semibold text-[#26313d] sm:truncate sm:text-[1rem]">
                  {imageCaption}
                </p>
                <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setActualSize((current) => !current)}
                    className="inline-flex min-h-[38px] flex-1 items-center justify-center rounded-full border border-[#d7cfbf] bg-white/80 px-3 py-1.5 text-[12px] font-semibold text-[#26313d] transition-colors hover:bg-white sm:min-h-[36px] sm:flex-none"
                  >
                    {actualSize ? fitLabel : originalLabel}
                  </button>
                  {canPreview && (
                    <a
                      href={resolvedSrc}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-[38px] flex-1 items-center justify-center rounded-full border border-[#d7cfbf] bg-white/80 px-3 py-1.5 text-[12px] font-semibold text-[#26313d] transition-colors hover:bg-white sm:min-h-[36px] sm:flex-none"
                    >
                      {openSourceLabel}
                    </a>
                  )}
                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={() => setOpen(false)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d7cfbf] bg-white/80 text-[#26313d] transition-colors hover:bg-white"
                    aria-label={closeLabel}
                  >
                    <span className="text-xl leading-none">&times;</span>
                  </button>
                </div>
              </div>

              <div className="bg-[linear-gradient(180deg,#f7f2e9,#efe7d9)] p-3 sm:p-4">
                <div ref={imageScrollRef} className="max-h-[78vh] overflow-auto rounded-[18px] bg-[#f4eee2]">
                  <img
                    src={resolvedSrc}
                    alt={alt}
                    onDoubleClick={() => setActualSize((current) => !current)}
                    className={
                      actualSize
                        ? 'block h-auto w-auto max-w-none rounded-[18px] bg-[#f4eee2] align-top'
                        : 'block h-auto w-full rounded-[18px] bg-[#f4eee2] align-top'
                    }
                  />
                </div>
                <p className="mt-3 text-[12px] leading-6 text-[#5f6a76]">{hintLabel}</p>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}

export default ZoomableImage
