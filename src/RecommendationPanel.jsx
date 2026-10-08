import { useState } from 'react'

function RecommendationPanel({ token, subject }) {
  const [recommendation, setRecommendation] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const generateRecommendation = async () => {
    if (!subject) {
      setMessage('No subject available for recommendations.')
      return
    }

    setLoading(true)
    setMessage('')
    setRecommendation('')

    try {
      const response = await fetch(
        `/api/recommendations/${encodeURIComponent(subject)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const text = await response.text()

      let data = {}

      if (text) {
        try {
          data = JSON.parse(text)
        } catch {
          data = {}
        }
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
          text ||
          'Unable to generate recommendation'
        )
      }

      setRecommendation(
        data.recommendation ||
        data.message ||
        text
      )
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rec-panel">

      <div className="rec-panel-header">

        <div className="rec-panel-icon">
          💡
        </div>

        <div className="rec-panel-info">

          <strong>
            AI Personalized Learning
          </strong>

          <p>
            Get an AI-generated revision plan based
            on your weak concepts.
          </p>

        </div>

      </div>

      <button
        className="secondary-button rec-panel-button"
        onClick={generateRecommendation}
        disabled={loading}
      >
        {loading
          ? 'Generating...'
          : 'Get AI Recommendation'}
      </button>

      {message && (
        <div className="message">
          {message}
        </div>
      )}

      {recommendation && (
        <div className="rec-panel-result">

          <h4>
            Personalized Recommendation
          </h4>

          <pre>
            {recommendation}
          </pre>

        </div>
      )}

    </div>
  )
}

export default RecommendationPanel