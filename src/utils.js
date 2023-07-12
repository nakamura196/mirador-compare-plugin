import { getAnnotations } from 'mirador/dist/es/src/state/selectors/annotations';

function getRows(state) {
  const { windows } = state;
  const windowIdCanvasUriMap = {};
  Object.keys(windows).forEach((windowId) => {
    const canvasUri = windows[windowId].canvasId;
    windowIdCanvasUriMap[canvasUri] = windowId;
  });

  const annotations = getAnnotations(state);

  const ids = {};

  // Function to handle each item
  const handleItem = (item, canvasUri) => {
    const { value } = item.body;
    const id = value.split(' ')[0];
    const label = value.split(' ')[1];

    const cid = id.split('-')[1];

    if (!ids[cid]) {
      ids[cid] = {
        // label: value,
        labels: [],
        windows: [],
      };
    }

    const { target } = item;
    const [x, y, width, height] = target.split('#xywh=')[1].split(',');

    const boxToZoom = {
      x: Number(x),
      y: Number(y),
      width: Number(width),
      height: Number(height),
    };

    ids[cid].windows.push({
      canvasUri, windowId: windowIdCanvasUriMap[canvasUri], boxToZoom,
    });

    ids[cid].labels.push(label);
  };

  // Function to handle each annotation
  const handleAnnotation = (annotations_, canvasUri, annosUri) => {
    const { items } = annotations_[canvasUri][annosUri].json;
    items.forEach((item) => handleItem(item, canvasUri));
  };

  // Main processing
  Object.keys(annotations).forEach((canvasUri) => {
    Object.keys(annotations[canvasUri]).forEach((annosUri) => {
      handleAnnotation(annotations, canvasUri, annosUri);
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
