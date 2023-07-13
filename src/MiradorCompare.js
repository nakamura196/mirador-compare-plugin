import React, { Component } from 'react';
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

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Draggable from 'react-draggable';
import Paper from '@material-ui/core/Paper';
import getRows from './utils';

// eslint-disable-next-line default-param-last
const compareReducer = (state = {}, action) => {
  if (action.type === 'OPEN_WINDOW_DIALOG') {
    return {
      ...state,
      isDialogOpen: 1,
    };
  }

  if (action.type === 'CLOSE_WINDOW_DIALOG') {
    return {
      ...state,
      isDialogOpen: 0,
    };
  }

  if (action.type === 'SET_SCROLL_TOP') {
    return {
      ...state,
      scrollTop: action.scrollTop,
    };
  }

  if (action.type === 'SET_XY') {
    return {
      ...state,
      xy: action.xy,
    };
  }

  return state;
};

function PaperComponent(props) {
  // eslint-disable-next-line react/prop-types
  const { x, y, handleStop } = props;
  return (
    <Draggable handle="#draggable-dialog-title" onStop={handleStop} position={{ x, y }}>
      <Paper {...props} />
    </Draggable>
  );
}

class CompareComponent extends Component {
  handleClose() {
    const { closeDialog, setScrollTop } = this.props;

    const element = document.getElementById('scrollComponent');
    const { scrollTop } = element;

    setScrollTop(scrollTop);
    closeDialog();
  }

  handleOpen() {
    const { openDialog } = this.props;
    openDialog();
  }

  handleStop = (event, ui) => {
    const { setXY } = this.props;
    const { x, y } = ui;
    setXY({ x, y });
  };

  compareItem(data, canvases) {
    const element = document.getElementById('scrollComponent');
    const { scrollTop } = element;

    const { compareDispatcher, setScrollTop } = this.props;
    data.forEach((item) => {
      const {
        windowId, boxToZoom, canvasUri,
      } = item;

      compareDispatcher(windowId, boxToZoom, canvasUri, canvases);
    });

    setScrollTop(scrollTop);
  }

  render() {
    // console.log('⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️');

    const state = this.props;

    const {
      xy, isDialogOpen, scrollTop, rows, canvases,
    } = state;

    const rowsObj = JSON.parse(rows);
    const canvasesObj = JSON.parse(canvases);

    // eslint-disable-next-line no-undef
    window.setTimeout(() => {
      const scrollComponent = document.getElementById('scrollComponent');
      if (scrollComponent) {
        scrollComponent.scrollTop = scrollTop;
      }
    }, 0.1);

    return (
      <>
        <MiradorMenuButton
          aria-haspopup="true"
          aria-label="List All Annotations"
          className="WithPlugins(WorkspaceControlPanelButtons)-ctrlBtn-12"
          onClick={(e) => this.handleOpen(e)}
        >
          <CommentIcon />
        </MiradorMenuButton>

        <Dialog
          disableEnforceFocus
          scroll="paper"
          fullWidth
          maxWidth="xs"
          open={isDialogOpen}
          style={{ height: '60vh' }}
          BackdropProps={{ style: { backgroundColor: 'transparent' } }}
          onClose={(event, reason) => {
            if (reason === 'backdropClick') {
              this.handleClose();
            }
          }}
          PaperComponent={PaperComponent}
          PaperProps={{ x: xy.x, y: xy.y, handleStop: this.handleStop }}
        >
          <>
            <DialogTitle style={{ cursor: 'move' }} disableTypography id="draggable-dialog-title">
              <Typography variant="h2">Annotations</Typography>
            </DialogTitle>
            <ScrollIndicatedDialogContent id="scrollComponent">

              <Table size="small" aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Size</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rowsObj.map((row) => (
                    <TableRow
                      hover
                      style={{ cursor: 'pointer' }}
                      onClick={() => this.compareItem(row.windows, canvasesObj)}
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
          </>
        </Dialog>
      </>
    );
  }
}

CompareComponent.propTypes = {
  xy: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  isDialogOpen: PropTypes.number,
  scrollTop: PropTypes.number,
  setScrollTop: PropTypes.func,
  compareDispatcher: PropTypes.func,
  openDialog: PropTypes.func,
  closeDialog: PropTypes.func,
  setXY: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  rows: PropTypes.arrayOf(PropTypes.any),
  canvases: PropTypes.arrayOf(PropTypes.string),
};

CompareComponent.defaultProps = {
  xy: { x: 0, y: 0 },
  scrollTop: 0,
  isDialogOpen: 0,
  setScrollTop: () => { },
  compareDispatcher: () => { },
  openDialog: () => { },
  closeDialog: () => { },
  setXY: () => { },
  rows: [],
  canvases: [],
};

const compareAction = (windowId, boxToZoom, canvasUri, canvases) => (dispatch) => {
  const action1 = mirador.actions.setCanvas(windowId, canvasUri);

  const zoomCenter = {
    x: boxToZoom.x + boxToZoom.width / 2,
    y: boxToZoom.y + boxToZoom.height / 2,
  };

  const action2 = mirador.actions.updateViewport(windowId, {
    x: zoomCenter.x,
    y: zoomCenter.y,
    zoom: 1 / boxToZoom.width,
  });

  if (canvases.indexOf(canvasUri) === -1) {
    dispatch(action1);
  } else {
    dispatch(action2);
  }
};

const mapStateToProps = (state) => {
  const canvases = [];
  const { windows } = state;
  Object.keys(windows).forEach((windowId) => {
    canvases.push(windows[windowId].canvasId);
  });
  return {
    canvases: JSON.stringify(canvases),
    rows: JSON.stringify(getRows(state)),
    scrollTop: state.compareReducer ? state.compareReducer.scrollTop : 0,
    xy: state.compareReducer ? state.compareReducer.xy : { x: 0, y: 0 },
    isDialogOpen: state.compareReducer ? state.compareReducer.isDialogOpen : 0,
  };
};

const mapDispatchToProps = (dispatch) => ({
  compareDispatcher: (windowId, boxToZoom, canvasUri, canvases) => {
    dispatch(compareAction(windowId, boxToZoom, canvasUri, canvases));
  },
  openDialog: () => dispatch({ type: 'OPEN_WINDOW_DIALOG' }),
  closeDialog: () => dispatch({ type: 'CLOSE_WINDOW_DIALOG' }),
  setScrollTop: (scrollTop) => dispatch({ type: 'SET_SCROLL_TOP', scrollTop }),
  setXY: (xy) => dispatch({ type: 'SET_XY', xy }),
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
