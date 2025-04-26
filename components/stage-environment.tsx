"use client"

import { useState, useEffect, useRef } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  Html,
  Sphere,
  Box,
  Cylinder,
  TransformControls,
  useBounds,
} from "@react-three/drei"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Vector3, Euler } from "three"
import { useToast } from "@/components/ui/use-toast"

// Mock function to load models - in a real app, you'd use actual models
const useModelPlaceholder = (type) => {
  // Return placeholder geometries based on equipment type
  switch (type) {
    case "speaker":
      return {
        geometry: <Box args={[1, 1.5, 0.8]} />,
        material: <meshStandardMaterial color="#333333" />,
      }
    case "subwoofer":
      return {
        geometry: <Box args={[1.2, 1.2, 1.2]} />,
        material: <meshStandardMaterial color="#222222" />,
      }
    case "light":
      return {
        geometry: <Cylinder args={[0.3, 0.5, 0.8, 8]} />,
        material: <meshStandardMaterial color="#444444" metalness={0.8} roughness={0.2} />,
      }
    case "movingHead":
      return {
        geometry: (
          <group>
            <Cylinder args={[0.3, 0.3, 0.6, 8]} position={[0, 0.3, 0]} />
            <Box args={[0.6, 0.3, 0.6]} position={[0, 0.75, 0]} />
          </group>
        ),
        material: <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.2} />,
      }
    case "console":
      return {
        geometry: <Box args={[2, 0.2, 1.2]} />,
        material: <meshStandardMaterial color="#111111" />,
      }
    default:
      return {
        geometry: <Sphere args={[0.5]} />,
        material: <meshStandardMaterial color="#666666" />,
      }
  }
}

// Selection boundary helper
function SelectionBounds({ children }) {
  const api = useBounds()
  useEffect(() => {
    api.refresh().clip().fit()
  }, [])
  return children
}

// Equipment component
const Equipment = ({
  id,
  type,
  position,
  rotation,
  isInteractive,
  isSelected,
  onClick,
  onPositionChange,
  onRotationChange,
  label,
  validationZones,
  isBeingDragged = false,
}) => {
  const { geometry, material } = useModelPlaceholder(type)
  const meshRef = useRef()
  const initialPosition = useRef(new Vector3(...position))
  const initialRotation = useRef(new Euler(...(rotation || [0, 0, 0])))
  const toast = useToast()

  // Check if equipment is in a valid position
  const checkValidPosition = (newPosition) => {
    if (!validationZones || !validationZones.length) return true

    // Check if the position is within any valid zone
    for (const zone of validationZones) {
      if (
        newPosition.x >= zone.min.x &&
        newPosition.x <= zone.max.x &&
        newPosition.y >= zone.min.y &&
        newPosition.y <= zone.max.y &&
        newPosition.z >= zone.min.z &&
        newPosition.z <= zone.max.z
      ) {
        return true
      }
    }

    return false
  }

  // Handle position change from transform controls
  const handleTransformChange = () => {
    if (meshRef.current) {
      const newPosition = meshRef.current.position.toArray()
      const newRotation = meshRef.current.rotation.toArray()

      // Check if the new position is valid
      const isValid = checkValidPosition(meshRef.current.position)

      if (isValid) {
        onPositionChange && onPositionChange(id, newPosition)
        onRotationChange && onRotationChange(id, newRotation)
      } else {
        // Reset to last valid position
        meshRef.current.position.copy(initialPosition.current)
        toast({
          title: "Invalid Position",
          description: `${label || type} cannot be placed in this area.`,
          variant: "destructive",
        })
      }
    }
  }

  return (
    <group>
      <mesh
        ref={meshRef}
        position={position}
        rotation={rotation || [0, 0, 0]}
        onClick={isInteractive ? onClick : undefined}
        castShadow
        receiveShadow
      >
        {geometry}
        {material}
      </mesh>

      {isSelected && (
        <>
          <TransformControls object={meshRef} mode="translate" size={0.5} onObjectChange={handleTransformChange} />
          <Html position={[position[0], position[1] + 2, position[2]]} center>
            <Badge variant="default" className="whitespace-nowrap">
              {label || type}
            </Badge>
          </Html>
        </>
      )}

      {!isSelected && label && (
        <Html position={[position[0], position[1] + 1.5, position[2]]} center>
          <Badge
            variant={isBeingDragged ? "default" : "outline"}
            className={`whitespace-nowrap transition-all ${isBeingDragged ? "scale-110" : ""}`}
          >
            {label}
          </Badge>
        </Html>
      )}

      {/* Visual indicator for dragging state */}
      {isBeingDragged && (
        <mesh position={[position[0], position[1] - 0.6, position[2]]}>
          <cylinderGeometry args={[0.6, 0.6, 0.05, 32]} />
          <meshBasicMaterial color="#3b82f6" opacity={0.3} transparent />
        </mesh>
      )}
    </group>
  )
}

// Stage floor and structure
const StageStructure = ({ validZones = [] }) => {
  return (
    <group>
      {/* Stage floor */}
      <mesh receiveShadow position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 15]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

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

      {/* Visualize valid placement zones (for debugging) */}
      {validZones.map((zone, index) => (
        <mesh
          key={index}
          position={[(zone.min.x + zone.max.x) / 2, (zone.min.y + zone.max.y) / 2, (zone.min.z + zone.max.z) / 2]}
        >
          <boxGeometry args={[zone.max.x - zone.min.x, zone.max.y - zone.min.y, zone.max.z - zone.min.z]} />
          <meshBasicMaterial color="#00ff00" opacity={0.1} transparent wireframe />
        </mesh>
      ))}
    </group>
  )
}

// First-person camera controls
const FirstPersonControls = ({ isActive }) => {
  const { camera } = useThree()

  useEffect(() => {
    if (isActive) {
      // Set initial position for first-person view
      camera.position.set(0, 1.7, 5) // Eye level height
    }
  }, [isActive, camera])

  return isActive ? null : (
    <OrbitControls target={[0, 1, 0]} maxPolarAngle={Math.PI / 2} minDistance={2} maxDistance={20} />
  )
}

// Measurement tool component
const MeasurementTool = ({ startPoint, endPoint, isActive }) => {
  if (!isActive || !startPoint || !endPoint) return null

  const distance = Math.sqrt(
    Math.pow(endPoint[0] - startPoint[0], 2) +
      Math.pow(endPoint[1] - startPoint[1], 2) +
      Math.pow(endPoint[2] - startPoint[2], 2),
  ).toFixed(2)

  const midPoint = [
    (startPoint[0] + endPoint[0]) / 2,
    (startPoint[1] + endPoint[1]) / 2,
    (startPoint[2] + endPoint[2]) / 2,
  ]

  return (
    <group>
      {/* Line between points */}
      <line>
        <bufferGeometry attach="geometry">
          <float32BufferAttribute
            attach="attributes-position"
            count={2}
            array={Float32Array.from([...startPoint, ...endPoint])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="#ffff00" linewidth={2} />
      </line>

      {/* Distance label */}
      <Html position={midPoint} center>
        <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">{distance} m</div>
      </Html>

      {/* Point markers */}
      <mesh position={startPoint}>
        <sphereGeometry args={[0.1]} />
        <meshBasicMaterial color="#ffff00" />
      </mesh>
      <mesh position={endPoint}>
        <sphereGeometry args={[0.1]} />
        <meshBasicMaterial color="#ffff00" />
      </mesh>
    </group>
  )
}

// Main 3D scene component
const Scene = ({ scenario, currentTask, onTaskComplete }) => {
  const [selectedEquipment, setSelectedEquipment] = useState(null)
  const [equipmentPositions, setEquipmentPositions] = useState({})
  const [equipmentRotations, setEquipmentRotations] = useState({})
  const [taskState, setTaskState] = useState({
    completed: false,
    score: 0,
    feedback: "",
  })
  const [viewMode, setViewMode] = useState("orbit") // "orbit" or "firstPerson"
  const [draggedEquipment, setDraggedEquipment] = useState(null)
  const [measurementMode, setMeasurementMode] = useState({
    active: false,
    startPoint: null,
    endPoint: null,
  })
  const toast = useToast()

  // Valid placement zones for equipment
  const validPlacementZones = {
    speaker: [
      { min: { x: -10, y: 0, z: -7 }, max: { x: 10, y: 3, z: 7 } }, // Anywhere on stage
    ],
    light: [
      { min: { x: -9, y: 3.5, z: -6 }, max: { x: 9, y: 4.5, z: -4 } }, // Front truss
      { min: { x: -9, y: 3.5, z: -1 }, max: { x: 9, y: 4.5, z: 1 } }, // Back truss
    ],
    movingHead: [
      { min: { x: -9, y: 3.5, z: -6 }, max: { x: 9, y: 4.5, z: -4 } }, // Front truss
      { min: { x: -9, y: 3.5, z: -1 }, max: { x: 9, y: 4.5, z: 1 } }, // Back truss
    ],
    subwoofer: [
      { min: { x: -10, y: 0, z: -7 }, max: { x: 10, y: 0.5, z: 7 } }, // Floor only
    ],
    console: [
      { min: { x: -5, y: 0.5, z: 0 }, max: { x: 5, y: 1.5, z: 7 } }, // Front of stage
    ],
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
    }
  }, [scenario])

  // Handle equipment selection
  const handleEquipmentClick = (equipmentId) => {
    setSelectedEquipment(equipmentId === selectedEquipment ? null : equipmentId)

    // If we're in measurement mode and have a start point, set end point
    if (measurementMode.active) {
      const equipment = scenario.equipment.find((e) => e.id === equipmentId)
      if (equipment) {
        if (!measurementMode.startPoint) {
          setMeasurementMode({
            ...measurementMode,
            startPoint: equipmentPositions[equipmentId],
          })
          toast({
            title: "Measurement Started",
            description: `Starting point set at ${equipment.label || equipment.type}. Select another item to complete measurement.`,
          })
        } else {
          setMeasurementMode({
            ...measurementMode,
            endPoint: equipmentPositions[equipmentId],
          })
        }
      }
    }
  }

  // Handle position change
  const handlePositionChange = (id, newPosition) => {
    setEquipmentPositions((prev) => ({
      ...prev,
      [id]: newPosition,
    }))

    // Provide feedback on position change
    const equipment = scenario.equipment.find((e) => e.id === id)
    if (equipment) {
      toast({
        title: `${equipment.label || equipment.type} Moved`,
        description: `Position updated to X: ${newPosition[0].toFixed(2)}, Y: ${newPosition[1].toFixed(2)}, Z: ${newPosition[2].toFixed(2)}`,
      })
    }
  }

  // Handle rotation change
  const handleRotationChange = (id, newRotation) => {
    setEquipmentRotations((prev) => ({
      ...prev,
      [id]: newRotation,
    }))
  }

  // Toggle view mode between orbit and first-person
  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "orbit" ? "firstPerson" : "orbit"))
  }

  // Toggle measurement mode
  const toggleMeasurementMode = () => {
    setMeasurementMode({
      active: !measurementMode.active,
      startPoint: null,
      endPoint: null,
    })

    if (!measurementMode.active) {
      toast({
        title: "Measurement Mode Activated",
        description: "Select two objects to measure the distance between them.",
      })
    }
  }

  // Reset measurement
  const resetMeasurement = () => {
    setMeasurementMode({
      ...measurementMode,
      startPoint: null,
      endPoint: null,
    })
  }

  // Handle task completion
  const handleCompleteTask = () => {
    if (currentTask && !taskState.completed) {
      // Evaluate the equipment positions against the task requirements
      const evaluationResult = evaluateTaskCompletion(currentTask, equipmentPositions, equipmentRotations)

      setTaskState({
        completed: true,
        score: evaluationResult.score,
        feedback: evaluationResult.feedback,
      })

      onTaskComplete(currentTask.id, evaluationResult.score, evaluationResult.feedback)
    }
  }

  // Evaluate task completion based on equipment positions and rotations
  const evaluateTaskCompletion = (task, positions, rotations) => {
    // In a real app, this would have complex logic to evaluate the setup
    // For this demo, we'll simulate a score based on the current task

    // Check if speakers are properly positioned for the concert task
    if (task.id === "concert-task1") {
      let score = 0
      const feedbackPoints = []

      // Check main speakers height (should be elevated)
      const mainL = positions["speaker1"]
      const mainR = positions["speaker2"]

      if (mainL && mainR) {
        // Check if speakers are elevated
        if (mainL[1] > 0.5 && mainR[1] > 0.5) {
          score += 30
          feedbackPoints.push("Main speakers are properly elevated.")
        } else {
          feedbackPoints.push("Main speakers should be elevated for better coverage.")
        }

        // Check if speakers are angled toward audience
        const mainLRotation = rotations["speaker1"]
        const mainRRotation = rotations["speaker2"]

        if (mainLRotation && mainLRotation[1] > 0.1 && mainRRotation && mainRRotation[1] < -0.1) {
          score += 30
          feedbackPoints.push("Speakers are correctly angled toward the audience.")
        } else {
          feedbackPoints.push("Consider angling speakers toward the audience for better coverage.")
        }

        // Check subwoofer placement
        const subL = positions["sub1"]
        const subR = positions["sub2"]

        if (subL && subR && subL[1] < 0.3 && subR[1] < 0.3) {
          score += 40
          feedbackPoints.push("Subwoofers are correctly positioned on the ground.")
        } else {
          feedbackPoints.push("Subwoofers should be placed on the ground for maximum bass response.")
        }
      }

      return {
        score: Math.min(100, score),
        feedback: feedbackPoints.join(" "),
      }
    }

    // For other tasks, simulate a score
    const score = Math.floor(Math.random() * 30) + 70 // Random score between 70-100
    const feedback = `Task completed with a score of ${score}. ${
      score >= 90
        ? "Excellent work!"
        : score >= 80
          ? "Good job, with some minor improvements possible."
          : "Satisfactory, but there's room for improvement."
    }`

    return { score, feedback }
  }

  return (
    <>
      <Environment preset="warehouse" />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <StageStructure
        validZones={
          selectedEquipment
            ? validPlacementZones[scenario?.equipment.find((e) => e.id === selectedEquipment)?.type]
            : []
        }
      />

      {/* Equipment */}
      <SelectionBounds>
        {scenario?.equipment.map((item) => (
          <Equipment
            key={item.id}
            id={item.id}
            type={item.type}
            position={equipmentPositions[item.id] || item.position}
            rotation={equipmentRotations[item.id] || item.rotation || [0, 0, 0]}
            isInteractive={true}
            isSelected={selectedEquipment === item.id}
            onClick={() => handleEquipmentClick(item.id)}
            onPositionChange={handlePositionChange}
            onRotationChange={handleRotationChange}
            label={item.label}
            validationZones={validPlacementZones[item.type]}
            isBeingDragged={draggedEquipment === item.id}
          />
        ))}
      </SelectionBounds>

      {/* Measurement tool */}
      <MeasurementTool
        startPoint={measurementMode.startPoint}
        endPoint={measurementMode.endPoint}
        isActive={measurementMode.active}
      />

      {/* Task indicator */}
      {currentTask && (
        <Html position={[0, 6, 0]} center>
          <div className="bg-black bg-opacity-70 text-white p-2 rounded-md text-center">
            <div className="font-medium">{currentTask.title}</div>
            <div className="text-xs opacity-80">{taskState.completed ? "Completed" : "In Progress"}</div>
          </div>
        </Html>
      )}

      {/* Task completion button */}
      {currentTask && !taskState.completed && (
        <Html position={[0, 0, 5]} center>
          <Button onClick={handleCompleteTask}>Complete Task</Button>
        </Html>
      )}

      {/* View mode toggle */}
      <Html position={[-8, 6, 0]}>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleViewMode}
          className="bg-black bg-opacity-50 text-white border-gray-600"
        >
          {viewMode === "orbit" ? "First Person View" : "Orbit View"}
        </Button>
      </Html>

      {/* Measurement tools */}
      <Html position={[-8, 5, 0]}>
        <div className="space-y-2">
          <Button
            variant={measurementMode.active ? "default" : "outline"}
            size="sm"
            onClick={toggleMeasurementMode}
            className="bg-black bg-opacity-50 text-white border-gray-600 w-full"
          >
            {measurementMode.active ? "Exit Measurement" : "Measure Distance"}
          </Button>

          {measurementMode.active && measurementMode.startPoint && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetMeasurement}
              className="bg-black bg-opacity-50 text-white border-gray-600 w-full"
            >
              Reset Measurement
            </Button>
          )}
        </div>
      </Html>

      {/* Controls */}
      <FirstPersonControls isActive={viewMode === "firstPerson"} />
      {viewMode === "orbit" && (
        <OrbitControls target={[0, 1, 0]} maxPolarAngle={Math.PI / 2} minDistance={2} maxDistance={20} />
      )}
      <PerspectiveCamera makeDefault position={[0, 5, 10]} />
    </>
  )
}

// Main component
export default function StageEnvironment({ scenario, currentTask, onTaskComplete }) {
  return (
    <div className="w-full h-full">
      <Canvas shadows>
        <Suspense fallback={null}>
          <Scene scenario={scenarios[scenario]} currentTask={currentTask} onTaskComplete={onTaskComplete} />
        </Suspense>
      </Canvas>
    </div>
  )
}

// Mock scenario data
const scenarios = {
  concert: {
    title: "Concert Stage",
    equipment: [
      { id: "speaker1", type: "speaker", position: [-5, 1, -5], label: "Main L" },
      { id: "speaker2", type: "speaker", position: [5, 1, -5], label: "Main R" },
      { id: "sub1", type: "subwoofer", position: [-3, 0, -5], label: "Sub L" },
      { id: "sub2", type: "subwoofer", position: [3, 0, -5], label: "Sub R" },
      { id: "light1", type: "light", position: [-4, 4, -4], label: "Front Light L" },
      { id: "light2", type: "light", position: [4, 4, -4], label: "Front Light R" },
      { id: "movingHead1", type: "movingHead", position: [-2, 4, -5], label: "Moving Head 1" },
      { id: "movingHead2", type: "movingHead", position: [2, 4, -5], label: "Moving Head 2" },
      { id: "console", type: "console", position: [0, 1, 3], label: "Mixing Console" },
    ],
  },
  corporate: {
    title: "Corporate Event",
    equipment: [
      { id: "speaker1", type: "speaker", position: [-4, 1, -5], label: "Main L" },
      { id: "speaker2", type: "speaker", position: [4, 1, -5], label: "Main R" },
      { id: "light1", type: "light", position: [-3, 4, -4], label: "Podium Light" },
      { id: "light2", type: "light", position: [3, 4, -4], label: "Stage Light" },
      { id: "console", type: "console", position: [0, 1, 3], label: "Mixing Console" },
    ],
  },
}
