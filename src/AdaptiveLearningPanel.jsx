const API_URL = import.meta.env.VITE_API_URL || ''

import { useState } from 'react'

function AdaptiveLearningPanel({ token, subject }) {
  const [studyAction, setStudyAction] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const generateStudyAction = async () => {
    if (!subject) {
      setMessage('No subject available for adaptive learning.')
      return
    }

    setLoading(true)
    setMessage('')
    setStudyAction('')

    try {
      const response = await fetch(
        `${API_URL}/api/adaptive-learning/${encodeURIComponent(subject)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const text = await response.text()

      if (!response.ok) {
        throw new Error(
          text || 'Unable to generate adaptive learning plan'
        )
      }

      setStudyAction(text)
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  const formattedStudyAction = studyAction.replace(/\*\*/g, '')

  return (
    <div className="adaptive-panel">

      <div className="adaptive-panel-header">

        <div className="adaptive-panel-icon">
          🧭
        </div>

        <div className="adaptive-panel-info">

          <p className="eyebrow">
            ADAPTIVE LEARNING
          </p>

          <h3>
            What Should I Study Next?
          </h3>

          <p>
            RecallAI analyzes your weakest concepts and
            quiz performance to choose your next best
            learning action.
          </p>

        </div>

      </div>

      <button
        className="primary-button adaptive-panel-button"
        onClick={generateStudyAction}
        disabled={loading}
      >
        {loading
          ? 'Analyzing Your Progress...'
          : 'Generate My Next Study Action'}
      </button>

      {message && (
        <div className="message">
          {message}
        </div>
      )}

      {studyAction && (
        <div className="adaptive-result">

          <div className="adaptive-result-header">

            <span>
              🤖
            </span>

            <h4>
              Your Personalized Learning Path
            </h4>

          </div>

          <pre>
            {formattedStudyAction}
          </pre>

        </div>
      )}

    </div>
  )
}

export default AdaptiveLearningPanel