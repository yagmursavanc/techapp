"use client"

import { useState, useEffect, useRef } from "react"
import { Environment, Html, Grid, useHelper } from "@react-three/drei"
import { useToast } from "@/hooks/use-toast"
import DraggableEquipment from "@/components/draggable-equipment"
import * as THREE from "three"

// Stage floor and structure
const StageStructure = ({ showGrid = true, showMeasurements = true }) => {
  // Reference for directional light to show shadow helper
  const directionalLightRef = useRef()

  // Show helper for the directional light's shadow camera
  useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1, "red")

  return (
    <group>
      {/* Stage floor */}
      <mesh receiveShadow position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 15]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      {/* Optional grid for measurements */}
      {showGrid && (
        <Grid
          infiniteGrid
          cellSize={1}
          cellThickness={0.5}
          cellColor="#6f6f6f"
          sectionSize={3}
          sectionThickness={1}
          sectionColor="#9d4b4b"
          fadeDistance={30}
          fadeStrength={1.5}
          position={[0, 0.01, 0]}
        />
      )}

      {/* Back wall */}
      <mesh receiveShadow position={[0, 2, -7]}>
        <boxGeometry args={[20, 4, 0.2]} />
        <meshStandardMaterial color="#111111" />
      </mesh>

      {/* Truss structure */}
      <mesh position={[0, 4, -5]}>
        <boxGeometry args={[18, 0.2, 0.2]} />
        <meshStandardMaterial color="#555555" metalness={0.8} />
      </mesh>
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[18, 0.2, 0.2]} />
        <meshStandardMaterial color="#555555" metalness={0.8} />
      </mesh>
      <mesh position={[-9, 2, -2.5]}>
        <boxGeometry args={[0.2, 4, 0.2]} />
        <meshStandardMaterial color="#555555" metalness={0.8} />
      </mesh>
      <mesh position={[9, 2, -2.5]}>
        <boxGeometry args={[0.2, 4, 0.2]} />
        <meshStandardMaterial color="#555555" metalness={0.8} />
      </mesh>

      {/* Measurements */}
      {showMeasurements && (
        <>
          {/* Width measurement */}
          <Html position={[0, 0.1, -7]} center>
            <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">20m wide</div>
          </Html>

          {/* Depth measurement */}
          <Html position={[10, 0.1, -3.5]} center>
            <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">15m deep</div>
          </Html>

          {/* Height measurement */}
          <Html position={[-9.5, 2, -2.5]} center>
            <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">4m high</div>
          </Html>
        </>
      )}

      {/* Main lighting */}
      <directionalLight
        ref={directionalLightRef}
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </group>
  )
}

// Main 3D scene component
const Scene = ({ scenario, currentTask, onTaskComplete, showHelpers = true }) => {
  const { toast } = useToast()
  const [selectedEquipment, setSelectedEquipment] = useState(null)
  const [equipmentPositions, setEquipmentPositions] = useState({})
  const [equipmentRotations, setEquipmentRotations] = useState({})
  const [taskState, setTaskState] = useState({
    completed: false,
    score: 0,
    feedback: "",
  })
  const [showHelpDialog, setShowHelpDialog] = useState(false)
  const [showGrid, setShowGrid] = useState(true)
  const [showMeasurements, setShowMeasurements] = useState(true)
  
  // Equipment validation rules
  const validationRules = {
    speaker: {
      minHeight: 0.5, // Speakers should be elevated
      minDistanceFromObjects: 1, // Keep speakers away from other objects
      validZones: [
        { min: [-10, -7], max: [10, 7] } // Valid placement zone
      ]
    },
    light: {
      minHeight: 3, // Lights should be high up
      validZones: [
        { min: [-9, -7], max: [9, 7] } // Valid placement zone
      ]
    }
  }

  // Initialize equipment positions based on scenario
  useEffect(() => {
    if (scenario) {
      const initialPositions = {}
      const initialRotations = {}
      scenario.equipment.forEach((item) => {
        initialPositions[item.id] = item.position
        initialRotations[item.id] = item.rotation || [0, 0, 0]
      })
      setEquipmentPositions(initialPositions)
      setEquipmentRotations(initialRotations)
      setSelectedEquipment(null)
      setTaskState({
        completed: false,
        score: 0,
        feedback: "",
      })
      
      // Show help dialog when scenario changes
      setShowHelpDialog(true)
    }
  }, [scenario])

  // Handle equipment selection
  const handleEquipmentSelect = (equipmentId) => {
    setSelectedEquipment(equipmentId === selectedEquipment ? null : equipmentId)
  }
  
  // Handle equipment position change
  const handlePositionChange = (equipmentId, newPosition) => {
    setEquipmentPositions(prev => ({
      ...prev,
      [equipmentId]: newPosition
    }))
  }
  
  // Handle equipment rotation change
  const handleRotationChange = (equipmentId, newRotation) => {
    setEquipmentRotations(prev => ({
      ...prev,
      [equipmentId]: newRotation
    }))
  }

  // Handle task completion
  const handleCompleteTask = () => {
    if (currentTask && !taskState.completed) {
      // Evaluate the user's setup against task requirements
      const evaluation = evaluateTaskCompletion(currentTask, equipmentPositions, equipmentRotations)
      
      setTaskState({
        completed: true,
        score: evaluation.score,
        feedback: evaluation.feedback
      })

      onTaskComplete(currentTask.id, evaluation.score, evaluation.feedback)
      
      // Show completion toast
      toast({
        title: "Task Completed",
        description: `You scored ${evaluation.score} points. ${evaluation.feedback}`,
        variant: evaluation.score >= 80 ? "default" : "destructive"
      })
    }
  }
  
  // Evaluate task completion based on equipment placement
  const evaluateTaskCompletion = (task, positions, rotations) => {
    // This would be a complex function in a real app
    // For this demo, we'll simulate an evaluation
    
    // Check if speakers are properly positioned for the task
    let score = 0
    let feedback = ""
    
    switch(task.id) {
      case "concert-task1": // Speaker Placement
        // Check if main speakers are elevated and angled correctly
        const mainLeftPos = positions["speaker1"] || [0, 0, 0]
        const mainRightPos = positions["speaker2"] || [0, 0, 0]
        const subLeftPos = positions["sub1"] || [0, 0, 0]
        const subRightPos = positions["sub2"] || [0, 0, 0]
        
        // Check speaker height
        const speakersElevated = mainLeftPos[1] > 0.5 && mainRightPos[1] > 0.5
        
        // Check subwoofer placement (should be on the ground)
        const subsOnGround = subLeftPos[1] < 0.5 && subRightPos[1] < 0.5
        
        // Check symmetry
        const symmetrical = Math.abs(Math.abs(mainLeftPos[0]) - Math.abs(mainRightPos[0])) < 0.5
        
        if (speakersElevated && subsOnGround && symmetrical) {
          score = 90
          feedback = "Excellent speaker placement! Good height and symmetrical positioning."
        } else if (speakersElevated || subsOnGround) {
          score = 75
          feedback = "Good attempt, but check the height of your speakers and position of subwoofers."
        } else {
          score = 60
          feedback = "Review speaker placement guidelines. Main speakers should be elevated, subs on the ground."
        }
        break
        
      case "concert-task2": // Mixing Console Setup
        // For demo purposes, just check if console is in a good position
        const consolePos = positions["console"] || [0, 0, 0]
        
        // Console should be centered and at a good distance from the stage
        const centered = Math.abs(consolePos[0]) < 1
        const goodDistance = consolePos[2] > 2 && consolePos[2] < 5
        
        if (centered && goodDistance) {
          score = 85
          feedback = "Good console placement for optimal mixing position."
        } else {
          score = 70
          feedback = "Consider placing the console more centrally and at a better distance from the stage."
        }
        break
        
      case "concert-task3": // Lighting Scene Programming
        // Check if lights are positioned well
        const frontLeftPos = positions["light1"] || [0, 0, 0]
        const frontRightPos = positions["light2"] || [0, 0, 0]
        const movingHead1Pos = positions["movingHead1"] || [0, 0, 0]
        const movingHead2Pos = positions["movingHead2"] || [0, 0, 0]
        
        // Check light height
        const lightsHigh = frontLeftPos[1] > 3 && frontRightPos[1] > 3
        
        // Check moving head positioning
        const movingHeadsWellPlaced = movingHead1Pos[1] > 3 && movingHead2Pos[1] > 3
        
        if (lightsHigh && movingHeadsWellPlaced) {
          score = 85
          feedback = "Good lighting setup with proper height and positioning."
        } else {
          score = 65
          feedback = "Lights should be mounted higher for better coverage and effect."
        }
        break
        
      default:
        score = 75
        feedback = "Task completed with standard performance."
    }
    
    return { score, feedback }
  }

  return (
    <>
      <Environment preset="warehouse" />
      <ambientLight intensity={0.5} />

      <StageStructure showGrid={showGrid} showMeasurements={showMeasurements} />

      {/* Equipment */}
      {scenario?.equipment.map((item) => (
        <DraggableEquipment
          key={item.id}
          id={item.id}
          type={item.type}
          position={equipmentPositions[item.id] || item.position}
          rotation={equipmentRotations[item.id] || item.rotation || [0, 0, 0]}
          label={item.label}
          isSelected={selectedEquipment === item.id}
          onSelect={handleEquipmentSelect}
          onPositionChange={handlePositionChange}
          onRotationChange={handleRotationChange}\
