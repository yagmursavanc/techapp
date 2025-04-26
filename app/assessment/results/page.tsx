"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, AlertCircle } from "lucide-react"

// In a real app, this would come from the database
// For this demo, we're generating mock results
const mockResults = {
  overallScore: 78,
  timeSpent: "24:35",
  completionDate: new Date().toLocaleDateString(),
  categories: {
    audio: {
      score: 85,
      feedback: "Strong understanding of speaker placement and signal routing.",
      strengths: ["Speaker positioning", "EQ adjustments", "Signal flow"],
      improvements: ["Feedback prevention", "Microphone selection"],
    },
    lighting: {
      score: 70,
      feedback: "Good basic lighting knowledge, but room for improvement in DMX programming.",
      strengths: ["Basic light positioning", "Color selection"],
      improvements: ["DMX addressing", "Scene programming", "Fixture selection"],
    },
    troubleshooting: {
      score: 80,
      feedback: "Quick to identify common issues, but some complex problems took longer to resolve.",
      strengths: ["Cable fault identification", "Signal path tracing"],
      improvements: ["Wireless interference troubleshooting", "Digital console diagnostics"],
    },
  },
  taskResults: [
    {
      id: "task1",
      title: "Speaker Placement",
      score: 90,
      maxScore: 100,
      timeTaken: "4:12",
      feedback:
        "Excellent speaker positioning for optimal coverage. Consider adjusting the subwoofer placement for better low-frequency distribution.",
    },
    {
      id: "task2",
      title: "Mixing Console Setup",
      score: 80,
      maxScore: 100,
      timeTaken: "6:45",
      feedback: "Good channel routing and gain structure. EQ settings could be refined for better clarity.",
    },
    {
      id: "task3",
      title: "Lighting Programming",
      score: 70,
      maxScore: 100,
      timeTaken: "8:20",
      feedback:
        "Basic lighting scenes created successfully. More dynamic transitions and creative use of fixtures would improve the result.",
    },
    {
      id: "task4",
      title: "Troubleshooting Audio Issues",
      score: 75,
      maxScore: 100,
      timeTaken: "5:18",
      feedback: "Identified and resolved the main issues efficiently. Missed one potential source of interference.",
    },
  ],
}

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Assessment Results</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
                <div className="relative w-40 h-40">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold">{mockResults.overallScore}%</span>
                  </div>
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={
                        mockResults.overallScore >= 70
                          ? "#10b981"
                          : mockResults.overallScore >= 50
                            ? "#f59e0b"
                            : "#ef4444"
                      }
                      strokeWidth="10"
                      strokeDasharray={`${mockResults.overallScore * 2.83} 283`}
                      strokeDashoffset="0"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Time Spent</p>
                      <p className="font-medium">{mockResults.timeSpent}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Completion Date</p>
                      <p className="font-medium">{mockResults.completionDate}</p>
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Category Breakdown</h3>
                  <div className="space-y-3">
                    {Object.entries(mockResults.categories).map(([category, data]) => (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{category}</span>
                          <span className="font-medium">{data.score}%</span>
                        </div>
                        <Progress value={data.score} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="bg-green-50 border border-green-100 rounded-md p-4">
                  <h3 className="font-medium text-green-800 mb-2">Strengths</h3>
                  <ul className="space-y-1">
                    {Object.values(mockResults.categories).flatMap((cat) =>
                      cat.strengths.map((strength) => (
                        <li key={strength} className="flex items-start gap-2 text-green-700">
                          <CheckCircle2 className="h-4 w-4 mt-0.5" />
                          <span>{strength}</span>
                        </li>
                      )),
                    )}
                  </ul>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-md p-4">
                  <h3 className="font-medium text-amber-800 mb-2">Areas for Improvement</h3>
                  <ul className="space-y-1">
                    {Object.values(mockResults.categories).flatMap((cat) =>
                      cat.improvements.map((improvement) => (
                        <li key={improvement} className="flex items-start gap-2 text-amber-700">
                          <AlertCircle className="h-4 w-4 mt-0.5" />
                          <span>{improvement}</span>
                        </li>
                      )),
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Detailed Results</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="audio">Audio</TabsTrigger>
                  <TabsTrigger value="lighting">Lighting</TabsTrigger>
                  <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Task Performance</h3>
                      <div className="space-y-4">
                        {mockResults.taskResults.map((task) => (
                          <div key={task.id} className="border rounded-md p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{task.title}</h4>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Score:</span>
                                <span
                                  className={`font-medium ${
                                    task.score >= 80
                                      ? "text-green-600"
                                      : task.score >= 60
                                        ? "text-amber-600"
                                        : "text-red-600"
                                  }`}
                                >
                                  {task.score}/{task.maxScore}
                                </span>
                              </div>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500 mb-2">
                              <span>Time taken: {task.timeTaken}</span>
                            </div>
                            <Progress
                              value={task.score}
                              className="h-2 mb-3"
                              indicatorClassName={
                                task.score >= 80 ? "bg-green-600" : task.score >= 60 ? "bg-amber-600" : "bg-red-600"
                              }
                            />
                            <p className="text-sm">{task.feedback}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
                      <h3 className="font-medium text-blue-800 mb-2">Recommendations</h3>
                      <p className="text-blue-700 mb-4">
                        Based on your performance, we recommend focusing on the following areas:
                      </p>
                      <ul className="space-y-2 text-blue-700">
                        <li className="flex items-start gap-2">
                          <div className="rounded-full bg-blue-200 p-1 mt-0.5">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <span>Practice DMX programming with different fixture types</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="rounded-full bg-blue-200 p-1 mt-0.5">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <span>Review wireless audio troubleshooting techniques</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="rounded-full bg-blue-200 p-1 mt-0.5">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <span>Improve subwoofer placement and low-frequency management</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="audio">
                  <div className="space-y-4">
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-2">Audio Systems Performance</h3>
                      <div className="flex justify-between items-center mb-3">
                        <span>Overall Score</span>
                        <span className="font-medium text-green-600">85%</span>
                      </div>
                      <Progress value={85} className="h-2 mb-4" />
                      <p>{mockResults.categories.audio.feedback}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border rounded-md p-4">
                        <h4 className="font-medium mb-2">Strengths</h4>
                        <ul className="space-y-2">
                          {mockResults.categories.audio.strengths.map((strength) => (
                            <li key={strength} className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="border rounded-md p-4">
                        <h4 className="font-medium mb-2">Areas for Improvement</h4>
                        <ul className="space-y-2">
                          {mockResults.categories.audio.improvements.map((improvement) => (
                            <li key={improvement} className="flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                              <span>{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="border rounded-md p-4">
                      <h4 className="font-medium mb-3">Detailed Analysis</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Speaker Placement</span>
                            <span className="font-medium">90%</span>
                          </div>
                          <Progress value={90} className="h-1.5" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Signal Routing</span>
                            <span className="font-medium">85%</span>
                          </div>
                          <Progress value={85} className="h-1.5" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>EQ & Processing</span>
                            <span className="font-medium">80%</span>
                          </div>
                          <Progress value={80} className="h-1.5" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Feedback Prevention</span>
                            <span className="font-medium">70%</span>
                          </div>
                          <Progress value={70} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="lighting">
                  <div className="space-y-4">
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-2">Lighting Systems Performance</h3>
                      <div className="flex justify-between items-center mb-3">
                        <span>Overall Score</span>
                        <span className="font-medium text-amber-600">70%</span>
                      </div>
                      <Progress value={70} className="h-2 mb-4" />
                      <p>{mockResults.categories.lighting.feedback}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border rounded-md p-4">
                        <h4 className="font-medium mb-2">Strengths</h4>
                        <ul className="space-y-2">
                          {mockResults.categories.lighting.strengths.map((strength) => (
                            <li key={strength} className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="border rounded-md p-4">
                        <h4 className="font-medium mb-2">Areas for Improvement</h4>
                        <ul className="space-y-2">
                          {mockResults.categories.lighting.improvements.map((improvement) => (
                            <li key={improvement} className="flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                              <span>{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="border rounded-md p-4">
                      <h4 className="font-medium mb-3">Detailed Analysis</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Light Positioning</span>
                            <span className="font-medium">75%</span>
                          </div>
                          <Progress value={75} className="h-1.5" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Color Selection</span>
                            <span className="font-medium">80%</span>
                          </div>
                          <Progress value={80} className="h-1.5" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>DMX Programming</span>
                            <span className="font-medium">60%</span>
                          </div>
                          <Progress value={60} className="h-1.5" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Scene Transitions</span>
                            <span className="font-medium">65%</span>
                          </div>
                          <Progress value={65} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="troubleshooting">
                  <div className="space-y-4">
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-2">Troubleshooting Performance</h3>
                      <div className="flex justify-between items-center mb-3">
                        <span>Overall Score</span>
                        <span className="font-medium text-green-600">80%</span>
                      </div>
                      <Progress value={80} className="h-2 mb-4" />
                      <p>{mockResults.categories.troubleshooting.feedback}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border rounded-md p-4">
                        <h4 className="font-medium mb-2">Strengths</h4>
                        <ul className="space-y-2">
                          {mockResults.categories.troubleshooting.strengths.map((strength) => (
                            <li key={strength} className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="border rounded-md p-4">
                        <h4 className="font-medium mb-2">Areas for Improvement</h4>
                        <ul className="space-y-2">
                          {mockResults.categories.troubleshooting.improvements.map((improvement) => (
                            <li key={improvement} className="flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                              <span>{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="border rounded-md p-4">
                      <h4 className="font-medium mb-3">Detailed Analysis</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Problem Identification</span>
                            <span className="font-medium">85%</span>
                          </div>
                          <Progress value={85} className="h-1.5" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Solution Implementation</span>
                            <span className="font-medium">80%</span>
                          </div>
                          <Progress value={80} className="h-1.5" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Time Efficiency</span>
                            <span className="font-medium">75%</span>
                          </div>
                          <Progress value={75} className="h-1.5" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Complex Issue Resolution</span>
                            <span className="font-medium">70%</span>
                          </div>
                          <Progress value={70} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between mt-6 pt-4 border-t">
                <Button variant="outline" asChild>
                  <Link href="/assessment">Try Another Assessment</Link>
                </Button>
                <Button asChild>
                  <Link href="/assessment/certificate">View Certificate</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
