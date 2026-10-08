import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || ''







function StudyMaterialPanel({ token }) {



  const [title, setTitle] = useState('')



  const [subject, setSubject] = useState('')



  const [content, setContent] = useState('')







  const [materials, setMaterials] = useState([])



  const [selectedMaterial, setSelectedMaterial] = useState(null)







  const [summary, setSummary] = useState('')



  const [concepts, setConcepts] = useState('')







  const [quizQuestions, setQuizQuestions] = useState([])



  const [quizAnswers, setQuizAnswers] = useState({})



  const [quizSubmitted, setQuizSubmitted] = useState(false)



  const [quizScore, setQuizScore] = useState(null)







  const [loading, setLoading] = useState(false)



  const [message, setMessage] = useState('')







  const loadMaterials = async () => {



    try {



      const response = await fetch(`${API_URL}/api/materials`, {



        headers: {



          Authorization: `Bearer ${token}`



        }



      })







      if (!response.ok) {



        throw new Error('Unable to load study materials')



      }







      const data = await response.json()







      setMaterials(data)



    } catch (error) {



      setMessage(error.message)



    }



  }







  useEffect(() => {



    if (token) {



      loadMaterials()



    }



  }, [token])







  const createMaterial = async (event) => {



    event.preventDefault()







    setLoading(true)



    setMessage('')







    try {



      const response = await fetch(`${API_URL}/api/materials`, {



        method: 'POST',



        headers: {



          'Content-Type': 'application/json',



          Authorization: `Bearer ${token}`



        },



        body: JSON.stringify({



          title,



          content,



          subject



        })



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



          data.message || text || 'Unable to create study material'



        )



      }







      setMessage('Study material added successfully.')







      setTitle('')



      setSubject('')



      setContent('')







      await loadMaterials()



    } catch (error) {



      setMessage(error.message)



    } finally {



      setLoading(false)



    }



  }







  const generateSummary = async (materialId) => {



    setLoading(true)



    setMessage('')



    setSummary('')







    try {



      const response = await fetch(



        `${API_URL}/api/materials/${materialId}/summary`,



        {



          method: 'POST',



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



          data.message || text || 'Unable to generate summary'



        )



      }







      setSummary(data.summary || '')



    } catch (error) {



      setMessage(error.message)



    } finally {



      setLoading(false)



    }



  }







  const generateConcepts = async (materialId) => {



    setLoading(true)



    setMessage('')



    setConcepts('')







    try {



      const response = await fetch(



        `${API_URL}/api/materials/${materialId}/concepts`,



        {



          method: 'POST',



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



          data.message || text || 'Unable to extract concepts'



        )



      }







      setConcepts(data.concepts || '')







      await loadMaterials()



    } catch (error) {



      setMessage(error.message)



    } finally {



      setLoading(false)



    }



  }







  const parseQuiz = (text) => {
    if (!text || typeof text !== 'string') {
      return []
    }

    const normalizedText = text
      .replace(/\r/g, '')
      .replace(/\*\*/g, '')
      .replace(/```/g, '')
      .trim()

    const blocks = normalizedText
      .split(/(?=Question\s*\*?\d+\*?\s*:)/i)
      .filter((block) =>
        /Question\s*\*?\d+\*?\s*:/i.test(block)
      )

    return blocks
      .map((block) => {
        const questionMatch = block.match(
          /Question\s*\*?\d+\*?\s*:\s*([\s\S]*?)(?=\n\s*\*?A[\):]?\s*)/i
        )

        const optionAMatch = block.match(
          /\n\s*\*?A[\):]?\s*([\s\S]*?)(?=\n\s*\*?B[\):]?\s*)/i
        )

        const optionBMatch = block.match(
          /\n\s*\*?B[\):]?\s*([\s\S]*?)(?=\n\s*\*?C[\):]?\s*)/i
        )

        const optionCMatch = block.match(
          /\n\s*\*?C[\):]?\s*([\s\S]*?)(?=\n\s*\*?D[\):]?\s*)/i
        )

        const optionDMatch = block.match(
          /\n\s*\*?D[\):]?\s*([\s\S]*?)(?=\n\s*\*?(?:Answer|Correct Answer)[\s:])/i
        )

        const answerMatch = block.match(
          /(?:Answer|Correct Answer)\s*:\s*\[?\(?\s*([ABCD])\s*\]?\)?/i
        )

        const explanationMatch = block.match(
          /Explanation\s*:\s*([\s\S]*)/i
        )

        if (
          !questionMatch ||
          !optionAMatch ||
          !optionBMatch ||
          !optionCMatch ||
          !optionDMatch ||
          !answerMatch
        ) {
          return null
        }

        return {
          question: questionMatch[1].trim(),
          options: {
            A: optionAMatch[1].trim(),
            B: optionBMatch[1].trim(),
            C: optionCMatch[1].trim(),
            D: optionDMatch[1].trim()
          },
          answer: answerMatch[1].toUpperCase(),
          explanation: explanationMatch
            ? explanationMatch[1].trim()
            : ''
        }
      })
      .filter(Boolean)
  }

  const generateQuiz = async (materialId) => {



    setLoading(true)



    setMessage('')







    setQuizQuestions([])



    setQuizAnswers({})



    setQuizSubmitted(false)



    setQuizScore(null)







    try {



      const response = await fetch(



        `${API_URL}/api/materials/${materialId}/quiz`,



        {



          method: 'POST',



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



          data.message || text || 'Unable to generate quiz'



        )



      }







      const questions = parseQuiz(data.quiz)







      if (questions.length === 0) {



        throw new Error(



          'The AI returned an unexpected quiz format. Please generate the quiz again.'



        )



      }







      setQuizQuestions(questions)



    } catch (error) {



      setMessage(error.message)



    } finally {



      setLoading(false)



    }



  }







  const selectAnswer = (questionIndex, answer) => {



    if (quizSubmitted) {



      return



    }







    setQuizAnswers((previous) => ({



      ...previous,



      [questionIndex]: answer



    }))



  }







  const submitQuiz = async () => {



    if (quizQuestions.length === 0) {



      return



    }







    const unanswered = quizQuestions.some(



      (_, index) => !quizAnswers[index]



    )







    if (unanswered) {



      setMessage(



        'Please answer all questions before submitting.'



      )



      return



    }







    let correctAnswers = 0







    quizQuestions.forEach((question, index) => {



      if (quizAnswers[index] === question.answer) {



        correctAnswers++



      }



    })







    const score =



      (correctAnswers / quizQuestions.length) * 100







    setQuizScore(score)



    setQuizSubmitted(true)



    setMessage('')







    try {



      const response = await fetch(`${API_URL}/api/quiz-results`, {



        method: 'POST',



        headers: {



          'Content-Type': 'application/json',



          Authorization: `Bearer ${token}`



        },



        body: JSON.stringify({



          totalQuestions: quizQuestions.length,



          correctAnswers,



          subject: selectedMaterial.subject



        })



      })







      if (!response.ok) {



        throw new Error('Quiz result could not be saved.')



      }



    } catch (error) {



      setMessage(



        `Quiz completed, but the result could not be saved. ${error.message}`



      )



    }



  }







  const resetQuiz = () => {



    setQuizAnswers({})



    setQuizSubmitted(false)



    setQuizScore(null)



    setMessage('')



  }







  return (



    <section className="materials-section">







      <div className="section-title">







        <div>



          <p className="eyebrow">



            AI LEARNING WORKSPACE



          </p>







          <h2>Study Materials</h2>







          <p>



            Add your learning material and let RecallAI



            analyze it for you.



          </p>



        </div>







        <button



          className="secondary-button"



          onClick={loadMaterials}



        >



          Refresh



        </button>







      </div>







      <div className="material-layout">







        <div className="dashboard-card material-form-card">







          <h3>Add Study Material</h3>







          <form onSubmit={createMaterial}>







            <div className="input-group">







              <label>Title</label>







              <input



                type="text"



                placeholder="e.g. Neural Networks"



                value={title}



                onChange={(event) =>



                  setTitle(event.target.value)



                }



                required



              />







            </div>







            <div className="input-group">







              <label>Subject</label>







              <input



                type="text"



                placeholder="e.g. Artificial Intelligence"



                value={subject}



                onChange={(event) =>



                  setSubject(event.target.value)



                }



                required



              />







            </div>







            <div className="input-group">







              <label>Study Material</label>







              <textarea



                placeholder="Paste your study material here..."



                value={content}



                onChange={(event) =>



                  setContent(event.target.value)



                }



                rows="10"



                required



              />







            </div>







            <button



              type="submit"



              className="primary-button"



              disabled={loading}



            >



              {loading



                ? 'Processing...'



                : 'Add Material'}



            </button>







          </form>







          {message && (



            <div className="message">



              {message}



            </div>



          )}







        </div>







        <div className="dashboard-card">







          <div className="card-header">







            <div>



              <h3>Your Materials</h3>







              <p>



                Select a material to use RecallAI AI tools.



              </p>



            </div>







          </div>







          <div className="material-list">







            {materials.length === 0 ? (



              <div className="empty-text">



                No study materials found.



              </div>



            ) : (



              materials.map((material) => (



                <div



                  className={`material-item ${



                    selectedMaterial?.id === material.id



                      ? 'material-selected'



                      : ''



                  }`}



                  key={material.id}



                  onClick={() =>



                    setSelectedMaterial(material)



                  }



                >







                  <div>







                    <strong>



                      {material.title}



                    </strong>







                    <span>



                      {material.subject}



                    </span>







                  </div>







                  <small>



                    #{material.id}



                  </small>







                </div>



              ))



            )}







          </div>







        </div>







      </div>







      {selectedMaterial && (



        <div className="dashboard-card ai-tools-card">







          <div className="card-header">







            <div>



              <h3>



                AI Tools — {selectedMaterial.title}



              </h3>







              <p>



                Powered by your local Llama 3.2 model.



              </p>



            </div>







          </div>







          <div className="ai-button-row">







            <button



              className="secondary-button"



              onClick={() =>



                generateSummary(selectedMaterial.id)



              }



              disabled={loading}



            >



              Generate Summary



            </button>







            <button



              className="secondary-button"



              onClick={() =>



                generateConcepts(selectedMaterial.id)



              }



              disabled={loading}



            >



              Extract Concepts



            </button>







            <button



              className="secondary-button"



              onClick={() =>



                generateQuiz(selectedMaterial.id)



              }



              disabled={loading}



            >



              Generate Quiz



            </button>







          </div>







          {summary && (



            <div className="ai-result">







              <h4>AI Summary</h4>







              <pre>{summary}</pre>







            </div>



          )}







          {concepts && (



            <div className="ai-result">







              <h4>Extracted Concepts</h4>







              <pre>{concepts}</pre>







            </div>



          )}







          {quizQuestions.length > 0 && (



            <div className="interactive-quiz">







              <div className="quiz-title-row">







                <div>



                  <h4>RecallAI Quiz</h4>







                  <p>



                    Answer the questions to measure your understanding.



                  </p>



                </div>







                {quizSubmitted && (



                  <div className="quiz-score">



                    {quizScore.toFixed(1)}%



                  </div>



                )}







              </div>







              {quizQuestions.map((question, index) => (



                <div



                  className="quiz-question"



                  key={index}



                >







                  <div className="question-number">



                    Question {index + 1}



                  </div>







                  <h4>



                    {question.question}



                  </h4>







                  <div className="quiz-options">







                    {['A', 'B', 'C', 'D'].map((option) => {







                      const isSelected =



                        quizAnswers[index] === option







                      const isCorrect =



                        quizSubmitted &&



                        question.answer === option







                      const isWrong =



                        quizSubmitted &&



                        isSelected &&



                        question.answer !== option







                      return (



                        <button



                          key={option}



                          className={`quiz-option ${



                            isSelected



                              ? 'quiz-option-selected'



                              : ''



                          } ${



                            isCorrect



                              ? 'quiz-option-correct'



                              : ''



                          } ${



                            isWrong



                              ? 'quiz-option-wrong'



                              : ''



                          }`}



                          onClick={() =>



                            selectAnswer(index, option)



                          }



                          disabled={quizSubmitted}



                        >







                          <span className="option-letter">



                            {option}



                          </span>







                          <span>



                            {question.options[option]}



                          </span>







                        </button>



                      )



                    })}







                  </div>







                  {quizSubmitted && (



                    <div className="quiz-explanation">







                      <strong>



                        Explanation



                      </strong>







                      <p>



                        {question.explanation}



                      </p>







                    </div>



                  )}







                </div>



              ))}







              {!quizSubmitted ? (



                <button



                  className="primary-button quiz-submit-button"



                  onClick={submitQuiz}



                >



                  Submit Quiz



                </button>



              ) : (



                <button



                  className="secondary-button quiz-reset-button"



                  onClick={resetQuiz}



                >



                  Try Again



                </button>



              )}







            </div>



          )}







        </div>



      )}







    </section>



  )



}







export default StudyMaterialPanel