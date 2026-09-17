import React, { useEffect, useRef, useState } from 'react'

// The invoice sheet is a fixed 794px wide (A4-at-96dpi) so html2canvas
// produces a consistent raster regardless of viewport. A static CSS
// breakpoint scale (the old `scale-[0.86] sm:scale-100` approach) either
// overflows badly on real phone widths or looks tiny on tablets, and can't
// account for the sheet's height changing as items are added. This measures
// both the available width and the content's actual (unscaled) height, then
// computes an exact scale so the preview always fits its container without
// horizontal overflow, on any screen size.
export default function ResponsiveStage({ contentWidth, children }) {
  const outerRef = useRef(null)
  const innerRef = useRef(null)
  const [scale, setScale] = useState(1)
  const [naturalHeight, setNaturalHeight] = useState(0)

  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return undefined
    const outerObserver = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect?.width
      if (width) setScale(Math.min(1, width / contentWidth))
    })
    const innerObserver = new ResizeObserver((entries) => {
      const height = entries[0]?.contentRect?.height
      if (height) setNaturalHeight(height)
    })
    if (outerRef.current) outerObserver.observe(outerRef.current)
    if (innerRef.current) innerObserver.observe(innerRef.current)
    return () => {
      outerObserver.disconnect()
      innerObserver.disconnect()
    }
  }, [contentWidth])

  return (
    <div
      ref={outerRef}
      className="relative w-full overflow-hidden"
      style={{ height: naturalHeight ? naturalHeight * scale : contentWidth * 1.414 * scale }}
    >
      <div
        ref={innerRef}
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: contentWidth, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  )
}
