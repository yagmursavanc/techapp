"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Clock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import TestQuestion from "@/components/test-question"
import { testData } from "@/lib/test-data"

export default function TestPage() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("audio")
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(60 * 60) // 60 minutes in seconds
  const [isFinished, setIsFinished] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  // Calculate progress
  const totalQuestions = Object.values(testData).reduce((acc, section) => acc + section.questions.length, 0)

  const answeredQuestions = Object.keys(answers).length
  const progress = Math.round((answeredQuestions / totalQuestions) * 100)

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      finishTest()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)

      // Show warning when 5 minutes left
      if (timeLeft === 300) {
        setShowWarning(true)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  // Handle answer changes
  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  // Finish test and redirect to results
  const finishTest = () => {
    setIsFinished(true)
    // In a real app, you would save answers to a database here
    // For this demo, we'll just redirect to a results page
    setTimeout(() => {
      router.push("/test/results")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">AV Technician Assessment</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-md">
              <Clock className="h-4 w-4 text-gray-600" />
              <span className={`font-mono ${timeLeft < 300 ? "text-red-600 font-bold" : ""}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <Button variant="outline" onClick={() => setShowWarning(true)}>
              Finish Test
            </Button>
          </div>
        </div>
        <div className="container mx-auto px-4 pb-4">
          <div className="flex items-center gap-2">
            <Progress value={progress} className="h-2" />
            <span className="text-sm text-gray-500 min-w-[45px]">{progress}%</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {showWarning && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{timeLeft < 300 ? "Time is almost up!" : "Finish Test?"}</AlertTitle>
            <AlertDescription>
              {timeLeft < 300
                ? "You have less than 5 minutes remaining. Please finish your test soon."
                : "Are you sure you want to finish the test? You won't be able to change your answers after submission."}
              {timeLeft >= 300 && (
                <div className="flex gap-2 mt-2">
                  <Button size="sm" onClick={finishTest}>
                    Yes, finish test
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowWarning(false)}>
                    Continue testing
                  </Button>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {isFinished ? (
          <Card className="max-w-3xl mx-auto p-6 text-center">
            <h2 className="text-xl font-bold mb-2">Test Completed</h2>
            <p>Thank you for completing the assessment. Redirecting to your results...</p>
          </Card>
        ) : (
          <Tabs value={activeSection} onValueChange={setActiveSection} className="max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="audio">Audio Systems</TabsTrigger>
              <TabsTrigger value="visual">Visual Systems</TabsTrigger>
              <TabsTrigger value="signal">Signal Flow</TabsTrigger>
              <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
            </TabsList>

            {Object.entries(testData).map(([sectionId, section]) => (
              <TabsContent key={sectionId} value={sectionId} className="space-y-6">
                <h2 className="text-xl font-bold">{section.title}</h2>
                <p className="text-gray-600">{section.description}</p>

                {section.questions.map((question, index) => (
                  <TestQuestion
                    key={question.id}
                    question={question}
                    index={index}
                    value={answers[question.id] || ""}
                    onChange={(value) => handleAnswerChange(question.id, value)}
                  />
                ))}

                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const sections = Object.keys(testData)
                      const currentIndex = sections.indexOf(activeSection)
                      if (currentIndex > 0) {
                        setActiveSection(sections[currentIndex - 1])
                      }
                    }}
                    disabled={activeSection === Object.keys(testData)[0]}
                  >
                    Previous Section
                  </Button>
                  <Button
                    onClick={() => {
                      const sections = Object.keys(testData)
                      const currentIndex = sections.indexOf(activeSection)
                      if (currentIndex < sections.length - 1) {
                        setActiveSection(sections[currentIndex + 1])
                      } else {
                        setShowWarning(true)
                      }
                    }}
                  >
                    {activeSection === Object.keys(testData)[Object.keys(testData).length - 1]
                      ? "Finish Test"
                      : "Next Section"}
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </main>
    </div>
  )
}
