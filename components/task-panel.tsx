import { Card } from "@/components/ui/card"
import { CheckCircle2, Circle, AlertCircle, Info } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function TaskPanel({ scenario, currentTaskIndex, completedTasks, feedback }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-medium mb-1">{scenario.title}</h2>
        <p className="text-sm text-gray-600">{scenario.description}</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Task Instructions</AlertTitle>
        <AlertDescription className="text-sm">
          Complete each task by positioning and configuring the equipment according to the requirements. Use the
          controls panel to adjust settings and the 3D environment to position items.
        </AlertDescription>
      </Alert>

      <div className="space-y-3">
        <h3 className="font-medium">Tasks</h3>
        {scenario.tasks.map((task, index) => {
          const isCompleted = completedTasks.includes(task.id)
          const isCurrent = index === currentTaskIndex

          return (
            <Card key={task.id} className={`p-3 ${isCurrent ? "border-blue-300 bg-blue-50" : ""}`}>
              <div className="flex gap-3">
                <div className="mt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className={`h-5 w-5 ${isCurrent ? "text-blue-500" : "text-gray-300"}`} />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-sm text-gray-600">{task.description}</p>

                  <Accordion type="single" collapsible className="mt-2">
                    <AccordionItem value="criteria" className="border-none">
                      <AccordionTrigger className="py-1 text-sm font-medium text-gray-700">
                        Success Criteria
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-1 text-sm">
                          {task.criteria.map((criterion, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                              <span>{criterion}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  {isCompleted && feedback[completedTasks.indexOf(task.id)] && (
                    <div className="mt-2 text-sm bg-gray-50 p-2 rounded-md">
                      {feedback[completedTasks.indexOf(task.id)]}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="pt-4 border-t">
        <p className="text-sm text-gray-600">
          Complete all tasks to finish the assessment. Your performance will be evaluated based on accuracy, efficiency,
          and adherence to best practices.
        </p>
      </div>
    </div>
  )
}
