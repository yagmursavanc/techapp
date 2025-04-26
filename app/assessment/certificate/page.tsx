'use client';
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Share2 } from "lucide-react"

export default function CertificatePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Certificate of Completion</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardContent className="p-0">
              <div className="relative border-8 border-gray-100 m-1 p-8 bg-white">
                <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-blue-600"></div>
                <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-blue-600"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-blue-600"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-blue-600"></div>

                <div className="text-center py-10 space-y-6">
                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                      <Image
                        src="/placeholder.svg?height=60&width=60"
                        width={60}
                        height={60}
                        alt="Certificate Logo"
                        className="rounded-full"
                      />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-serif mb-1">Certificate of Completion</h2>
                    <p className="text-gray-600">AV Technician Skills Assessment</p>
                  </div>

                  <div className="my-8">
                    <p className="text-lg text-gray-700">This certifies that</p>
                    <h3 className="text-3xl font-serif font-bold my-2">John Smith</h3>
                    <p className="text-lg text-gray-700">
                      has successfully completed the Audio-Visual Technician Skills Assessment with a score of{" "}
                      <span className="font-bold">78%</span>
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-12 px-12">
                    <div className="text-center">
                      <div className="border-t-2 border-gray-400 pt-2 w-40">
                        <p className="font-medium">Date</p>
                        <p className="text-sm text-gray-600">{new Date().toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="border-t-2 border-gray-400 pt-2 w-40">
                        <p className="font-medium">Certification ID</p>
                        <p className="text-sm text-gray-600">AV-2023-78945</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Certificate
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share Certificate
            </Button>
            <Button variant="outline" asChild>
              <Link href="/assessment/results">Back to Results</Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} AV Technician Assessment Platform. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
