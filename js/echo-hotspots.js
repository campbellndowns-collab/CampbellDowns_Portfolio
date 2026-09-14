/**
 * Project ECHO model-viewer hotspot data
 * --------------------------------------
 * Edit `position` / `normal` for each pin (model-space meters).
 * Positions below are provisional seeds from named SolidWorks GLB nodes —
 * tune them in the browser until each pin sits on the right feature.
 *
 * Format: position/normal are strings "x y z" for model-viewer attributes.
 */
window.ECHO_HOTSPOTS = [
  {
    id: "airframe",
    title: "Parametric Airframe",
    category: "Structures",
    filters: ["Structures"],
    component: null,
    description:
      "The airframe supports the propulsion, battery, avionics, and imaging systems while maintaining the required motor spacing and propeller clearance. Its geometry is being developed around structural stiffness, component packaging, center-of-mass placement, manufacturability, and minimum practical mass.",
    status: "Current CAD design",
    // Seed: TopCenterBracket / BottomCenterBracket
    position: "0 0.04 0",
    normal: "0 1 0",
    priority: "primary",
    accent: "blue",
  },
  {
    id: "motor",
    title: "Brushless Motor",
    category: "Propulsion",
    filters: ["Propulsion"],
    component: "SunnySky V4008-380",
    description:
      "The current propulsion configuration uses a SunnySky V4008-380 brushless motor. The motor was evaluated as part of an endurance-focused trade study considering hover efficiency, operating voltage, propeller compatibility, motor mass, thrust capability, and electrical loading.",
    status: "Current candidate configuration",
    // Seed: motor/prop station on one arm — adjust to the SunnySky motor body
    position: "0.007 -0.384 0.062",
    normal: "0 1 0",
    priority: "primary",
    accent: "orange",
  },
  {
    id: "propeller",
    title: "17 × 6.2 Propeller",
    category: "Propulsion",
    filters: ["Propulsion"],
    component: "17-inch diameter, 6.2-inch pitch propeller",
    description:
      "The current 17 × 6.2 propeller configuration was selected for evaluation with the SunnySky V4008-380 motor. Larger propellers can improve hover efficiency, but they also affect motor loading, airframe dimensions, structural loads, and propeller clearance.",
    status: "Current candidate configuration",
    // Seed: slightly above the same arm motor so the pin is distinct
    position: "0.007 -0.42 0.09",
    normal: "0 1 0",
    priority: "primary",
    accent: "orange",
  },
  {
    id: "esc",
    title: "Electronic Speed Controller",
    category: "Propulsion and Power",
    filters: ["Propulsion", "Power"],
    component: null,
    description:
      "Each motor is controlled by an electronic speed controller. The ESC must support the selected battery voltage and motor current while providing sufficient electrical and thermal margin. Final ESC selection remains dependent on propulsion testing and current validation.",
    status: "Selection in progress",
    // Seed: ESCHolders / Hobbywing envelope node
    position: "0.272 0.02 0.035",
    normal: "0 1 0",
    priority: "secondary",
    accent: "yellow",
  },
  {
    id: "battery",
    title: "4S Battery System",
    category: "Power",
    filters: ["Power"],
    component: "4S nominal electrical system",
    description:
      "The battery system supplies propulsion and avionics power. Battery capacity is being selected by balancing usable energy, battery mass, voltage sag, discharge capability, packaging, cost, and predicted endurance. The battery is positioned near the aircraft center to reduce center-of-gravity movement.",
    status: "Architecture selected; final pack selection in progress",
    // Seed: battery pack node
    position: "0 -0.05 0.08",
    normal: "0 1 0",
    priority: "primary",
    accent: "green",
  },
  {
    id: "flight-controller",
    title: "Flight Controller",
    category: "Avionics",
    filters: ["Avionics"],
    component: "Holybro Kakute H743-Wing",
    description:
      "The flight controller manages aircraft stabilization, sensor inputs, navigation data, motor commands, flight logging, and safety functions. Central placement reduces wiring complexity and helps isolate the inertial sensors from unnecessary vibration and electromagnetic interference.",
    status: "Current selected component",
    // Seed: ECHO_Holybro_Kakute_H743-Wing
    position: "0 0.02 0.04",
    normal: "0 1 0",
    priority: "primary",
    accent: "purple",
  },
  {
    id: "gps-compass",
    title: "GPS and Heading System",
    category: "Navigation",
    filters: ["Avionics"],
    component: "Holybro Micro M10 GPS",
    description:
      "The navigation system provides aircraft position and groundspeed data. A compatible external compass may also be used to provide heading information. Placement must reduce interference from motors, ESCs, batteries, and high-current wiring.",
    status: "Integration in progress",
    note: "Compass inclusion depends on the exact GPS module variant purchased.",
    // Seed: ECHO_Holybro_Micro_M10_GPS
    position: "0 0.08 -0.16",
    normal: "0 1 0",
    priority: "primary",
    accent: "purple",
  },
  {
    id: "imaging-system",
    title: "RGB + Near-Infrared Imaging System",
    category: "Imaging Payload",
    filters: ["Imaging"],
    component: null,
    description:
      "Downward-facing RGB and near-infrared cameras capture survey imagery for later analysis. Visible imagery provides context; near-infrared imagery supports vegetation-index work such as NDVI when paired and aligned in post-flight processing. Final camera and optical-filter selections are still in progress.",
    status: "Final camera and filter selection in progress",
    // Seed: RPi Camera Module 3 RGB / NoIR cluster
    position: "0 -0.04 -0.01",
    normal: "0 -1 0",
    priority: "primary",
    accent: "cyan",
  },
  {
    id: "rgb-camera",
    title: "RGB Imaging Camera",
    category: "Imaging Payload",
    filters: ["Imaging"],
    component: null,
    description:
      "The RGB camera captures conventional visible-light imagery of the survey area. These images provide visual context and may be aligned with near-infrared imagery during post-flight agricultural analysis.",
    status: "Final camera selection in progress",
    position: "0.015 -0.04 -0.01",
    normal: "0 -1 0",
    priority: "detail",
    accent: "cyan",
  },
  {
    id: "nir-camera",
    title: "Near-Infrared Camera",
    category: "Imaging Payload",
    filters: ["Imaging"],
    component: null,
    description:
      "The near-infrared imaging system captures wavelengths associated with vegetation reflectance. When paired and aligned with visible imagery, the data can support vegetation-index analysis such as NDVI.",
    status: "Final camera and filter selection in progress",
    note: "Exact spectral range is omitted until the selected sensor and optical filter are confirmed.",
    position: "-0.015 -0.04 -0.01",
    normal: "0 -1 0",
    priority: "detail",
    accent: "cyan",
  },
  {
    id: "camera-mount",
    title: "Imaging Payload Mount",
    category: "Mechanical Integration",
    filters: ["Structures", "Imaging"],
    component: null,
    description:
      "The imaging mount controls camera orientation, protects the sensors, and maintains alignment between the RGB and near-infrared cameras. Its design must also account for vibration, field of view, landing clearance, accessibility, and center-of-gravity effects.",
    status: "In development",
    position: "0 -0.055 0.02",
    normal: "0 -1 0",
    priority: "secondary",
    accent: "blue",
  },
  {
    id: "data-storage",
    title: "Onboard Data Storage",
    category: "Data System",
    filters: ["Imaging", "Avionics"],
    component: null,
    description:
      "Survey imagery is stored onboard during flight for later transfer and processing. The current system does not require live image streaming or onboard vegetation analysis, reducing communications and computing requirements during flight.",
    status: "Architecture defined; hardware selection in progress",
    // Seed: near central avionics / compute stack
    position: "0.01 0.05 0.05",
    normal: "0 1 0",
    priority: "secondary",
    accent: "cyan",
  },
  {
    id: "power-distribution",
    title: "Power Distribution",
    category: "Electrical",
    filters: ["Power"],
    component: null,
    description:
      "The power-distribution system routes battery power to the four propulsion systems and supplies regulated power to the avionics and imaging hardware. The design must account for current capacity, voltage regulation, connector losses, wiring mass, electrical noise, and serviceability.",
    status: "Electrical design in progress",
    position: "0.05 0.01 0.02",
    normal: "0 1 0",
    priority: "secondary",
    accent: "yellow",
  },
  {
    id: "communications",
    title: "Command and Telemetry",
    category: "Communications",
    filters: ["Communications"],
    component: null,
    description:
      "The communications system provides pilot command authority and may transmit basic aircraft telemetry. The antenna installation must maintain reliable signal reception while remaining protected from the propellers and landing environment.",
    status: "Hardware selection in progress",
    // Seed: Ebyte module / antenna envelope
    position: "0.07 0.02 0.05",
    normal: "0 1 0",
    priority: "secondary",
    accent: "purple",
  },
  {
    id: "landing-gear",
    title: "Landing Structure",
    category: "Structures",
    filters: ["Structures"],
    component: null,
    description:
      "The landing structure protects the airframe and downward-facing imaging payload during takeoff and landing. It must provide sufficient ground clearance and stability without adding unnecessary mass or obstructing the cameras’ field of view.",
    status: "In development",
    // Seed: CarbonTube landing members
    position: "-0.015 -0.38 0",
    normal: "0 0 1",
    priority: "secondary",
    accent: "blue",
  },
];

window.ECHO_HOTSPOT_FILTERS = [
  "Structures",
  "Propulsion",
  "Power",
  "Avionics",
  "Imaging",
  "Communications",
];
