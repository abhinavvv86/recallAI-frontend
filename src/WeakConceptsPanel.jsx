const API_URL = import.meta.env.VITE_API_URL || ''

import { useState } from 'react'

function WeakConceptsPanel({ token, subject }) {
  const [weakConcepts, setWeakConcepts] = useState([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [message, setMessage] = useState('')

  const loadWeakConcepts = async () => {
    if (!subject) {
      setMessage('No subject available.')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch(
        `${API_URL}/api/mastery/weak/${encodeURIComponent(subject)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const text = await response.text()

      let data = []

      if (text) {
        try {
          data = JSON.parse(text)
        } catch {
          data = []
        }
      }

      if (!response.ok) {
        throw new Error(
          typeof data === 'object' && data.message
            ? data.message
            : text || 'Unable to load weak concepts'
        )
      }

      setWeakConcepts(
        Array.isArray(data)
          ? data
          : []
      )

      setLoaded(true)
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="weak-panel">

      <div className="weak-panel-header">

        <div>

          <p className="eyebrow">
            REVISION CENTER
          </p>

          <h3>
            Weak Concepts
          </h3>

          <p>
            Concepts that need more attention based on
            your current mastery level.
          </p>

        </div>

        <div className="weak-panel-icon">
          🎯
        </div>

      </div>

      <button
        className="secondary-button weak-panel-button"
        onClick={loadWeakConcepts}
        disabled={loading}
      >
        {loading
          ? 'Loading...'
          : loaded
            ? 'Refresh Weak Concepts'
            : 'Find Weak Concepts'}
      </button>

      {message && (
        <div className="message">
          {message}
        </div>
      )}

      {loaded && weakConcepts.length === 0 && (
        <div className="weak-empty">

          <strong>
            Great job!
          </strong>

          <p>
            You currently have no weak concepts for this subject.
          </p>

        </div>
      )}

      {weakConcepts.length > 0 && (
        <div className="weak-list">

          {weakConcepts.map((concept) => (

            <div
              className="weak-item"
              key={concept.id}
            >

              <div className="weak-item-info">

                <div>

                  <strong>
                    {concept.name}
                  </strong>

                  <span>
                    {concept.description}
                  </span>

                </div>

                <b>
                  {concept.masteryLevel.toFixed(1)}%
                </b>

              </div>

              <div className="weak-progress-track">

                <div
                  className="weak-progress-bar"
                  style={{
                    width: `${Math.min(
                      concept.masteryLevel,
                      100
                    )}%`
                  }}
                ></div>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  )
}

export default WeakConceptsPanel