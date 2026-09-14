/**
 * Project ECHO model-viewer hotspot data
 * ======================================
 *
 * HOW TO MOVE A PIN
 * -----------------
 * 1. Open this file: js/echo-hotspots.js
 * 2. Find the pin by `id` (for example "propulsion" or "batteries").
 * 3. Edit the `position` string: "x y z" in model-space meters.
 *    - First number  (x): left / right
 *    - Second number (y): up / down
 *    - Third number  (z): forward / back
 * 4. Optional: edit `normal` (which way the pin faces), usually "0 1 0".
 * 5. Save the file, hard-refresh the Project ECHO page (Ctrl/Cmd+Shift+R).
 * 6. Orbit the model and nudge again in small steps (0.01–0.05 at a time).
 *
 * Tips
 * ----
 * - Click a pin, then adjust its position until the camera focus looks right.
 * - If a pin disappears behind geometry, raise `y` slightly or flip `normal`.
 * - After editing, bump the ?v= hash on echo-hotspots.js in work/project-echo.html
 *   if your browser keeps serving a cached copy.
 *
 * priority:
 *   "primary"   → shown by default
 *   "secondary" → behind "Explore more components"
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
    position: "0 0.03 0",
    normal: "0 1 0",
    priority: "primary",
    accent: "blue",
  },
  {
    id: "propulsion",
    title: "Propulsion System",
    category: "Propulsion",
    filters: ["Propulsion"],
    component: "SunnySky V4008-380 with 17 × 6.2 propeller",
    description:
      "The current propulsion configuration pairs a SunnySky V4008-380 brushless motor with a 17 × 6.2 propeller. The combination was evaluated through endurance-focused trade studies covering hover efficiency, operating voltage, propeller compatibility, motor mass, thrust capability, electrical loading, airframe dimensions, structural loads, and propeller clearance.",
    status: "Current candidate configuration",
    // One representative arm tip (motor + propeller station)
    position: "0.29 0.28 0.07",
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
    position: "0.16 0.15 0.04",
    normal: "0 1 0",
    priority: "secondary",
    accent: "yellow",
  },
  {
    id: "batteries",
    title: "Batteries",
    category: "Power",
    filters: ["Power"],
    component: "4S nominal electrical system",
    description:
      "The battery system supplies propulsion and avionics power. Battery capacity is being selected by balancing usable energy, battery mass, voltage sag, discharge capability, packaging, cost, and predicted endurance. The packs are positioned near the aircraft center to reduce center-of-gravity movement.",
    status: "Architecture selected; final pack selection in progress",
    position: "0.11 0.09 0.02",
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
    position: "0 0.15 -0.1",
    normal: "0 1 0",
    priority: "primary",
    accent: "purple",
  },
  {
    id: "imaging-system",
    title: "Imaging System",
    category: "Imaging Payload",
    filters: ["Imaging"],
    component: null,
    description:
      "Downward-facing RGB and near-infrared cameras capture survey imagery for later analysis. Visible imagery provides context; near-infrared imagery supports vegetation-index work such as NDVI when paired and aligned in post-flight processing. Final camera and optical-filter selections are still in progress.",
    status: "Final camera and filter selection in progress",
    note: "Exact spectral range is omitted until the selected sensor and optical filter are confirmed.",
    position: "0 -0.03 0",
    normal: "0 -1 0",
    priority: "primary",
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
    position: "0 -0.045 0.02",
    normal: "0 -1 0",
    priority: "secondary",
    accent: "blue",
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
    position: "0.04 0.03 0.02",
    normal: "0 1 0",
    priority: "secondary",
    accent: "yellow",
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
    position: "-0.02 -0.35 0",
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
];
