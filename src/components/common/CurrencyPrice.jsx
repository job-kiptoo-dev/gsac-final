import React from 'react'
import { useVisitor } from '../../context/VisitorContext'

export default function CurrencyPrice({ amount, className = '', per = '', originalClassName = '' }) {
  const { currency, formatPrice, isKenya } = useVisitor()

  return (
    <span className={className}>
      {formatPrice(amount)}
      {per ? <span className="ml-1 text-xs font-medium opacity-70">{per}</span> : null}
      {isKenya ? (
        <span className={originalClassName || 'ml-2 text-xs font-medium text-gray-400'}>
          (${Number(amount || 0).toLocaleString()} USD)
        </span>
      ) : null}
      <span className="sr-only">Displayed in {currency}</span>
    </span>
  )
}
