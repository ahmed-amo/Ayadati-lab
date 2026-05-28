import * as React from 'react'

const MOBILE_MAX_WIDTH_PX = 768

export function useIsMobile(maxWidthPx: number = MOBILE_MAX_WIDTH_PX) {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const query = `(max-width: ${maxWidthPx}px)`
    const media = window.matchMedia(query)

    const onChange = () => setIsMobile(media.matches)
    onChange()

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', onChange)
      return () => media.removeEventListener('change', onChange)
    }

    // Safari / older browsers
    media.addListener(onChange)
    return () => media.removeListener(onChange)
  }, [maxWidthPx])

  return isMobile
}

