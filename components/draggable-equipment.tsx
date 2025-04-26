"use client"

import { useState, useRef, useEffect } from "react"
import { useThree, useFrame } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { ArrowUp, ArrowDown, RotateCcw, RotateCw, Move, Check, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import * as THREE from "three"

// Enhanced draggable equipment component
export default function DraggableEquipment({
  id,
  type,
  position,
  rotation,
  label,
  isSelected,
  onSelect,
  onPositionChange,
  onRotationChange,
  validationRules = {},
}) {
  const { toast } = useToast()
  const [isDragging, setIsDragging] = useState(false)
  const [dragPlane, setDragPlane] = useState("xz") // Default to horizontal movement
  const [showControls, setShowControls] = useState(false)
  const [localPosition, setLocalPosition] = useState(position)
  const [localRotation, setLocalRotation] = useState(rotation || [0, 0, 0])
  const [isValid, setIsValid] = useState(true)
  const [validationMessage, setValidationMessage] = useState("")

  const meshRef = useRef()
  const { camera, raycaster, scene, gl } = useThree()

  // Update local state when props change
  useEffect(() => {
    setLocalPosition(position)
    setLocalRotation(rotation || [0, 0, 0])
  }, [position, rotation])

  // Validate position based on rules
  useEffect(() => {
    if (!validationRules) return

    let valid = true
    let message = ""

    // Check height constraints
    if (validationRules.minHeight !== undefined && localPosition[1] < validationRules.minHeight) {
      valid = false
      message = `${label} must be at least ${validationRules.minHeight}m from the ground`
    }

    // Check proximity to other objects
    if (validationRules.minDistanceFromObjects && valid) {
      // This would need actual implementation with scene objects
      // For demo purposes, we'll just simulate
      const tooClose = false // Replace with actual proximity check
      if (tooClose) {
        valid = false
        message = `${label} is too close to other equipment`
      }
    }

    // Check if in valid zone
    if (validationRules.validZones && valid) {
      const inValidZone = validationRules.validZones.some((zone) => {
        // Check if position is within zone boundaries
        // This is a simplified example
        return (
          localPosition[0] >= zone.min[0] &&
          localPosition[0] <= zone.max[0] &&
          localPosition[2] >= zone.min[1] &&
          localPosition[2] <= zone.max[1]
        )
      })

      if (!inValidZone) {
        valid = false
        message = `${label} must be placed in a valid zone`
      }
    }

    setIsValid(valid)
    setValidationMessage(message)
  }, [localPosition, validationRules, label])

  // Handle drag start
  const handlePointerDown = (e) => {
    if (isSelected) {
      e.stopPropagation()
      setIsDragging(true)
      gl.domElement.style.cursor = "grabbing"
    } else {
      onSelect(id)
    }
  }

  // Handle drag end
  const handlePointerUp = () => {
    if (isDragging) {
      setIsDragging(false)
      gl.domElement.style.cursor = "auto"

      // Notify parent of position change
      onPositionChange(id, localPosition)

      // Show validation feedback
      if (!isValid) {
        toast({
          title: "Invalid Position",
          description: validationMessage,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Position Updated",
          description: `${label} has been repositioned successfully.`,
        })
      }
    }
  }

  // Handle movement on drag
  useFrame(() => {
    if (isDragging && isSelected) {
      // Update position based on mouse/touch and camera
      raycaster.setFromCamera(gl.domElement.pointer, camera)

      // Create a plane for dragging based on the selected axis
      let planeNormal
      if (dragPlane === "xy") planeNormal = [0, 0, 1]
      else if (dragPlane === "yz") planeNormal = [1, 0, 0]
      else planeNormal = [0, 1, 0] // xz plane (horizontal)

      // Calculate intersection with the drag plane
      const plane = new THREE.Plane(new THREE.Vector3(planeNormal[0], planeNormal[1], planeNormal[2]), 0)

      const intersection = new THREE.Vector3()
      raycaster.ray.intersectPlane(plane, intersection)

      // Update position based on the drag plane
      const newPosition = [...localPosition]
      if (dragPlane === "xy") {
        newPosition[0] = intersection.x
        newPosition[1] = intersection.y
      } else if (dragPlane === "yz") {
        newPosition[1] = intersection.y
        newPosition[2] = intersection.z
      } else {
        newPosition[0] = intersection.x
        newPosition[2] = intersection.z
      }

      setLocalPosition(newPosition)
    }
  })

  // Handle precise position adjustments
  const adjustPosition = (axis, amount) => {
    const newPosition = [...localPosition]
    newPosition[axis] += amount
    setLocalPosition(newPosition)
    onPositionChange(id, newPosition)
  }

  // Handle rotation adjustments
  const adjustRotation = (axis, amount) => {
    const newRotation = [...localRotation]
    newRotation[axis] += amount
    setLocalRotation(newRotation)
    onRotationChange(id, newRotation)
  }

  // Get model based on equipment type
  const { geometry, material } = useModelPlaceholder(type)

  return (
    <group
      position={localPosition}
      rotation={localRotation}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(id)
      }}
    >
      {/* Equipment mesh */}
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {geometry}
        {material}
      </mesh>

      {/* Selection indicator */}
      {isSelected && (
        <>
          {/* Selection highlight */}
          <mesh position={[0, 1.5, 0]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color={isValid ? "#ffff00" : "#ff0000"} />
          </mesh>

          {/* Drag handles */}
          <Html position={[0, 2.5, 0]} center>
            <div className="flex flex-col items-center">
              <Badge
                variant={isSelected ? "default" : "outline"}
                className={`whitespace-nowrap mb-2 ${!isValid ? "bg-red-500" : ""}`}
              >
                {label}
              </Badge>

              {isSelected && (
                <Popover open={showControls} onOpenChange={setShowControls}>
                  <PopoverTrigger asChild>
                    <Button size="sm" variant="outline" className="bg-white">
                      <Move className="h-4 w-4 mr-1" /> Controls
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium">Position Controls</h4>

                      {/* Drag plane selector */}
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          size="sm"
                          variant={dragPlane === "xz" ? "default" : "outline"}
                          onClick={() => setDragPlane("xz")}
                        >
                          Horizontal
                        </Button>
                        <Button
                          size="sm"
                          variant={dragPlane === "xy" ? "default" : "outline"}
                          onClick={() => setDragPlane("xy")}
                        >
                          Vertical
                        </Button>
                        <Button
                          size="sm"
                          variant={dragPlane === "yz" ? "default" : "outline"}
                          onClick={() => setDragPlane("yz")}
                        >
                          Depth
                        </Button>
                      </div>

                      {/* Fine position controls */}
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <Label>X Position: {localPosition[0].toFixed(2)}</Label>
                            <div className="flex gap-1">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-6 w-6"
                                onClick={() => adjustPosition(0, -0.1)}
                              >
                                <ArrowDown className="h-3 w-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-6 w-6"
                                onClick={() => adjustPosition(0, 0.1)}
                              >
                                <ArrowUp className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <Slider
                            value={[localPosition[0]]}
                            min={-10}
                            max={10}
                            step={0.1}
                            onValueChange={(value) => {
                              const newPos = [...localPosition]
                              newPos[0] = value[0]
                              setLocalPosition(newPos)
                              onPositionChange(id, newPos)
                            }}
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <Label>Y Position: {localPosition[1].toFixed(2)}</Label>
                            <div className="flex gap-1">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-6 w-6"
                                onClick={() => adjustPosition(1, -0.1)}
                              >
                                <ArrowDown className="h-3 w-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-6 w-6"
                                onClick={() => adjustPosition(1, 0.1)}
                              >
                                <ArrowUp className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <Slider
                            value={[localPosition[1]]}
                            min={0}
                            max={10}
                            step={0.1}
                            onValueChange={(value) => {
                              const newPos = [...localPosition]
                              newPos[1] = value[0]
                              setLocalPosition(newPos)
                              onPositionChange(id, newPos)
                            }}
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <Label>Z Position: {localPosition[2].toFixed(2)}</Label>
                            <div className="flex gap-1">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-6 w-6"
                                onClick={() => adjustPosition(2, -0.1)}
                              >
                                <ArrowDown className="h-3 w-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-6 w-6"
                                onClick={() => adjustPosition(2, 0.1)}
                              >
                                <ArrowUp className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <Slider
                            value={[localPosition[2]]}
                            min={-10}
                            max={10}
                            step={0.1}
                            onValueChange={(value) => {
                              const newPos = [...localPosition]
                              newPos[2] = value[0]
                              setLocalPosition(newPos)
                              onPositionChange(id, newPos)
                            }}
                          />
                        </div>
                      </div>

                      {/* Rotation controls */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Rotation Controls</h4>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label className="text-xs">X Axis</Label>
                            <div className="flex gap-1 mt-1">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 flex-1"
                                onClick={() => adjustRotation(0, -0.1)}
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 flex-1"
                                onClick={() => adjustRotation(0, 0.1)}
                              >
                                <RotateCw className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs">Y Axis</Label>
                            <div className="flex gap-1 mt-1">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 flex-1"
                                onClick={() => adjustRotation(1, -0.1)}
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 flex-1"
                                onClick={() => adjustRotation(1, 0.1)}
                              >
                                <RotateCw className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs">Z Axis</Label>
                            <div className="flex gap-1 mt-1">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 flex-1"
                                onClick={() => adjustRotation(2, -0.1)}
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 flex-1"
                                onClick={() => adjustRotation(2, 0.1)}
                              >
                                <RotateCw className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Validation status */}
                      {!isValid && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-2 text-sm text-red-700">
                          <div className="flex items-center gap-2">
                            <X className="h-4 w-4" />
                            <span>{validationMessage}</span>
                          </div>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex justify-end gap-2 pt-2">
                        <Button size="sm" variant="outline" onClick={() => setShowControls(false)}>
                          Close
                        </Button>
                        <Button
                          size="sm"
                          disabled={!isValid}
                          onClick={() => {
                            setShowControls(false)
                            toast({
                              title: "Position Confirmed",
                              description: `${label} position has been confirmed.`,
                            })
                          }}
                        >
                          <Check className="h-4 w-4 mr-1" /> Confirm
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </Html>
        </>
      )}
    </group>
  )
}

// Mock function to load models - in a real app, you'd use actual models
function useModelPlaceholder(type) {
  // Return placeholder geometries based on equipment type
  switch (type) {
    case "speaker":
      return {
        geometry: <boxGeometry args={[1, 1.5, 0.8]} />,
        material: <meshStandardMaterial color="#333333" />,
      }
    case "subwoofer":
      return {
        geometry: <boxGeometry args={[1.2, 1.2, 1.2]} />,
        material: <meshStandardMaterial color="#222222" />,
      }
    case "light":
      return {
        geometry: <cylinderGeometry args={[0.3, 0.5, 0.8, 8]} />,
        material: <meshStandardMaterial color="#444444" metalness={0.8} roughness={0.2} />,
      }
    case "movingHead":
      return {
        geometry: (
          <group>
            <cylinderGeometry args={[0.3, 0.3, 0.6, 8]} />
            <boxGeometry args={[0.6, 0.3, 0.6]} />
          </group>
        ),
        material: <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.2} />,
      }
    case "console":
      return {
        geometry: <boxGeometry args={[2, 0.2, 1.2]} />,
        material: <meshStandardMaterial color="#111111" />,
      }
    default:
      return {
        geometry: <sphereGeometry args={[0.5]} />,
        material: <meshStandardMaterial color="#666666" />,
      }
  }
}
