import { useEffect, useState } from 'react'
import './App.css'
import StudyMaterialPanel from './StudyMaterialPanel'
import RecommendationPanel from './RecommendationPanel'
import WeakConceptsPanel from './WeakConceptsPanel'
import StudyProgressPanel from './StudyProgressPanel'
import AdaptiveLearningPanel from './AdaptiveLearningPanel'

function App() {
  const [isLogin, setIsLogin] = useState(true)

  const [isDashboard, setIsDashboard] = useState(
    Boolean(localStorage.getItem('token'))
  )

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const [dashboard, setDashboard] = useState(null)
  const [dashboardLoading, setDashboardLoading] = useState(false)

  const [activePage, setActivePage] = useState('dashboard')

  const loadDashboard = async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      setIsDashboard(false)
      return
    }

    setDashboardLoading(true)

    try {
      const response = await fetch('/api/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Unable to load dashboard')
      }

      const data = await response.json()

      setDashboard(data)
    } catch (error) {
      setMessage(error.message)
    } finally {
      setDashboardLoading(false)
    }
  }

  useEffect(() => {
    if (isDashboard) {
      loadDashboard()
    }
  }, [isDashboard])

  const handleDashboardClick = async () => {
    setActivePage('dashboard')
    await loadDashboard()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setMessage('')
    setLoading(true)

    try {
      const endpoint = isLogin
        ? '/auth/login'
        : '/auth/register'

      const body = isLogin
        ? {
            email,
            password
          }
        : {
            name,
            email,
            password
          }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

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
          data.message || text || 'Something went wrong'
        )
      }

      if (isLogin) {
        localStorage.setItem('token', data.token)

        setIsDashboard(true)
      } else {
        setMessage(
          'Registration successful! You can now login.'
        )

        setIsLogin(true)
        setName('')
        setPassword('')
      }
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setDashboard(null)
    setIsDashboard(false)
    setActivePage('dashboard')
    setMessage('')
  }

  if (isDashboard) {
    const token = localStorage.getItem('token')

    const recommendationSubject =
      dashboard?.concepts?.length > 0
        ? dashboard.concepts[0].subject
        : ''

    return (
      <div className="dashboard-page">

        <header className="dashboard-header">

          <div className="dashboard-brand">

            <div className="small-brand-icon">
              🧠
            </div>

            <div>
              <h2>RecallAI</h2>

              <span>
                Cognitive Learning Twin
              </span>
            </div>

          </div>

          <nav className="dashboard-nav">

            <button
              className={
                activePage === 'dashboard'
                  ? 'nav-button nav-active'
                  : 'nav-button'
              }
              onClick={handleDashboardClick}
            >
              Dashboard
            </button>

            <button
              className={
                activePage === 'materials'
                  ? 'nav-button nav-active'
                  : 'nav-button'
              }
              onClick={() =>
                setActivePage('materials')
              }
            >
              Study Materials
            </button>

          </nav>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </header>

        <main className="dashboard-content">

          {activePage === 'materials' ? (

            <StudyMaterialPanel
              token={token}
            />

          ) : (

            <>
              {dashboardLoading ? (

                <div className="dashboard-loading">
                  Loading your Cognitive Learning Twin...
                </div>

              ) : dashboard ? (

                <>

                  <section className="welcome-section">

                    <div>

                      <p className="eyebrow">
                        PERSONAL LEARNING DASHBOARD
                      </p>

                      <h1>
                        Welcome back, {dashboard.name}
                      </h1>

                      <p>
                        Here's how your learning journey is progressing.
                      </p>

                    </div>

                  </section>

                  <section className="stats-grid">

                    <div className="stat-card">

                      <span className="stat-icon">
                        📚
                      </span>

                      <div>

                        <span className="stat-label">
                          Study Materials
                        </span>

                        <strong>
                          {dashboard.totalMaterials}
                        </strong>

                      </div>

                    </div>

                    <div className="stat-card">

                      <span className="stat-icon">
                        🧠
                      </span>

                      <div>

                        <span className="stat-label">
                          Concepts
                        </span>

                        <strong>
                          {dashboard.totalConcepts}
                        </strong>

                      </div>

                    </div>

                    <div className="stat-card">

                      <span className="stat-icon">
                        🎯
                      </span>

                      <div>

                        <span className="stat-label">
                          Average Mastery
                        </span>

                        <strong>
                          {dashboard.averageMastery.toFixed(1)}%
                        </strong>

                      </div>

                    </div>

                    <div className="stat-card">

                      <span className="stat-icon">
                        📝
                      </span>

                      <div>

                        <span className="stat-label">
                          Average Quiz Score
                        </span>

                        <strong>
                          {dashboard.averageQuizScore.toFixed(1)}%
                        </strong>

                      </div>

                    </div>

                  </section>

                  <section className="dashboard-grid">

                    <div className="dashboard-card">

                      <div className="card-header">

                        <div>
                          <h3>
                            Concept Mastery
                          </h3>

                          <p>
                            Your current understanding of each concept
                          </p>
                        </div>

                      </div>

                      <div className="concept-list">

                        {dashboard.concepts.length === 0 ? (

                          <p className="empty-text">
                            No concepts available yet.
                          </p>

                        ) : (

                          dashboard.concepts.map((concept) => (

                            <div
                              className="concept-row"
                              key={concept.id}
                            >

                              <div className="concept-info">

                                <div>

                                  <strong>
                                    {concept.name}
                                  </strong>

                                  <span>
                                    {concept.subject}
                                  </span>

                                </div>

                                <b>
                                  {concept.masteryLevel.toFixed(1)}%
                                </b>

                              </div>

                              <div className="progress-track">

                                <div
                                  className="progress-bar"
                                  style={{
                                    width: `${Math.min(
                                      concept.masteryLevel,
                                      100
                                    )}%`
                                  }}
                                ></div>

                              </div>

                            </div>

                          ))

                        )}

                      </div>

                    </div>

                    <div className="dashboard-card">

                      <div className="card-header">

                        <div>
                          <h3>
                            Learning Overview
                          </h3>

                          <p>
                            Your current learning status
                          </p>
                        </div>

                      </div>

                      <div className="overview-item">

                        <span>
                          Weak Concepts
                        </span>

                        <strong>
                          {dashboard.weakConcepts}
                        </strong>

                      </div>

                      <div className="overview-item">

                        <span>
                          Quizzes Completed
                        </span>

                        <strong>
                          {dashboard.totalQuizzes}
                        </strong>

                      </div>

                      <div className="overview-item">

                        <span>
                          Average Mastery
                        </span>

                        <strong>
                          {dashboard.averageMastery.toFixed(1)}%
                        </strong>

                      </div>

                      <div className="overview-item">

                        <span>
                          Average Quiz Score
                        </span>

                        <strong>
                          {dashboard.averageQuizScore.toFixed(1)}%
                        </strong>

                      </div>

                      <RecommendationPanel
                        token={token}
                        subject={recommendationSubject}
                      />

                    </div>

                  </section>

                  <WeakConceptsPanel
                    token={token}
                    subject={recommendationSubject}
                  />

                  <StudyProgressPanel
                    dashboard={dashboard}
                  />

                  <AdaptiveLearningPanel
                    token={token}
                    subject={recommendationSubject}
                  />

                  <section className="dashboard-card quiz-history">

                    <div className="card-header">

                      <div>

                        <h3>
                          Quiz History
                        </h3>

                        <p>
                          Your recent learning performance
                        </p>

                      </div>

                    </div>

                    {dashboard.quizResults.length === 0 ? (

                      <p className="empty-text">
                        No quiz results yet.
                      </p>

                    ) : (

                      <div className="quiz-table">

                        <div className="quiz-table-header">

                          <span>
                            Subject
                          </span>

                          <span>
                            Questions
                          </span>

                          <span>
                            Correct
                          </span>

                          <span>
                            Score
                          </span>

                        </div>

                        {dashboard.quizResults.map((result) => (

                          <div
                            className="quiz-table-row"
                            key={result.id}
                          >

                            <span>
                              {result.subject}
                            </span>

                            <span>
                              {result.totalQuestions}
                            </span>

                            <span>
                              {result.correctAnswers}
                            </span>

                            <strong>
                              {result.score.toFixed(1)}%
                            </strong>

                          </div>

                        ))}

                      </div>

                    )}

                  </section>

                </>

              ) : (

                <div className="dashboard-loading">
                  Unable to load dashboard.
                </div>

              )}

            </>

          )}

        </main>

      </div>
    )
  }

  return (
    <div className="app">

      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>

      <main className="auth-container">

        <section className="brand-section">

          <div className="brand-icon">
            🧠
          </div>

          <h1>
            RecallAI
          </h1>

          <p className="tagline">
            Your Cognitive Learning Twin
          </p>

          <p className="description">
            Learn smarter, identify weak concepts,
            track your mastery and get personalized
            revision recommendations.
          </p>

          <div className="feature-list">

            <div className="feature">

              <span>
                📚
              </span>

              <div>

                <strong>
                  Smart Learning
                </strong>

                <p>
                  Turn study material into useful knowledge.
                </p>

              </div>

            </div>

            <div className="feature">

              <span>
                🧠
              </span>

              <div>

                <strong>
                  Concept Mastery
                </strong>

                <p>
                  Track how well you understand each concept.
                </p>

              </div>

            </div>

            <div className="feature">

              <span>
                🎯
              </span>

              <div>

                <strong>
                  Personalized Revision
                </strong>

                <p>
                  Focus on the concepts that need you most.
                </p>

              </div>

            </div>

          </div>

        </section>

        <section className="auth-card">

          <div className="auth-header">

            <h2>
              {isLogin
                ? 'Welcome back'
                : 'Create your account'}
            </h2>

            <p>
              {isLogin
                ? 'Continue your learning journey'
                : 'Start building your Cognitive Learning Twin'}
            </p>

          </div>

          <form onSubmit={handleSubmit}>

            {!isLogin && (

              <div className="input-group">

                <label>
                  Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  required
                />

              </div>

            )}

            <div className="input-group">

              <label>
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />

            </div>

            <div className="input-group">

              <label>
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                minLength="6"
                required
              />

            </div>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading
                ? 'Please wait...'
                : isLogin
                  ? 'Login'
                  : 'Create Account'}
            </button>

          </form>

          {message && (

            <div className="message">
              {message}
            </div>

          )}

          <div className="switch-auth">

            <span>
              {isLogin
                ? "Don't have an account?"
                : 'Already have an account?'}
            </span>

            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setMessage('')
              }}
            >
              {isLogin
                ? 'Create account'
                : 'Login'}
            </button>

          </div>

        </section>

      </main>

    </div>
  )
}

export default App