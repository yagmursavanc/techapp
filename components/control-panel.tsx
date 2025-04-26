"use client"

import { Checkbox } from "@/components/ui/checkbox"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast"
import { Volume2, VolumeX, Mic, Lightbulb, Zap, Cable, Sliders, Save, Undo, RotateCcw } from "lucide-react"

export default function ControlPanel({ scenario, currentTask, selectedEquipment, onEquipmentUpdate }) {
  const [activeTab, setActiveTab] = useState("audio")
  const toast = useToast()

  // Mock control states
  const [audioControls, setAudioControls] = useState({
    mainVolume: 75,
    bassLevel: 60,
    midLevel: 50,
    trebleLevel: 65,
    monitorLevel: 70,
    phantom: true,
    mute: false,
    presets: [
      { name: "Default", id: "default" },
      { name: "Rock Band", id: "rock" },
      { name: "Speech", id: "speech" },
      { name: "Orchestra", id: "orchestra" },
    ],
    activePreset: "default",
    channels: [
      { id: 1, name: "Vocal", level: 70, pan: 0, mute: false, solo: false },
      { id: 2, name: "Guitar", level: 65, pan: -30, mute: false, solo: false },
      { id: 3, name: "Bass", level: 75, pan: 0, mute: false, solo: false },
      { id: 4, name: "Drums", level: 80, pan: 0, mute: false, solo: false },
    ],
  })

  const [lightingControls, setLightingControls] = useState({
    intensity: 80,
    color: "#ff5500",
    gobo: "none",
    mode: "static",
    strobe: 0,
    presets: [
      { name: "Stage Wash", id: "wash" },
      { name: "Concert", id: "concert" },
      { name: "Dramatic", id: "dramatic" },
      { name: "Corporate", id: "corporate" },
    ],
    activePreset: "wash",
    fixtures: [
      { id: "light1", name: "Front Light L", intensity: 80, color: "#ffffff", active: true },
      { id: "light2", name: "Front Light R", intensity: 80, color: "#ffffff", active: true },
      { id: "movingHead1", name: "Moving Head 1", intensity: 70, color: "#ff0000", active: true },
      { id: "movingHead2", name: "Moving Head 2", intensity: 70, color: "#0000ff", active: true },
    ],
  })

  const [routingControls, setRoutingControls] = useState({
    inputs: [
      { id: 1, name: "Mic 1", type: "XLR", routed: "Main L/R" },
      { id: 2, name: "Mic 2", type: "XLR", routed: "Main L/R" },
      { id: 3, name: "DI Box", type: '1/4"', routed: "Main L/R" },
      { id: 4, name: "Playback", type: "RCA", routed: "Monitors" },
    ],
    outputs: [
      { id: 1, name: "Main L", type: "XLR" },
      { id: 2, name: "Main R", type: "XLR" },
      { id: 3, name: "Monitor 1", type: "XLR" },
      { id: 4, name: "Monitor 2", type: "XLR" },
    ],
    patches: [
      { input: 1, output: [1, 2] },
      { input: 2, output: [1, 2] },
      { input: 3, output: [1, 2] },
      { input: 4, output: [3, 4] },
    ],
    dmxAddresses: [
      { id: "light1", address: 1, channels: 4 },
      { id: "light2", address: 5, channels: 4 },
      { id: "movingHead1", address: 9, channels: 16 },
      { id: "movingHead2", address: 25, channels: 16 },
    ],
  })

  // Update active tab based on selected equipment
  useEffect(() => {
    if (selectedEquipment) {
      const equipment = scenario?.equipment.find((e) => e.id === selectedEquipment)
      if (equipment) {
        switch (equipment.type) {
          case "speaker":
          case "subwoofer":
          case "console":
            setActiveTab("audio")
            break
          case "light":
          case "movingHead":
            setActiveTab("lighting")
            break
          default:
            break
        }
      }
    }
  }, [selectedEquipment, scenario])

  // Handle audio control changes
  const handleAudioChange = (control, value) => {
    setAudioControls({
      ...audioControls,
      [control]: value,
    })

    // Provide feedback
    toast({
      title: `Audio Setting Changed`,
      description: `${control} set to ${typeof value === "boolean" ? (value ? "On" : "Off") : value}`,
    })

    // In a real app, this would update the 3D scene
    onEquipmentUpdate && onEquipmentUpdate("audio", control, value)
  }

  // Handle channel changes
  const handleChannelChange = (channelId, property, value) => {
    setAudioControls({
      ...audioControls,
      channels: audioControls.channels.map((channel) =>
        channel.id === channelId ? { ...channel, [property]: value } : channel,
      ),
    })

    // In a real app, this would update the 3D scene
    onEquipmentUpdate && onEquipmentUpdate("channel", channelId, { [property]: value })
  }

  // Handle lighting control changes
  const handleLightingChange = (control, value) => {
    setLightingControls({
      ...lightingControls,
      [control]: value,
    })

    // Provide feedback
    toast({
      title: `Lighting Setting Changed`,
      description: `${control} set to ${value}`,
    })

    // In a real app, this would update the 3D scene
    onEquipmentUpdate && onEquipmentUpdate("lighting", control, value)
  }

  // Handle fixture changes
  const handleFixtureChange = (fixtureId, property, value) => {
    setLightingControls({
      ...lightingControls,
      fixtures: lightingControls.fixtures.map((fixture) =>
        fixture.id === fixtureId ? { ...fixture, [property]: value } : fixture,
      ),
    })

    // In a real app, this would update the 3D scene
    onEquipmentUpdate && onEquipmentUpdate("fixture", fixtureId, { [property]: value })
  }

  // Handle routing changes
  const handleRoutingChange = (type, id, property, value) => {
    if (type === "input") {
      setRoutingControls({
        ...routingControls,
        inputs: routingControls.inputs.map((input) => (input.id === id ? { ...input, [property]: value } : input)),
      })
    } else if (type === "patch") {
      setRoutingControls({
        ...routingControls,
        patches: routingControls.patches.map((patch) => (patch.input === id ? { ...patch, output: value } : patch)),
      })
    } else if (type === "dmx") {
      setRoutingControls({
        ...routingControls,
        dmxAddresses: routingControls.dmxAddresses.map((addr) => (addr.id === id ? { ...addr, address: value } : addr)),
      })
    }

    // Provide feedback
    toast({
      title: `Routing Updated`,
      description: `${type === "dmx" ? "DMX address" : type} configuration changed`,
    })
  }

  // Apply preset
  const applyPreset = (type, presetId) => {
    if (type === "audio") {
      // In a real app, this would load preset values
      switch (presetId) {
        case "rock":
          setAudioControls({
            ...audioControls,
            activePreset: presetId,
            bassLevel: 75,
            midLevel: 60,
            trebleLevel: 70,
          })
          break
        case "speech":
          setAudioControls({
            ...audioControls,
            activePreset: presetId,
            bassLevel: 50,
            midLevel: 80,
            trebleLevel: 65,
          })
          break
        default:
          setAudioControls({
            ...audioControls,
            activePreset: presetId,
            bassLevel: 60,
            midLevel: 50,
            trebleLevel: 65,
          })
      }
    } else if (type === "lighting") {
      // In a real app, this would load preset values
      switch (presetId) {
        case "concert":
          setLightingControls({
            ...lightingControls,
            activePreset: presetId,
            intensity: 90,
            mode: "dynamic",
          })
          break
        case "dramatic":
          setLightingControls({
            ...lightingControls,
            activePreset: presetId,
            intensity: 60,
            color: "#ff0066",
          })
          break
        default:
          setLightingControls({
            ...lightingControls,
            activePreset: presetId,
            intensity: 80,
            color: "#ffffff",
          })
      }
    }

    toast({
      title: `Preset Applied`,
      description: `${type === "audio" ? "Audio" : "Lighting"} preset applied successfully`,
    })
  }

  // Save current settings as preset
  const saveAsPreset = (type) => {
    toast({
      title: `Preset Saved`,
      description: `Current ${type} settings saved as a new preset`,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Equipment Controls</h3>
        {selectedEquipment && (
          <Badge variant="outline" className="text-xs">
            Controlling: {scenario?.equipment.find((e) => e.id === selectedEquipment)?.label || "None"}
          </Badge>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="audio" className="flex items-center gap-1">
            <Volume2 className="h-4 w-4" />
            <span>Audio</span>
          </TabsTrigger>
          <TabsTrigger value="lighting" className="flex items-center gap-1">
            <Lightbulb className="h-4 w-4" />
            <span>Lighting</span>
          </TabsTrigger>
          <TabsTrigger value="routing" className="flex items-center gap-1">
            <Cable className="h-4 w-4" />
            <span>Routing</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="audio" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Select value={audioControls.activePreset} onValueChange={(value) => applyPreset("audio", value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select preset" />
                </SelectTrigger>
                <SelectContent>
                  {audioControls.presets.map((preset) => (
                    <SelectItem key={preset.id} value={preset.id}>
                      {preset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={() => saveAsPreset("audio")}>
                <Save className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" title="Undo">
                <Undo className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" title="Reset">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="flex items-center gap-1">
                  <Volume2 className="h-4 w-4" /> Main Volume
                </Label>
                <span className="text-sm">{audioControls.mainVolume}%</span>
              </div>
              <Slider
                value={[audioControls.mainVolume]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => handleAudioChange("mainVolume", value[0])}
                className="cursor-grab active:cursor-grabbing"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Bass</Label>
                  <span className="text-sm">{audioControls.bassLevel}%</span>
                </div>
                <Slider
                  value={[audioControls.bassLevel]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleAudioChange("bassLevel", value[0])}
                  className="cursor-grab active:cursor-grabbing"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Mid</Label>
                  <span className="text-sm">{audioControls.midLevel}%</span>
                </div>
                <Slider
                  value={[audioControls.midLevel]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleAudioChange("midLevel", value[0])}
                  className="cursor-grab active:cursor-grabbing"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Treble</Label>
                  <span className="text-sm">{audioControls.trebleLevel}%</span>
                </div>
                <Slider
                  value={[audioControls.trebleLevel]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleAudioChange("trebleLevel", value[0])}
                  className="cursor-grab active:cursor-grabbing"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="phantom-power" className="flex items-center gap-1">
                <Zap className="h-4 w-4" /> Phantom Power
              </Label>
              <Switch
                id="phantom-power"
                checked={audioControls.phantom}
                onCheckedChange={(checked) => handleAudioChange("phantom", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="mute" className="flex items-center gap-1">
                <VolumeX className="h-4 w-4" /> Mute
              </Label>
              <Switch
                id="mute"
                checked={audioControls.mute}
                onCheckedChange={(checked) => handleAudioChange("mute", checked)}
              />
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3 flex items-center gap-1">
                <Mic className="h-4 w-4" /> Channel Mixer
              </h4>
              <div className="space-y-3">
                {audioControls.channels.map((channel) => (
                  <div key={channel.id} className="border rounded-md p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{channel.name}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant={channel.solo ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleChannelChange(channel.id, "solo", !channel.solo)}
                        >
                          Solo
                        </Button>
                        <Button
                          variant={channel.mute ? "destructive" : "outline"}
                          size="sm"
                          onClick={() => handleChannelChange(channel.id, "mute", !channel.mute)}
                        >
                          Mute
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Level</Label>
                        <span className="text-sm">{channel.level}%</span>
                      </div>
                      <Slider
                        value={[channel.level]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(value) => handleChannelChange(channel.id, "level", value[0])}
                        className="cursor-grab active:cursor-grabbing"
                      />
                    </div>
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between">
                        <Label>Pan</Label>
                        <span className="text-sm">
                          {channel.pan < 0 ? `${Math.abs(channel.pan)}L` : channel.pan > 0 ? `${channel.pan}R` : "C"}
                        </span>
                      </div>
                      <Slider
                        value={[channel.pan]}
                        min={-50}
                        max={50}
                        step={1}
                        onValueChange={(value) => handleChannelChange(channel.id, "pan", value[0])}
                        className="cursor-grab active:cursor-grabbing"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="lighting" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Select value={lightingControls.activePreset} onValueChange={(value) => applyPreset("lighting", value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select preset" />
                </SelectTrigger>
                <SelectContent>
                  {lightingControls.presets.map((preset) => (
                    <SelectItem key={preset.id} value={preset.id}>
                      {preset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={() => saveAsPreset("lighting")}>
                <Save className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" title="Undo">
                <Undo className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" title="Reset">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="flex items-center gap-1">
                  <Lightbulb className="h-4 w-4" /> Master Intensity
                </Label>
                <span className="text-sm">{lightingControls.intensity}%</span>
              </div>
              <Slider
                value={[lightingControls.intensity]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => handleLightingChange("intensity", value[0])}
                className="cursor-grab active:cursor-grabbing"
              />
            </div>

            <div className="space-y-2">
              <Label>Master Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={lightingControls.color}
                  onChange={(e) => handleLightingChange("color", e.target.value)}
                  className="w-10 h-10 rounded-md cursor-pointer"
                />
                <div className="grid grid-cols-5 gap-1 flex-1">
                  {[
                    "#ff0000",
                    "#00ff00",
                    "#0000ff",
                    "#ffff00",
                    "#ff00ff",
                    "#00ffff",
                    "#ffffff",
                    "#ff8800",
                    "#8800ff",
                    "#00ff88",
                  ].map((color) => (
                    <div
                      key={color}
                      className="w-full aspect-square rounded-sm cursor-pointer border"
                      style={{ backgroundColor: color }}
                      onClick={() => handleLightingChange("color", color)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Mode</Label>
              <Select value={lightingControls.mode} onValueChange={(value) => handleLightingChange("mode", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="static">Static</SelectItem>
                  <SelectItem value="pulse">Pulse</SelectItem>
                  <SelectItem value="strobe">Strobe</SelectItem>
                  <SelectItem value="rainbow">Rainbow</SelectItem>
                  <SelectItem value="dynamic">Dynamic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {lightingControls.mode === "strobe" && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Strobe Rate</Label>
                  <span className="text-sm">{lightingControls.strobe}Hz</span>
                </div>
                <Slider
                  value={[lightingControls.strobe]}
                  min={0}
                  max={10}
                  step={0.1}
                  onValueChange={(value) => handleLightingChange("strobe", value[0])}
                  className="cursor-grab active:cursor-grabbing"
                />
              </div>
            )}

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Individual Fixtures</h4>
              <div className="space-y-3">
                {lightingControls.fixtures.map((fixture) => (
                  <div key={fixture.id} className="border rounded-md p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{fixture.name}</span>
                      <Switch
                        checked={fixture.active}
                        onCheckedChange={(checked) => handleFixtureChange(fixture.id, "active", checked)}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Intensity</Label>
                        <span className="text-sm">{fixture.intensity}%</span>
                      </div>
                      <Slider
                        value={[fixture.intensity]}
                        min={0}
                        max={100}
                        step={1}
                        disabled={!fixture.active}
                        onValueChange={(value) => handleFixtureChange(fixture.id, "intensity", value[0])}
                        className="cursor-grab active:cursor-grabbing"
                      />
                    </div>
                    <div className="space-y-2 mt-2">
                      <Label>Color</Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={fixture.color}
                          onChange={(e) => handleFixtureChange(fixture.id, "color", e.target.value)}
                          disabled={!fixture.active}
                          className="w-8 h-8 rounded-md cursor-pointer"
                        />
                        <div className="grid grid-cols-4 gap-1 flex-1">
                          {["#ff0000", "#00ff00", "#0000ff", "#ffffff"].map((color) => (
                            <div
                              key={color}
                              className={`w-full aspect-square rounded-sm cursor-pointer border ${!fixture.active ? "opacity-50" : ""}`}
                              style={{ backgroundColor: color }}
                              onClick={() => fixture.active && handleFixtureChange(fixture.id, "color", color)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="routing" className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-1">
                <Cable className="h-4 w-4" /> Input Routing
              </h4>
              <div className="space-y-2">
                {routingControls.inputs.map((input) => (
                  <div key={input.id} className="flex items-center justify-between border rounded-md p-2">
                    <div>
                      <span className="font-medium">{input.name}</span>
                      <span className="text-xs text-gray-500 ml-2">({input.type})</span>
                    </div>
                    <Select
                      value={input.routed}
                      onValueChange={(value) => handleRoutingChange("input", input.id, "routed", value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Route to..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Main L/R">Main L/R</SelectItem>
                        <SelectItem value="Monitors">Monitors</SelectItem>
                        <SelectItem value="FX">FX</SelectItem>
                        <SelectItem value="None">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Output Patching</h4>
              <div className="space-y-2">
                {routingControls.patches.map((patch) => {
                  const input = routingControls.inputs.find((i) => i.id === patch.input)
                  return (
                    <div key={patch.input} className="flex items-center justify-between border rounded-md p-2">
                      <div>
                        <span className="font-medium">{input?.name || `Input ${patch.input}`}</span>
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm">
                            {patch.output
                              .map((o) => {
                                const output = routingControls.outputs.find((out) => out.id === o)
                                return output?.name || `Out ${o}`
                              })
                              .join(", ")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="grid grid-cols-2 gap-2">
                            {routingControls.outputs.map((output) => (
                              <div key={output.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`output-${output.id}`}
                                  checked={patch.output.includes(output.id)}
                                  onCheckedChange={(checked) => {
                                    const newOutputs = checked
                                      ? [...patch.output, output.id]
                                      : patch.output.filter((o) => o !== output.id)
                                    handleRoutingChange("patch", patch.input, "output", newOutputs)
                                  }}
                                />
                                <Label htmlFor={`output-${output.id}`}>
                                  {output.name} ({output.type})
                                </Label>
                              </div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-1">
                <Sliders className="h-4 w-4" /> DMX Addressing
              </h4>
              <div className="space-y-2">
                {routingControls.dmxAddresses.map((addr) => (
                  <div key={addr.id} className="flex items-center justify-between border rounded-md p-2">
                    <div>
                      <span className="font-medium">
                        {lightingControls.fixtures.find((f) => f.id === addr.id)?.name || addr.id}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">({addr.channels} ch)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        max="512"
                        value={addr.address}
                        onChange={(e) =>
                          handleRoutingChange("dmx", addr.id, "address", Number.parseInt(e.target.value))
                        }
                        className="w-16 text-center"
                      />
                      <span className="text-xs text-gray-500 w-16">
                        {addr.address} - {addr.address + addr.channels - 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="pt-4 border-t">
        <p className="text-sm text-gray-600">
          {currentTask ? (
            <>
              Adjust equipment settings to complete the current task:{" "}
              <span className="font-medium">{currentTask.title}</span>
            </>
          ) : (
            "Use these controls to adjust equipment settings for the selected items."
          )}
        </p>
      </div>
    </div>
  )
}
