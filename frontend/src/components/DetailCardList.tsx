interface DetailCardItem {
  label: string
  value: string
  href?: string
}

interface DetailCardListProps {
  items: DetailCardItem[]
  className?: string
  itemClassName?: string
  labelClassName?: string
  valueClassName?: string
}

const DetailCardList = ({
  items,
  className = 'grid gap-4',
  itemClassName = 'art-card px-5 py-5',
  labelClassName = 'meta-label',
  valueClassName = 'meta-copy mt-3'
}: DetailCardListProps) => {
  return (
    <div className={className}>
      {items.map((item) => {
        const content = (
          <>
            <p className={labelClassName}>{item.label}</p>
            <p className={valueClassName}>{item.value}</p>
          </>
        )

        if (item.href) {
          return (
            <a
              key={`${item.label}-${item.value}-${item.href}`}
              href={item.href}
              className={`${itemClassName} block transition-colors hover:border-[#c89b45]/30`}
            >
              {content}
            </a>
          )
        }

        return (
          <div key={`${item.label}-${item.value}`} className={itemClassName}>
            {content}
          </div>
        )
      })}
    </div>
  )
}

export type { DetailCardItem }
export default DetailCardList
