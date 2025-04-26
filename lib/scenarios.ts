export const scenarios = {
  concert: {
    title: "Concert Stage Setup",
    description: "Configure audio and lighting for a live rock concert with a 5-piece band.",
    tasks: [
      {
        id: "concert-task1",
        title: "Speaker Placement",
        description: "Position the main speakers and subwoofers for optimal coverage and minimal feedback.",
        criteria: [
          "Main speakers should be elevated and angled toward the audience",
          "Subwoofers should be positioned on the ground for maximum bass response",
          "Ensure even coverage across the venue",
        ],
      },
      {
        id: "concert-task2",
        title: "Mixing Console Setup",
        description: "Configure the mixing console with appropriate gain structure and EQ for a rock band.",
        criteria: [
          "Set appropriate gain levels for each input",
          "Configure monitor mixes for performers",
          "Apply basic EQ to improve clarity",
        ],
      },
      {
        id: "concert-task3",
        title: "Lighting Scene Programming",
        description: "Create dynamic lighting scenes for the performance including front wash and moving fixtures.",
        criteria: [
          "Program a front wash for visibility",
          "Create dynamic scenes for chorus sections",
          "Set up moving heads for special effects",
        ],
      },
      {
        id: "concert-task4",
        title: "Troubleshoot Audio Issues",
        description: "Identify and resolve common audio issues in a live concert environment.",
        criteria: ["Identify and eliminate feedback", "Resolve ground loop issues", "Fix uneven coverage problems"],
      },
    ],
  },
  corporate: {
    title: "Corporate Event Setup",
    description: "Configure AV equipment for a corporate presentation with multiple speakers and video content.",
    tasks: [
      {
        id: "corporate-task1",
        title: "Presentation System Setup",
        description: "Configure the projector, screen, and laptop connections for presentations.",
        criteria: [
          "Set appropriate resolution and aspect ratio",
          "Ensure proper signal routing",
          "Test all video sources",
        ],
      },
      {
        id: "corporate-task2",
        title: "Wireless Microphone Setup",
        description: "Configure wireless microphones for presenters with backup options.",
        criteria: [
          "Set appropriate gain levels",
          "Configure frequency coordination",
          "Test coverage throughout the presentation area",
        ],
      },
      {
        id: "corporate-task3",
        title: "Room Audio Configuration",
        description: "Configure room audio for speech intelligibility and even coverage.",
        criteria: [
          "Optimize EQ for speech clarity",
          "Set appropriate volume levels",
          "Eliminate potential feedback points",
        ],
      },
      {
        id: "corporate-task4",
        title: "Video Switching Setup",
        description: "Configure video switching between multiple sources including presentations and video playback.",
        criteria: [
          "Set up seamless transitions between sources",
          "Configure picture-in-picture if needed",
          "Test all switching scenarios",
        ],
      },
    ],
  },
  theater: {
    title: "Theater Production",
    description: "Configure audio and lighting for a theatrical performance with multiple scenes and actors.",
    tasks: [
      {
        id: "theater-task1",
        title: "Theatrical Lighting Design",
        description: "Create lighting scenes for different acts of the play with appropriate mood and focus.",
        criteria: [
          "Design appropriate color schemes for each scene",
          "Create focused areas for key moments",
          "Program smooth transitions between scenes",
        ],
      },
      {
        id: "theater-task2",
        title: "Wireless Microphone Plot",
        description: "Configure and test wireless microphones for actors with quick change requirements.",
        criteria: [
          "Set appropriate gain structure for each actor",
          "Create a mic plot for the production",
          "Test for interference and coverage issues",
        ],
      },
      {
        id: "theater-task3",
        title: "Sound Effects Setup",
        description: "Configure playback system for sound effects and music cues.",
        criteria: [
          "Set up reliable playback system",
          "Create appropriate volume levels for each cue",
          "Test triggering mechanism for all cues",
        ],
      },
      {
        id: "theater-task4",
        title: "Technical Rehearsal",
        description: "Run a technical rehearsal addressing issues as they arise.",
        criteria: [
          "Identify and resolve technical issues quickly",
          "Coordinate with stage management",
          "Document solutions for future performances",
        ],
      },
    ],
  },
}
