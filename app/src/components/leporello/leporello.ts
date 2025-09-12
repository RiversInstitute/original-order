import OpenSeadragon from "openseadragon";
let viewer = OpenSeadragon({
  id: "leporello-viewer",
  prefixUrl: "/openseadragon/images/",
  tileSources: "/assets/leporello.dzi",
  overlays: [
    {
      id: "example-overlay",
      x: 0.0001,
      y: 0.0001,
      width: 0.0187,
      height: 0.0137,
      className: "overlay",
    },
  ],
  blendTime: 0.15,
  immediateRender: true,
  defaultZoomLevel: 20,
  // maxZoomLevel: 20,
  minZoomLevel: 20,
  panVertical: false,
  showNavigator: true,
  navigatorId: "leporello-navigator",
  showNavigationControl: false,
  gestureSettingsMouse: { clickToZoom: false },
  gestureSettingsTouch: { clickToZoom: false },
});

viewer.addHandler("open", function () {
  const tiledImage = viewer.world.getItemAt(0);
  const imageDimensions = tiledImage.getContentSize();
  const imageRect = new OpenSeadragon.Rect(
    0,
    -imageDimensions.y / 8,
    imageDimensions.x / 64,
    (imageDimensions.y * 5) / 4,
  );

  const viewportRect = tiledImage.imageToViewportRectangle(imageRect);
  viewer.viewport.fitBounds(viewportRect, true);
  viewer.viewport.zoomTo(20);
});

new OpenSeadragon.MouseTracker({
  element: "example-overlay",
  clickHandler: function (e) {
    // @ts-ignore
    location.href = e.originalTarget.href;
  },
});

viewer.addHandler("zoom", function ({ zoom }) {
  if (zoom > 21) {
    // @ts-ignore
    viewer.panVertical = true;
  } else {
    // @ts-ignore
    viewer.panVertical = false;
  }
});

// viewer.addHandler("canvas-scroll", (e) => {
//   console.log("scroll");
//   // Prevent OSD's default wheel handling
//   e.preventDefaultAction = true;

//   // Wheel delta (pixels). Works for mouse wheel and most trackpads.
//   const dx = e.originalEvent.deltaX || 0;
//   const dy = e.originalEvent.deltaY || 0;

//   // Tune this factor for your device feel
//   const SPEED = 2;

//   // Convert screen pixels → viewport units and pan
//   const deltaVp = viewer.viewport.deltaPointsFromPixels(
//     new OpenSeadragon.Point(dx * SPEED, 0),
//     true,
//   );
//   viewer.viewport.panBy(deltaVp);
//   viewer.viewport.applyConstraints();
// });