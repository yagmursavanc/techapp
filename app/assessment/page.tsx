'use client';
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import StageEnvironment from "@/components/stage-environment"
import TaskPanel from "@/components/task-panel"
import ControlPanel from "@/components/control-panel"
import { scenarios } from "@/lib/scenarios"
import { Timer, Maximize2, Minimize2, HelpCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function AssessmentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeScenario, setActiveScenario] = useState("concert")
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<string[]>([])
  const [isAssessmentComplete, setIsAssessmentComplete] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(30 * 60) // 30 minutes in seconds
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null)

  const currentScenario = scenarios[activeScenario]
  const currentTask = currentScenario.tasks[currentTaskIndex]
  const progress = Math.round((completedTasks.length / currentScenario.tasks.length) * 100)

  // Timer effect
  useEffect(() => {
    if (timeRemaining <= 0) {
      handleFinishAssessment()
      return
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1)
    }, 1000)

    // Show warning when 5 minutes left
    if (timeRemaining === 300) {
      toast({
        title: "Time Warning",
        description: "You have 5 minutes remaining to complete the assessment.",
        variant: "destructive",
      })
    }

    return () => clearInterval(timer)
  }, [timeRemaining])

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleTaskComplete = (taskId: string, taskScore: number, taskFeedback: string) => {
    if (!completedTasks.includes(taskId)) {
      setCompletedTasks([...completedTasks, taskId])
      setScore(score + taskScore)
      setFeedback([...feedback, taskFeedback])

      toast({
        title: "Task Completed",
        description: `You've completed "${currentScenario.tasks.find((t) => t.id === taskId)?.title}" with a score of ${taskScore}.`,
      })

      // Move to next task or complete assessment
      if (currentTaskIndex < currentScenario.tasks.length - 1) {
        setCurrentTaskIndex(currentTaskIndex + 1)
      } else {
        setIsAssessmentComplete(true)
      }
    }
  }

  const handleScenarioChange = (scenario: string) => {
    setActiveScenario(scenario)
    setCurrentTaskIndex(0)
    setCompletedTasks([])
    setScore(0)
    setFeedback([])
    setIsAssessmentComplete(false)
    setTimeRemaining(30 * 60) // Reset timer to 30 minutes

    toast({
      title: "Scenario Changed",
      description: `Switched to ${scenarios[scenario].title} scenario. Your progress has been reset.`,
    })
  }

  const handleFinishAssessment = () => {
    // In a real app, we would save the results to a database here
    router.push("/assessment/results")
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false)
        })
      }
    }
  }

  const handleEquipmentSelect = (equipmentId) => {
    setSelectedEquipment(equipmentId)

    if (equipmentId) {
      const equipment = currentScenario.equipment.find((e) => e.id === equipmentId)
      if (equipment) {
        toast({
          title: "Equipment Selected",
          description: `You've selected ${equipment.label || equipment.type}. Use the controls panel to adjust settings.`,
        })
      }
    }
  }

  const handleEquipmentUpdate = (type, control, value) => {
    // In a real app, this would update the 3D scene
    // For this demo, we'll just show a toast
    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Updated`,
      description: `${control}: ${value}`,
    })
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">AV Skills Assessment</h1>
          <div className="text-sm text-gray-400">Scenario: {currentScenario.title}</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-gray-400" />
            <span className={`font-mono ${timeRemaining < 300 ? "text-red-400 font-bold" : ""}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Progress:</span>
            <Progress value={progress} className="w-40 h-2" />
            <span className="text-sm">{progress}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Score:</span>
            <Badge variant="outline" className="text-yellow-400 border-yellow-400">
              {score} pts
            </Badge>
          </div>
          <Button variant="outline" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assessment Help</DialogTitle>
                <DialogDescription>How to interact with the 3D environment and complete tasks</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">3D Environment Controls</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Click and drag to rotate the view</li>
                    <li>• Scroll to zoom in/out</li>
                    <li>• Click on equipment to select it</li>
                    <li>• Use transform controls to move selected equipment</li>
                    <li>• Toggle between orbit and first-person views</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Equipment Controls</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Select equipment in the 3D view to adjust its settings</li>
                    <li>• Use the control panel to adjust audio, lighting, and routing</li>
                    <li>• Apply presets or create custom configurations</li>
                    <li>• Use the measurement tool to check distances</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Completing Tasks</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Read task requirements carefully</li>
                    <li>• Position equipment and adjust settings as needed</li>
                    <li>• Click "Complete Task" when you're satisfied with your setup</li>
                    <li>• Your solution will be evaluated against the success criteria</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* 3D Environment */}
        <div className="flex-1 relative">
          <StageEnvironment
            scenario={activeScenario}
            currentTask={currentTask}
            onTaskComplete={handleTaskComplete}
            onEquipmentSelect={handleEquipmentSelect}
          />

          {/* Overlay for completed assessment */}
          {isAssessmentComplete && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
              <Card className="w-96 p-6 text-center">
                <h2 className="text-xl font-bold mb-4">Assessment Complete!</h2>
                <p className="mb-4">You've completed all tasks in this scenario.</p>
                <p className="text-lg font-semibold mb-6">Final Score: {score} points</p>
                <Button onClick={handleFinishAssessment}>View Detailed Results</Button>
              </Card>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div className="w-full md:w-96 bg-gray-100 border-l flex flex-col">
          <Tabs defaultValue="tasks" className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-3 m-2">
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="controls">Controls</TabsTrigger>
              <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
            </TabsList>

            <TabsContent value="tasks" className="flex-1 p-4 overflow-auto">
              <TaskPanel
                scenario={currentScenario}
                currentTaskIndex={currentTaskIndex}
                completedTasks={completedTasks}
                feedback={feedback}
              />
            </TabsContent>

            <TabsContent value="controls" className="flex-1 p-4 overflow-auto">
              <ControlPanel
                scenario={activeScenario}
                currentTask={currentTask}
                selectedEquipment={selectedEquipment}
                onEquipmentUpdate={handleEquipmentUpdate}
              />
            </TabsContent>

            <TabsContent value="scenarios" className="flex-1 p-4 overflow-auto">
              <div className="space-y-4">
                <h3 className="font-medium">Select Scenario</h3>
                <div className="grid gap-2">
                  {Object.entries(scenarios).map(([id, scenario]) => (
                    <Button
                      key={id}
                      variant={activeScenario === id ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => handleScenarioChange(id)}
                    >
                      {scenario.title}
                    </Button>
                  ))}
                </div>
                <div className="pt-4 border-t mt-4">
                  <p className="text-sm text-gray-600 mb-2">Changing scenarios will reset your current progress.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
