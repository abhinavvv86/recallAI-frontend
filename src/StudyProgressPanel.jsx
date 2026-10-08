function StudyProgressPanel({ dashboard }) {
  if (!dashboard) {
    return null
  }

  const concepts = dashboard.concepts || []
  const quizResults = dashboard.quizResults || []

  const averageMastery = Number(
    dashboard.averageMastery || 0
  )

  const averageQuizScore = Number(
    dashboard.averageQuizScore || 0
  )

  const masteryBuckets = {
    weak: concepts.filter(
      (concept) =>
        Number(concept.masteryLevel || 0) < 40
    ).length,

    developing: concepts.filter(
      (concept) =>
        Number(concept.masteryLevel || 0) >= 40 &&
        Number(concept.masteryLevel || 0) < 70
    ).length,

    strong: concepts.filter(
      (concept) =>
        Number(concept.masteryLevel || 0) >= 70
    ).length
  }

  const strongestConcepts = [...concepts]
    .sort(
      (a, b) =>
        Number(b.masteryLevel || 0) -
        Number(a.masteryLevel || 0)
    )
    .slice(0, 3)

  const weakestConcepts = [...concepts]
    .sort(
      (a, b) =>
        Number(a.masteryLevel || 0) -
        Number(b.masteryLevel || 0)
    )
    .slice(0, 3)

  const getMasteryLabel = (mastery) => {
    if (mastery < 40) {
      return 'Needs Attention'
    }

    if (mastery < 70) {
      return 'Developing'
    }

    return 'Strong'
  }

  const getProgressMessage = () => {
    if (averageMastery < 40) {
      return 'Your concepts need more revision. Focus on your weakest concepts first.'
    }

    if (averageMastery < 70) {
      return 'You are building a good foundation. Keep practicing to strengthen your concepts.'
    }

    return 'Excellent progress! Your overall concept mastery is strong.'
  }

  return (
    <section className="study-progress-section">

      <div className="section-title">

        <div>

          <p className="eyebrow">
            LEARNING ANALYTICS
          </p>

          <h2>
            Study Progress
          </h2>

          <p>
            Track your concept mastery, quiz performance,
            and areas that need more attention.
          </p>

        </div>

      </div>

      <div className="progress-stat-grid">

        <div className="progress-stat-card">

          <span className="progress-stat-label">
            Average Mastery
          </span>

          <strong>
            {averageMastery.toFixed(1)}%
          </strong>

          <div className="progress-stat-bar">

            <div
              style={{
                width: `${Math.min(
                  Math.max(averageMastery, 0),
                  100
                )}%`
              }}
            ></div>

          </div>

        </div>

        <div className="progress-stat-card">

          <span className="progress-stat-label">
            Average Quiz Score
          </span>

          <strong>
            {averageQuizScore.toFixed(1)}%
          </strong>

          <div className="progress-stat-bar">

            <div
              style={{
                width: `${Math.min(
                  Math.max(averageQuizScore, 0),
                  100
                )}%`
              }}
            ></div>

          </div>

        </div>

        <div className="progress-stat-card">

          <span className="progress-stat-label">
            Concepts Studied
          </span>

          <strong>
            {dashboard.totalConcepts || 0}
          </strong>

          <small>
            Extracted by RecallAI
          </small>

        </div>

        <div className="progress-stat-card">

          <span className="progress-stat-label">
            Quizzes Completed
          </span>

          <strong>
            {dashboard.totalQuizzes || 0}
          </strong>

          <small>
            Learning assessments
          </small>

        </div>

      </div>

      <div className="progress-main-grid">

        <div className="dashboard-card">

          <div className="card-header">

            <div>

              <h3>
                Mastery Distribution
              </h3>

              <p>
                Your concepts grouped by current mastery level.
              </p>

            </div>

          </div>

          <div className="mastery-distribution">

            <div className="mastery-distribution-item">

              <div className="mastery-distribution-top">

                <span>
                  Needs Attention
                </span>

                <strong>
                  {masteryBuckets.weak}
                </strong>

              </div>

              <div className="mastery-track">

                <div
                  className="mastery-fill mastery-weak"
                  style={{
                    width: concepts.length
                      ? `${(
                          (masteryBuckets.weak /
                            concepts.length) *
                          100
                        ).toFixed(1)}%`
                      : '0%'
                  }}
                ></div>

              </div>

              <small>
                Below 40% mastery
              </small>

            </div>

            <div className="mastery-distribution-item">

              <div className="mastery-distribution-top">

                <span>
                  Developing
                </span>

                <strong>
                  {masteryBuckets.developing}
                </strong>

              </div>

              <div className="mastery-track">

                <div
                  className="mastery-fill mastery-developing"
                  style={{
                    width: concepts.length
                      ? `${(
                          (masteryBuckets.developing /
                            concepts.length) *
                          100
                        ).toFixed(1)}%`
                      : '0%'
                  }}
                ></div>

              </div>

              <small>
                40% – 69% mastery
              </small>

            </div>

            <div className="mastery-distribution-item">

              <div className="mastery-distribution-top">

                <span>
                  Strong
                </span>

                <strong>
                  {masteryBuckets.strong}
                </strong>

              </div>

              <div className="mastery-track">

                <div
                  className="mastery-fill mastery-strong"
                  style={{
                    width: concepts.length
                      ? `${(
                          (masteryBuckets.strong /
                            concepts.length) *
                          100
                        ).toFixed(1)}%`
                      : '0%'
                  }}
                ></div>

              </div>

              <small>
                70%+ mastery
              </small>

            </div>

          </div>

        </div>

        <div className="dashboard-card">

          <div className="card-header">

            <div>

              <h3>
                Learning Status
              </h3>

              <p>
                Overall interpretation of your current progress.
              </p>

            </div>

          </div>

          <div className="learning-status">

            <div className="learning-status-score">
              {averageMastery.toFixed(0)}%
            </div>

            <div>

              <strong>
                {getMasteryLabel(averageMastery)}
              </strong>

              <p>
                {getProgressMessage()}
              </p>

            </div>

          </div>

          <div className="learning-status-stats">

            <div>

              <span>
                Weak Concepts
              </span>

              <strong>
                {dashboard.weakConcepts || 0}
              </strong>

            </div>

            <div>

              <span>
                Quiz Average
              </span>

              <strong>
                {averageQuizScore.toFixed(0)}%
              </strong>

            </div>

          </div>

        </div>

      </div>

      <div className="progress-main-grid">

        <div className="dashboard-card">

          <div className="card-header">

            <div>

              <h3>
                Strongest Concepts
              </h3>

              <p>
                Concepts where you currently perform best.
              </p>

            </div>

          </div>

          {strongestConcepts.length === 0 ? (

            <div className="empty-text">
              No concepts available yet.
            </div>

          ) : (

            <div className="concept-progress-list">

              {strongestConcepts.map((concept) => {

                const mastery =
                  Number(concept.masteryLevel || 0)

                return (

                  <div
                    className="concept-progress-item"
                    key={concept.id}
                  >

                    <div className="concept-progress-header">

                      <div>

                        <strong>
                          {concept.name}
                        </strong>

                        <span>
                          {concept.subject}
                        </span>

                      </div>

                      <b>
                        {mastery.toFixed(1)}%
                      </b>

                    </div>

                    <div className="concept-progress-track">

                      <div
                        className="concept-progress-fill"
                        style={{
                          width: `${Math.min(
                            Math.max(mastery, 0),
                            100
                          )}%`
                        }}
                      ></div>

                    </div>

                  </div>

                )
              })}

            </div>

          )}

        </div>

        <div className="dashboard-card">

          <div className="card-header">

            <div>

              <h3>
                Concepts to Revise
              </h3>

              <p>
                Start your next revision session here.
              </p>

            </div>

          </div>

          {weakestConcepts.length === 0 ? (

            <div className="empty-text">
              No concepts available yet.
            </div>

          ) : (

            <div className="concept-progress-list">

              {weakestConcepts.map((concept) => {

                const mastery =
                  Number(concept.masteryLevel || 0)

                return (

                  <div
                    className="concept-progress-item"
                    key={concept.id}
                  >

                    <div className="concept-progress-header">

                      <div>

                        <strong>
                          {concept.name}
                        </strong>

                        <span>
                          {getMasteryLabel(mastery)}
                        </span>

                      </div>

                      <b>
                        {mastery.toFixed(1)}%
                      </b>

                    </div>

                    <div className="concept-progress-track">

                      <div
                        className="concept-progress-fill weak-progress"
                        style={{
                          width: `${Math.min(
                            Math.max(mastery, 0),
                            100
                          )}%`
                        }}
                      ></div>

                    </div>

                  </div>

                )
              })}

            </div>

          )}

        </div>

      </div>

      <div className="dashboard-card quiz-performance-card">

        <div className="card-header">

          <div>

            <h3>
              Quiz Performance
            </h3>

            <p>
              Your performance across completed quizzes.
            </p>

          </div>

        </div>

        {quizResults.length === 0 ? (

          <div className="empty-text">
            Complete a quiz to see your performance here.
          </div>

        ) : (

          <div className="quiz-performance-list">

            {quizResults.map((quiz, index) => {

              const score =
                Number(quiz.score || 0)

              return (

                <div
                  className="quiz-performance-item"
                  key={quiz.id || index}
                >

                  <div className="quiz-performance-info">

                    <div>

                      <strong>
                        Quiz Attempt {index + 1}
                      </strong>

                      <span>
                        {quiz.subject}
                      </span>

                    </div>

                    <b>
                      {score.toFixed(1)}%
                    </b>

                  </div>

                  <div className="quiz-performance-track">

                    <div
                      className="quiz-performance-fill"
                      style={{
                        width: `${Math.min(
                          Math.max(score, 0),
                          100
                        )}%`
                      }}
                    ></div>

                  </div>

                  <small>
                    {quiz.correctAnswers} correct out of{' '}
                    {quiz.totalQuestions}
                  </small>

                </div>

              )
            })}

          </div>

        )}

      </div>

    </section>
  )
}

export default StudyProgressPanel