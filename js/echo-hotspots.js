/**
 * Project ECHO — Consolidated subsystem hotspots
 * ==============================================
 *
 * Exactly four primary pins. Clicking a pin opens a subsystem card and
 * highlights every related component marker on the model.
 *
 * HOW TO MOVE PINS / HIGHLIGHTS
 * -----------------------------
 * Edit `position` / `normal` on each subsystem, or any entry in
 * `highlights[]`, then hard-refresh the page.
 *   x = left/right · y = up/down · z = forward/back (model meters)
 */
window.ECHO_HOTSPOTS = [
  {
    id: "imaging-system",
    title: "Imaging System",
    category: "Payload and Imaging",
    locationHint: "Downward-facing dual-camera assembly",
    summary:
      "A synchronized RGB and near-infrared imaging system designed to collect visible and 850 nm imagery for post-flight vegetation analysis.",
    components: [
      {
        type: "RGB camera",
        product: "Raspberry Pi Camera Module 3",
        quantity: 1,
        purpose:
          "Captures standard visible-light RGB imagery using the 12-megapixel Sony IMX708 sensor.",
      },
      {
        type: "Near-infrared camera",
        product: "Raspberry Pi Camera Module 3 NoIR",
        quantity: 1,
        purpose: "Captures near-infrared imagery without the standard IR-cut filter.",
      },
      {
        type: "Optical filter",
        product: "Commonlands CBP850-100C030 850 nm Bandpass Filter",
        quantity: 1,
        purpose:
          "Mounts over the NoIR camera to isolate the near-infrared imaging channel around 850 nm.",
      },
      {
        type: "Camera computer",
        product: "Raspberry Pi 5",
        quantity: 1,
        purpose:
          "Controls both cameras, coordinates image capture, and handles onboard imagery and metadata.",
      },
      {
        type: "Imaging-system voltage regulator",
        product: "Pololu D24V50F5 5V 5A Step-Down Regulator",
        quantity: 1,
        purpose:
          "Converts main battery voltage into a regulated 5 V supply for the Raspberry Pi 5 and imaging electronics.",
      },
    ],
    description:
      "The Project ECHO imaging system combines a standard Raspberry Pi Camera Module 3 with a Camera Module 3 NoIR fitted with a Commonlands 850 nm bandpass filter. A Raspberry Pi 5 controls both cameras and stores the collected imagery for later processing. The Pololu D24V50F5 regulator provides the imaging electronics with a dedicated regulated 5 V supply.",
    status: "Selected for initial testing",
    position: "0 -0.03 0",
    normal: "0 -1 0",
    accent: "cyan",
    highlights: [
      { id: "rgb-camera", label: "RGB camera", position: "0.012 -0.03 0", normal: "0 -1 0" },
      { id: "noir-camera", label: "NoIR camera", position: "-0.012 -0.03 0", normal: "0 -1 0" },
      { id: "bandpass-filter", label: "850 nm filter", position: "0.011 0 0.005", normal: "0 1 0" },
      { id: "pi5", label: "Raspberry Pi 5", position: "0.01 0.07 0.05", normal: "0 1 0" },
      { id: "imaging-regulator", label: "5V regulator", position: "0.03 0.05 0.03", normal: "0 1 0" },
    ],
  },
  {
    id: "batteries",
    title: "Batteries",
    category: "Energy Storage",
    locationHint: "Between the two battery packs near the aircraft center of mass",
    summary:
      "A dual-pack lithium-ion energy-storage system positioned near the aircraft center to balance endurance, current capability, and center of gravity.",
    components: [
      {
        type: "Main flight battery",
        product: "WREKD 5S2P 18V Samsung 50S 10,000mAh Li-Ion Battery Pack",
        quantity: 2,
        specifications: [
          "18 V nominal voltage per pack",
          "21 V maximum charge voltage per pack",
          "10 Ah capacity per pack",
          "180 Wh nominal energy per pack",
          "750 g mass per pack",
          "Samsung 50S cells",
        ],
        purpose:
          "Provides the electrical energy required by the propulsion, flight-control, communications, and imaging systems.",
      },
    ],
    description:
      "Project ECHO uses two WREKD 5S2P lithium-ion battery packs constructed with Samsung 50S cells. Each pack provides 180 Wh of nominal energy. The packs are positioned close to the aircraft center of mass to reduce balance changes and distribute battery mass across the central structure.",
    status: "Selected for initial testing",
    position: "0 0.09 0.02",
    normal: "0 1 0",
    accent: "green",
    highlights: [
      { id: "battery-pack-a", label: "Battery pack A", position: "0.11 0.09 0.02", normal: "0 1 0" },
      { id: "battery-pack-b", label: "Battery pack B", position: "-0.11 0.09 0.02", normal: "0 1 0" },
    ],
  },
  {
    id: "propulsion-system",
    title: "Propulsion System",
    category: "Propulsion",
    locationHint: "One representative motor and propeller assembly",
    summary:
      "Four matched motor, propeller, and ESC assemblies provide lift and control authority while supporting the aircraft’s endurance-focused design.",
    components: [
      {
        type: "Brushless motors",
        product: "SunnySky V4008 KV380",
        quantity: 4,
        purpose: "Converts electrical power into mechanical rotation for the four propellers.",
      },
      {
        type: "Propellers",
        product: "T-Motor MS1704-2PCS/PAIR",
        quantity: 4,
        purchaseQuantity: "2 pairs",
        specifications: [
          "17-inch diameter",
          "6.5-inch pitch",
          "Polymer and carbon-fiber construction",
        ],
        purpose: "Produces the rotor thrust required for hover, maneuvering, and climb.",
      },
      {
        type: "Electronic speed controllers",
        product: "Hobbywing XRotor 40A COB ESC — SKU 30901001",
        quantity: 4,
        specifications: [
          "40 A continuous rating",
          "60 A peak rating",
          "2–6S battery compatibility",
        ],
        purpose:
          "Controls the rotational speed of each SunnySky motor using commands from the flight controller.",
      },
    ],
    description:
      "The propulsion system consists of four SunnySky V4008 KV380 motors, four T-Motor MS1704 17 × 6.5-inch propellers, and four Hobbywing XRotor 40A ESCs. These components form four matched propulsion units distributed across the airframe.",
    status: "Selected for initial testing",
    position: "0.29 0.28 0.07",
    normal: "0 1 0",
    accent: "orange",
    highlights: [
      { id: "motor-1", label: "Motor 1", position: "0.275 0.268 0.06", normal: "0 1 0" },
      { id: "motor-2", label: "Motor 2", position: "-0.268 0.275 0.06", normal: "0 1 0" },
      { id: "motor-3", label: "Motor 3", position: "-0.275 -0.268 0.06", normal: "0 1 0" },
      { id: "motor-4", label: "Motor 4", position: "0.268 -0.275 0.06", normal: "0 1 0" },
      { id: "esc-1", label: "ESC 1", position: "0.16 0.15 0.04", normal: "0 1 0" },
      { id: "esc-2", label: "ESC 2", position: "-0.16 0.15 0.04", normal: "0 1 0" },
      { id: "esc-3", label: "ESC 3", position: "-0.16 -0.15 0.04", normal: "0 1 0" },
      { id: "esc-4", label: "ESC 4", position: "0.16 -0.15 0.04", normal: "0 1 0" },
    ],
  },
  {
    id: "flight-controller",
    title: "Flight Controller",
    category: "Flight Control, Navigation and Communications",
    locationHint: "Central avionics stack",
    summary:
      "The central avionics subsystem manages stabilization, motor commands, positioning, heading, altitude sensing, telemetry, and pilot communication.",
    components: [
      {
        type: "Flight controller",
        product: "Holybro Kakute H743-Wing",
        quantity: 1,
        purpose:
          "Runs the aircraft-control software, processes sensor inputs, commands the ESCs, manages failsafes, and records flight data.",
      },
      {
        type: "Barometer",
        product: "Bosch BMP280",
        quantity: 1,
        integration: "Integrated directly into the Holybro Kakute H743-Wing",
        purpose: "Provides barometric altitude information to the flight-control system.",
      },
      {
        type: "GNSS module",
        product: "Holybro Micro M10 GPS with Case",
        quantity: 1,
        purpose: "Provides aircraft position, groundspeed, and GNSS navigation data.",
      },
      {
        type: "Compass",
        product: "IST8310 or IST8308 Magnetometer Integrated in the Holybro Micro M10 GPS",
        quantity: 1,
        integration: "Contained inside the Holybro Micro M10 GPS assembly",
        purpose:
          "Provides aircraft heading information while remaining physically separated from high-current propulsion wiring.",
      },
      {
        type: "Airborne communications radio",
        product: "Ebyte E32-900T20D LoRa UART Module",
        quantity: 1,
        aircraftQuantity: 1,
        totalSystemQuantity: 2,
        purpose:
          "Provides the airborne endpoint for command or telemetry communication. The second module belongs to the ground-side system.",
      },
      {
        type: "Airborne communications antenna",
        product: "915 MHz SMA-K Whip Antenna",
        quantity: 1,
        aircraftQuantity: 1,
        totalSystemQuantity: 2,
        purpose:
          "Provides the external antenna connection for the airborne Ebyte radio. The second antenna belongs to the ground-side system.",
      },
    ],
    description:
      "The Holybro Kakute H743-Wing is the central flight-control computer. Its integrated BMP280 barometer provides altitude sensing, while the externally mounted Holybro Micro M10 supplies GNSS positioning and compass data. An Ebyte E32-900T20D radio and 915 MHz whip antenna provide the airborne communication link.",
    status: "Selected for initial testing",
    position: "0 0.02 0.04",
    normal: "0 1 0",
    accent: "purple",
    highlights: [
      { id: "kakute", label: "Kakute H743-Wing", position: "0 0.02 0.04", normal: "0 1 0" },
      { id: "gps", label: "Micro M10 GPS", position: "0 0.15 -0.1", normal: "0 1 0" },
      { id: "radio", label: "Ebyte radio", position: "0.07 0.06 0.04", normal: "0 1 0" },
      { id: "antenna", label: "915 MHz antenna", position: "0.012 0.08 0.1", normal: "0 1 0" },
    ],
  },
];
