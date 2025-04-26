"use client"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface TestQuestionProps {
  question: {
    id: string
    type: string
    text: string
    options?: string[]
    correctAnswer?: string
    correctAnswers?: string[]
    imageUrl?: string
  }
  index: number
  value: any
  onChange: (value: any) => void
}

export default function TestQuestion({ question, index, value, onChange }: TestQuestionProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex gap-2">
            <span className="font-medium text-gray-500">Q{index + 1}.</span>
            <h3 className="font-medium">{question.text}</h3>
          </div>

          {question.imageUrl && (
            <div className="my-4 border rounded-md overflow-hidden">
              <Image
                src={question.imageUrl || "/placeholder.svg"}
                alt="Question diagram"
                width={600}
                height={400}
                className="w-full object-contain"
              />
            </div>
          )}

          {question.type === "multiple-choice" && question.options && (
            <RadioGroup value={value} onValueChange={onChange} className="space-y-2">
              {question.options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                  <Label htmlFor={`${question.id}-${option}`} className="cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {question.type === "multiple-select" && question.options && (
            <div className="space-y-2">
              {question.options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${question.id}-${option}`}
                    checked={(value || []).includes(option)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onChange([...(value || []), option])
                      } else {
                        onChange((value || []).filter((item: string) => item !== option))
                      }
                    }}
                  />
                  <Label htmlFor={`${question.id}-${option}`} className="cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {question.type === "diagram" && (
            <div className="space-y-4">
              <div className="aspect-video bg-gray-100 flex items-center justify-center border rounded-md">
                <Image
                  src="/placeholder.svg?height=300&width=600"
                  width={600}
                  height={300}
                  alt="Diagram"
                  className="object-contain"
                />
              </div>
              <RadioGroup
                value={value.toString()}
                onValueChange={(val) => onChange(Number.parseInt(val))}
                className="grid grid-cols-2 gap-2"
              >
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="flex items-center space-x-2 border rounded-md p-2">
                    <RadioGroupItem value={num.toString()} id={`${question.id}-${num}`} />
                    <Label htmlFor={`${question.id}-${num}`} className="cursor-pointer">
                      Component {num}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
