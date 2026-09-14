Project ECHO 3D model
=====================

File:
  project-echo.glb

Hotspot coordinates:
  Edit js/echo-hotspots.js — each entry has position/normal strings ("x y z").

  How to dial in a pin:
    1. Open js/echo-hotspots.js
    2. Find the pin by id
    3. Change position: "x y z" (meters in model space)
         x = left/right, y = up/down, z = forward/back
    4. Save and hard-refresh the page
    5. Nudge in small steps (0.01–0.05) until it sits on the part

Auto-rotate idle delay:
  Controlled in js/echo-viewer.js (AUTO_ROTATE_DELAY_MS) and the model-viewer
  auto-rotate-delay attribute in work/project-echo.html.
