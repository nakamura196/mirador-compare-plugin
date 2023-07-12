function getRows(state) {
  const { windows } = state;
  const windowIdCanvasUriMap = {};
  Object.keys(windows).forEach((windowId) => {
    const window = windows[windowId];
    const { manifestId } = window;
    windowIdCanvasUriMap[manifestId] = windowId;
  });

  const { manifests } = state;

  const canvases = {};

  Object.keys(manifests).forEach((manifestUri) => {
    const windowId = windowIdCanvasUriMap[manifestUri];
    const manifest = manifests[manifestUri];
    const { json } = manifest;
    json.items.forEach((item) => {
      const canvasUri = item.id;
      const annotationsOnCanvas = item.annotations;
      annotationsOnCanvas.forEach((annotation) => {
        const annotationsList = annotation.items;

        if (!canvases[windowId]) {
          canvases[windowId] = {};
        }

        canvases[windowId][canvasUri] = annotationsList; // .slice(0, 20);
      });
    });
  });

  const ids = {};

  Object.keys(canvases).forEach((windowId) => {
    Object.keys(canvases[windowId]).forEach((canvasUri) => {
      const annotationsOnCanvas = canvases[windowId][canvasUri];
      annotationsOnCanvas.forEach((annotation) => {
        const { body, cid, target } = annotation;
        const label = body.value;

        if (!ids[cid]) {
          ids[cid] = {
            labels: [],
            windows: [],
          };
        }

        const [x, y, width, height] = target.split('#xywh=')[1].split(',');

        const boxToZoom = {
          x: Number(x),
          y: Number(y),
          width: Number(width),
          height: Number(height),
        };

        // : windowIdCanvasUriMap[canvasUri]

        ids[cid].windows.push({
          canvasUri, windowId, boxToZoom,
        });

        ids[cid].labels.push(label);
      });
    });
  });

  const rows = [];

  Object.keys(ids).forEach((canvasUri) => {
    const item = ids[canvasUri];
    rows.push({
      id: canvasUri,
      labels: item.labels,
      windows: item.windows,
    });
  });

  return rows;
}

export default getRows;
