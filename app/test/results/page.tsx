"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { testData } from "@/lib/test-data"

// In a real application, this would come from the database
// For this demo, we're generating mock results
const generateMockResults = () => {
  const results = {
    score: 78,
    sectionScores: {
      audio: 85,
      visual: 70,
      signal: 90,
      troubleshooting: 65,
    },
    answers: {},
    feedback:
      "Good understanding of audio systems and signal flow. Could improve knowledge of visual systems and troubleshooting techniques.",
  }

  // Generate mock answers
  Object.entries(testData).forEach(([sectionId, section]) => {
    section.questions.forEach((question) => {
      // Randomly determine if the answer is correct (70% chance)
      const isCorrect = Math.random() < 0.7

      if (question.type === "multiple-choice") {
        results.answers[question.id] = {
          selected: isCorrect ? question.correctAnswer : question.options.find((o) => o !== question.correctAnswer),
          isCorrect,
        }
      } else if (question.type === "multiple-select") {
        // For multiple select, randomly select some options
        const selectedOptions = question.options.filter(() => Math.random() > 0.5).map((option) => option)

        results.answers[question.id] = {
          selected: selectedOptions,
          isCorrect: isCorrect,
        }
      } else if (question.type === "diagram") {
        results.answers[question.id] = {
          selected: isCorrect ? question.correctAnswer : Math.floor(Math.random() * 4) + 1,
          isCorrect,
        }
      }
    })
  })

  return results
}

export default function ResultsPage() {
  const [activeSection, setActiveSection] = useState("summary")
  const results = generateMockResults()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Assessment Results</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl">Your Assessment Results</CardTitle>
            <CardDescription>Review your performance and areas for improvement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
              <div className="relative w-40 h-40">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold">{results.score}%</span>
                </div>
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={results.score >= 70 ? "#10b981" : results.score >= 50 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="10"
                    strokeDasharray={`${results.score * 2.83} 283`}
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-2">Section Breakdown</h3>
                <div className="space-y-3">
                  {Object.entries(results.sectionScores).map(([section, score]) => (
                    <div key={section} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{section.replace("-", " ")}</span>
                        <span className="font-medium">{score}%</span>
                      </div>
                      <Progress value={score} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border rounded-md p-4">
              <h3 className="font-medium mb-2">Feedback</h3>
              <p>{results.feedback}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
            <Button asChild>
              <Link href="/test/certificate">View Certificate</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Detailed Review</CardTitle>
            <CardDescription>Review your answers and see the correct solutions</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeSection} onValueChange={setActiveSection}>
              <TabsList className="grid grid-cols-5 mb-6">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="audio">Audio</TabsTrigger>
                <TabsTrigger value="visual">Visual</TabsTrigger>
                <TabsTrigger value="signal">Signal Flow</TabsTrigger>
                <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
              </TabsList>

              <TabsContent value="summary">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Performance Summary</h3>
                  <p>You scored {results.score}% overall on the assessment. Here's a breakdown of your performance:</p>

                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <span className="font-medium">Strengths:</span> Signal flow concepts (90%), Audio systems
                        knowledge (85%)
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                      <div>
                        <span className="font-medium">Areas for improvement:</span> Troubleshooting techniques (65%),
                        Visual systems (70%)
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <span className="font-medium">Recommendation:</span> Focus on improving your knowledge of
                        projector setup, display calibration, and systematic troubleshooting approaches.
                      </div>
                    </li>
                  </ul>

                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-6">
                    <h4 className="text-blue-800 font-medium mb-1">Next Steps</h4>
                    <p className="text-blue-700 text-sm">
                      Review the detailed feedback for each section to understand specific areas for improvement. We
                      recommend focusing on the troubleshooting section, which had the lowest score.
                    </p>
                  </div>
                </div>
              </TabsContent>

              {Object.entries(testData).map(([sectionId, section]) => (
                <TabsContent key={sectionId} value={sectionId} className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium mb-1">{section.title}</h3>
                    <p className="text-gray-600 mb-2">{section.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Section Score:</span>
                      <span
                        className={`font-bold ${
                          results.sectionScores[sectionId] >= 70
                            ? "text-green-600"
                            : results.sectionScores[sectionId] >= 50
                              ? "text-amber-600"
                              : "text-red-600"
                        }`}
                      >
                        {results.sectionScores[sectionId]}%
                      </span>
                    </div>
                  </div>

                  {section.questions.map((question, index) => {
                    const answer = results.answers[question.id]
                    return (
                      <div key={question.id} className="border rounded-md p-4">
                        <div className="flex items-start gap-2">
                          {answer?.isCorrect ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500 mt-1 shrink-0" />
                          )}
                          <div className="space-y-2 w-full">
                            <h4 className="font-medium">
                              Question {index + 1}: {question.text}
                            </h4>

                            {question.type === "multiple-choice" && (
                              <div className="grid gap-2">
                                {question.options.map((option) => (
                                  <div
                                    key={option}
                                    className={`p-2 rounded-md border ${
                                      option === question.correctAnswer
                                        ? "bg-green-50 border-green-200"
                                        : option === answer?.selected
                                          ? "bg-red-50 border-red-200"
                                          : "bg-gray-50"
                                    }`}
                                  >
                                    {option}
                                    {option === question.correctAnswer && (
                                      <span className="ml-2 text-green-600 text-sm">(Correct Answer)</span>
                                    )}
                                    {option === answer?.selected && option !== question.correctAnswer && (
                                      <span className="ml-2 text-red-600 text-sm">(Your Answer)</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {question.type === "multiple-select" && (
                              <div className="grid gap-2">
                                {question.options.map((option) => (
                                  <div
                                    key={option}
                                    className={`p-2 rounded-md border ${
                                      question.correctAnswers.includes(option)
                                        ? "bg-green-50 border-green-200"
                                        : answer?.selected.includes(option)
                                          ? "bg-red-50 border-red-200"
                                          : "bg-gray-50"
                                    }`}
                                  >
                                    {option}
                                    {question.correctAnswers.includes(option) && (
                                      <span className="ml-2 text-green-600 text-sm">(Correct)</span>
                                    )}
                                    {answer?.selected.includes(option) && !question.correctAnswers.includes(option) && (
                                      <span className="ml-2 text-red-600 text-sm">(Incorrect Selection)</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {question.type === "diagram" && (
                              <div className="space-y-2">
                                <div className="border rounded-md p-2 bg-gray-50">
                                  <p className="text-sm text-gray-600 mb-2">
                                    Diagram question - select the correct component
                                  </p>
                                  <div className="aspect-video bg-gray-200 flex items-center justify-center">
                                    [Diagram Image]
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  {[1, 2, 3, 4].map((option) => (
                                    <div
                                      key={option}
                                      className={`p-2 rounded-md border ${
                                        option === question.correctAnswer
                                          ? "bg-green-50 border-green-200"
                                          : option === answer?.selected
                                            ? "bg-red-50 border-red-200"
                                            : "bg-gray-50"
                                      }`}
                                    >
                                      Component {option}
                                      {option === question.correctAnswer && (
                                        <span className="ml-2 text-green-600 text-sm">(Correct)</span>
                                      )}
                                      {option === answer?.selected && option !== question.correctAnswer && (
                                        <span className="ml-2 text-red-600 text-sm">(Your Selection)</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {question.explanation && (
                              <div className="mt-2 p-3 bg-blue-50 rounded-md text-sm">
                                <p className="font-medium text-blue-800">Explanation:</p>
                                <p className="text-blue-700">{question.explanation}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
