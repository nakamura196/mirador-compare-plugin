import React, { Component, useState } from 'react';
// import classNames from 'classnames';
import PropTypes from 'prop-types';
import MiradorMenuButton from 'mirador/dist/es/src/containers/MiradorMenuButton';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import ScrollIndicatedDialogContent from 'mirador/dist/es/src/containers/ScrollIndicatedDialogContent';
import mirador from 'mirador';
import CommentIcon from '@material-ui/icons/Comment';
import { getAnnotations } from 'mirador/dist/es/src/state/selectors/annotations';
import { getContainerId } from 'mirador/dist/es/src/state/selectors/config';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

// eslint-disable-next-line default-param-last
const compareReducer = (state = {}, action) => {
  if (action.type === 'OPEN_WINDOW_DIALOG') {
    return {
      ...state,
      windowListAnchor: action.target,
    };
  }

  if (action.type === 'CLOSE_WINDOW_DIALOG') {
    return {
      ...state,
      windowListAnchor: false,
    };
  }

  return state;
};

class CompareComponent extends Component {
  handleClose() {
    const { closeDialog } = this.props;
    closeDialog();
  }

  handleOpen(event) {
    const { openDialog } = this.props;

    const currentTarget = event ? event.currentTarget : null;
    openDialog(currentTarget);
  }

  compareItem(data) {
    const { compare } = this.props;
    data.forEach((item) => {
      const {
        windowId, boxToZoom,
      } = item;
      compare(windowId, boxToZoom);
    });
  }

  render() {
    const { state /* , classes */ } = this.props;
    const containerId = getContainerId(state);
    // const disabled = false;
    // const windowCount = 0;
    const windowListAnchor = state.compareReducer ? state.compareReducer.windowListAnchor : null;

    //

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

    /*

    className={
            classNames(classes.ctrlBtn, (open ? classes.ctrlBtnSelected : null))
          }
    */

    /*
    const open = false; // true;

    const classes = {
      ctrBtn: 'WithPlugins(WorkspaceControlPanelButtons)-ctrlBtn-12',
    };
    */

    // .join(', ')

    return (
      <>
        <MiradorMenuButton
          aria-haspopup="true"
          aria-label="List All Annotations"
          onClick={(e) => this.handleOpen(e)}
          className="WithPlugins(WorkspaceControlPanelButtons)-ctrlBtn-12"
        >
          <CommentIcon />

        </MiradorMenuButton>

        {Boolean(windowListAnchor) && (
          <Dialog
            container={document.querySelector(`#${containerId} .mirador-viewer`)}
            disableEnforceFocus
            scroll="paper"
            fullWidth
            maxWidth="xs"
            open
            style={{ height: '60vh' }}
          >
            <DialogTitle disableTypography>
              <Typography variant="h2">Annotations</Typography>
            </DialogTitle>
            <ScrollIndicatedDialogContent>

              <Table size="small" aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Size</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      hover
                      style={{ cursor: 'pointer' }}
                      onClick={() => this.compareItem(row.windows)}
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.labels.join(', ')}
                      </TableCell>
                      <TableCell align="right">{row.windows.length}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollIndicatedDialogContent>
            <DialogActions>
              <Button color="primary" onClick={() => this.handleClose()}>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </>
    );
  }
}

CompareComponent.propTypes = {
  compare: PropTypes.func,
  openDialog: PropTypes.func,
  closeDialog: PropTypes.func,
  // classes: PropTypes.objectOf(PropTypes.string).isRequired,
  // t: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  state: PropTypes.any.isRequired,
};

CompareComponent.defaultProps = {
  compare: () => { },
  openDialog: () => { },
  closeDialog: () => { },
  // t: () => {},
};

const compareAction = (windowId, boxToZoom) => (dispatch) => {
  const zoomCenter = {
    x: boxToZoom.x + boxToZoom.width / 2,
    y: boxToZoom.y + boxToZoom.height / 2,
  };

  dispatch(mirador.actions.updateViewport(windowId, {
    x: zoomCenter.x,
    y: zoomCenter.y,
    zoom: 1 / boxToZoom.width,
  }));
};

const mapStateToProps = (state) => ({
  state,
});

const mapDispatchToProps = (dispatch) => ({
  compare: (windowId, boxToZoom) => dispatch(compareAction(windowId, boxToZoom)),
  openDialog: (currentTarget) => dispatch({ type: 'OPEN_WINDOW_DIALOG', target: currentTarget }),
  closeDialog: () => dispatch({ type: 'CLOSE_WINDOW_DIALOG' }),
});

export default {
  target: 'WorkspaceControlPanelButtons',
  mode: 'add',
  component: CompareComponent,
  mapDispatchToProps,
  mapStateToProps,
  reducers: {
    compareReducer,
  },
};
