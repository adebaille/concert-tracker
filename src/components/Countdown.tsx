import { useState, useEffect } from 'react'

type CountdownProps = {
  targetDate: Date
}

function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    function updateTimeLeft() {
      const diffMs = targetDate.getTime() - Date.now()
      const diffSeconds = Math.max(0, Math.floor(diffMs / 1000))

      setTimeLeft({
        days: Math.floor(diffSeconds / 86400),
        hours: Math.floor((diffSeconds % 86400) / 3600),
        minutes: Math.floor((diffSeconds % 3600) / 60),
        seconds: diffSeconds % 60,
      })
    }

    updateTimeLeft()
    const intervalId = setInterval(updateTimeLeft, 1000)

    return () => clearInterval(intervalId)
  }, [targetDate])

  return (
    <div className="countdown">
      <div className="cd-cell"><div className="cd-num">{String(timeLeft.days).padStart(2, '0')}</div><div className="cd-label">jours</div></div>
      <div className="cd-cell"><div className="cd-num">{String(timeLeft.hours).padStart(2, '0')}</div><div className="cd-label">heures</div></div>
      <div className="cd-cell"><div className="cd-num">{String(timeLeft.minutes).padStart(2, '0')}</div><div className="cd-label">min</div></div>
      <div className="cd-cell"><div className="cd-num">{String(timeLeft.seconds).padStart(2, '0')}</div><div className="cd-label">sec</div></div>
    </div>
  )
}

export default Countdown