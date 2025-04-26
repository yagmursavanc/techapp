export const testData = {
  audio: {
    title: "Audio Systems",
    description: "Questions about audio equipment, signal processing, and sound reinforcement systems.",
    questions: [
      {
        id: "audio-1",
        type: "multiple-choice",
        text: "Which of the following is NOT a common balanced audio connector?",
        options: ["XLR", "TRS (1/4 inch)", "RCA", "Phoenix"],
        correctAnswer: "RCA",
        explanation:
          "RCA connectors are unbalanced audio connectors. XLR, TRS, and Phoenix connectors can all carry balanced audio signals.",
      },
      {
        id: "audio-2",
        type: "multiple-choice",
        text: "What is the standard microphone level signal?",
        options: ["-60 to -40 dBu", "-20 to -10 dBu", "+4 dBu", "+10 dBu"],
        correctAnswer: "-60 to -40 dBu",
        explanation:
          "Microphone level signals are typically very low, ranging from -60 to -40 dBu. Line level signals are much stronger, typically around +4 dBu (professional) or -10 dBu (consumer).",
      },
      {
        id: "audio-3",
        type: "multiple-select",
        text: "Which of the following are digital audio protocols? (Select all that apply)",
        options: ["Dante", "AES/EBU", "AVB", "DMX"],
        correctAnswers: ["Dante", "AES/EBU", "AVB"],
        explanation:
          "Dante, AES/EBU, and AVB are digital audio protocols. DMX is a digital control protocol primarily used for lighting control.",
      },
      {
        id: "audio-4",
        type: "multiple-choice",
        text: "What is the purpose of a compressor in an audio system?",
        options: [
          "To increase the overall volume of the audio signal",
          "To reduce the dynamic range of an audio signal",
          "To add harmonic distortion to the audio signal",
          "To filter out specific frequencies",
        ],
        correctAnswer: "To reduce the dynamic range of an audio signal",
        explanation:
          "A compressor reduces the dynamic range of an audio signal by attenuating the loudest parts while leaving quieter parts unchanged, making the overall volume more consistent.",
      },
      {
        id: "audio-5",
        type: "diagram",
        text: "In the diagram of a mixing console, which component is responsible for adjusting the input gain?",
        correctAnswer: 2,
        explanation:
          "The preamp/gain control (Component 2) adjusts the input gain of the signal before it enters the channel strip processing.",
      },
    ],
  },
  visual: {
    title: "Visual Systems",
    description: "Questions about displays, projectors, video signals, and image processing.",
    questions: [
      {
        id: "visual-1",
        type: "multiple-choice",
        text: "What is the native resolution of a Full HD display?",
        options: ["1280 × 720", "1920 × 1080", "2560 × 1440", "3840 × 2160"],
        correctAnswer: "1920 × 1080",
        explanation:
          "Full HD (FHD) has a resolution of 1920 × 1080 pixels. 1280 × 720 is HD, 2560 × 1440 is QHD, and 3840 × 2160 is 4K UHD.",
      },
      {
        id: "visual-2",
        type: "multiple-select",
        text: "Which of the following are digital video interfaces? (Select all that apply)",
        options: ["HDMI", "DisplayPort", "VGA", "SDI"],
        correctAnswers: ["HDMI", "DisplayPort", "SDI"],
        explanation: "HDMI, DisplayPort, and SDI are digital video interfaces. VGA is an analog video interface.",
      },
      {
        id: "visual-3",
        type: "multiple-choice",
        text: "What does ANSI Lumens measure in a projector?",
        options: ["Color accuracy", "Brightness", "Contrast ratio", "Resolution"],
        correctAnswer: "Brightness",
        explanation: "ANSI Lumens is a standardized measurement of a projector's brightness output.",
      },
      {
        id: "visual-4",
        type: "multiple-choice",
        text: "Which aspect ratio is commonly used for widescreen presentations?",
        options: ["4:3", "16:9", "21:9", "1:1"],
        correctAnswer: "16:9",
        explanation:
          "16:9 is the standard widescreen aspect ratio used in most modern displays, projectors, and presentation formats.",
      },
      {
        id: "visual-5",
        type: "diagram",
        text: "In the diagram of a projector setup, which component represents the throw distance?",
        correctAnswer: 3,
        explanation:
          "The throw distance (Component 3) is the distance between the projector lens and the screen surface.",
      },
    ],
  },
  signal: {
    title: "Signal Flow",
    description: "Questions about signal routing, conversion, and distribution in AV systems.",
    questions: [
      {
        id: "signal-1",
        type: "multiple-choice",
        text: "What device is used to convert HDMI signals to SDI?",
        options: ["Scaler", "Converter", "Splitter", "Matrix switcher"],
        correctAnswer: "Converter",
        explanation:
          "A converter is specifically designed to change one signal format to another, such as HDMI to SDI.",
      },
      {
        id: "signal-2",
        type: "multiple-select",
        text: "Which of the following can be used for AV signal distribution over IP networks? (Select all that apply)",
        options: ["NDI", "AVoIP", "HDBaseT", "SDVoE"],
        correctAnswers: ["NDI", "AVoIP", "SDVoE"],
        explanation:
          "NDI, AVoIP, and SDVoE are protocols for distributing AV signals over IP networks. HDBaseT is a point-to-point distribution technology that uses category cable but is not IP-based.",
      },
      {
        id: "signal-3",
        type: "multiple-choice",
        text: "What is the maximum distance for HDMI 2.0 without signal degradation using a standard passive cable?",
        options: ["5 meters", "10 meters", "25 meters", "50 meters"],
        correctAnswer: "10 meters",
        explanation:
          "Standard passive HDMI 2.0 cables can reliably carry signals up to approximately 10 meters before signal degradation becomes an issue.",
      },
      {
        id: "signal-4",
        type: "multiple-choice",
        text: "What device would you use to send one HDMI source to multiple displays simultaneously?",
        options: ["HDMI Switch", "HDMI Splitter", "HDMI Matrix", "HDMI Extender"],
        correctAnswer: "HDMI Splitter",
        explanation:
          "An HDMI splitter takes one input and distributes it to multiple outputs simultaneously. A switch selects one input from many, a matrix can route multiple inputs to multiple outputs, and an extender increases signal distance.",
      },
      {
        id: "signal-5",
        type: "diagram",
        text: "In the signal flow diagram, which component represents the distribution amplifier?",
        correctAnswer: 1,
        explanation:
          "The distribution amplifier (Component 1) takes a single input signal and distributes it to multiple outputs while maintaining signal integrity.",
      },
    ],
  },
  troubleshooting: {
    title: "Troubleshooting",
    description: "Questions about identifying and resolving common AV system issues.",
    questions: [
      {
        id: "troubleshooting-1",
        type: "multiple-choice",
        text: "A projector is displaying an image, but there's no audio from the connected speakers. What should you check first?",
        options: ["Projector lamp", "Audio source volume", "Projector resolution", "HDCP compliance"],
        correctAnswer: "Audio source volume",
        explanation:
          "When there's video but no audio, the first step is to check if the audio source volume is turned up and not muted, as this is the most common and simplest issue to resolve.",
      },
      {
        id: "troubleshooting-2",
        type: "multiple-select",
        text: "Which of the following could cause ground loop hum in an audio system? (Select all that apply)",
        options: [
          "Multiple devices plugged into different power circuits",
          "Unbalanced audio connections",
          "Wireless microphone interference",
          "Improper cable shielding",
        ],
        correctAnswers: [
          "Multiple devices plugged into different power circuits",
          "Unbalanced audio connections",
          "Improper cable shielding",
        ],
        explanation:
          "Ground loop hum can be caused by multiple devices on different power circuits creating different ground potentials, unbalanced connections that are susceptible to noise, and improper shielding that allows interference. Wireless microphone interference typically causes different types of noise, not ground loop hum.",
      },
      {
        id: "troubleshooting-3",
        type: "multiple-choice",
        text: "What is the most likely cause of a 'No Signal' message on a display when a laptop is connected?",
        options: [
          "The display is defective",
          "The laptop's external display setting is not enabled",
          "The resolution is too high",
          "The HDMI cable is too long",
        ],
        correctAnswer: "The laptop's external display setting is not enabled",
        explanation:
          "The most common cause of 'No Signal' when connecting a laptop is that the laptop is not set to output video to the external display. Most laptops require pressing a function key combination (e.g., Fn+F4) to enable external display output.",
      },
      {
        id: "troubleshooting-4",
        type: "multiple-choice",
        text: "During a presentation, the projected image suddenly turns blue. What is the most likely cause?",
        options: [
          "The projector is overheating",
          "The input source has been disconnected",
          "The projector lamp is failing",
          "The resolution has changed",
        ],
        correctAnswer: "The input source has been disconnected",
        explanation:
          "A blue screen typically indicates that the projector is receiving no input signal, most commonly because the source has been disconnected or turned off. Overheating usually triggers a shutdown, lamp failure typically causes dimming or color shifts, and resolution changes would cause scaling issues but not a blue screen.",
      },
      {
        id: "troubleshooting-5",
        type: "diagram",
        text: "In the troubleshooting flowchart, which component represents the first step in diagnosing audio issues?",
        correctAnswer: 4,
        explanation:
          "Component 4 represents checking the signal source, which is the first step in the audio troubleshooting flowchart. Always start troubleshooting at the source and work your way through the signal chain.",
      },
    ],
  },
}
