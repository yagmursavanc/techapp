'use client';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">AV Technician Skills Assessment</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Interactive 3D Assessment Platform</CardTitle>
              <CardDescription>
                Test your audio-visual technical skills in a realistic 3D concert environment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video rounded-md overflow-hidden bg-black">
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-white mb-2">3D Interactive Environment</h3>
                    <p className="text-gray-300">Configure and troubleshoot real AV equipment in a virtual space</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <h3 className="font-medium mb-2">Audio Systems</h3>
                  <p className="text-sm text-gray-600">
                    Set up speaker arrays, configure mixing consoles, and optimize sound for different venues.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <h3 className="font-medium mb-2">Lighting Rigs</h3>
                  <p className="text-sm text-gray-600">
                    Position lights, program scenes, and create dynamic lighting effects for performances.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <h3 className="font-medium mb-2">Troubleshooting</h3>
                  <p className="text-sm text-gray-600">
                    Identify and resolve common AV issues in real-time under pressure scenarios.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link href="/assessment">
                <Button size="lg" className="px-8">
                  Start Assessment
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Select a Scenario</h4>
                    <p className="text-sm text-gray-600">
                      Choose from concert setup, corporate event, or festival environments
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Complete Tasks</h4>
                    <p className="text-sm text-gray-600">
                      Follow instructions to set up, configure, and troubleshoot equipment
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Receive Feedback</h4>
                    <p className="text-sm text-gray-600">
                      Get real-time guidance and assessment of your technical decisions
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium">View Results</h4>
                    <p className="text-sm text-gray-600">See detailed performance metrics and areas for improvement</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills Assessed</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-green-100 p-1 mt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-600"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Speaker placement and configuration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-green-100 p-1 mt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-600"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Mixing console operation and signal routing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-green-100 p-1 mt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-600"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Lighting design and DMX programming</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-green-100 p-1 mt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-600"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Signal flow and troubleshooting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-green-100 p-1 mt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-600"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Equipment selection for different scenarios</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-green-100 p-1 mt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-600"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Safety protocols and best practices</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} AV Technician Assessment Platform. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
