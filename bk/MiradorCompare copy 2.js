import React, { Component /* , useState , useEffect */ } from 'react';
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
import { getContainerId } from 'mirador/dist/es/src/state/selectors/config';

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
  /*
  if (action.type === 'OPEN_WINDOW_DIALOG') {
    console.log('OPEN_WINDOW_DIALOG');
    console.log(action.target);
    return {
      ...state,
      windowListAnchor: action.target,
    };
  }
  */

  /*

  if (action.type === 'CLOSE_WINDOW_DIALOG') {
    return {
      ...state,
      windowListAnchor: false,
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
  */

  console.log(action.type);

  if (action.type === 'SET_COMPARE') {
    return {
      ...state,
      compare: action.compare,
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

  handleOpen(event) {
    console.log('handleOpen');
    const { openDialog } = this.props;

    const currentTarget = event ? event.currentTarget : null;
    console.log('currentTarget', currentTarget);
    openDialog(currentTarget);
  }

  handleStop = (event, ui) => {
    const { setXY } = this.props;
    const { x, y } = ui;
    setXY({ x, y });
  };

  compareItem(data) {
    const element = document.getElementById('scrollComponent');
    const { scrollTop } = element;

    const { compare, setScrollTop } = this.props;
    data.forEach((item) => {
      const {
        windowId, boxToZoom,
      } = item;
      compare(windowId, boxToZoom);
    });

    setScrollTop(scrollTop);
  }

  render() {
    console.log('render');
    const { state /* , classes */ } = this.props;

    const stateString = JSON.stringify(state, null, 2);
    console.log('stateString', stateString.length);

    // const containerId = getContainerId(state);
    // console.log('containerId', containerId);

    // const windowListAnchor = state.compareReducer ? state.compareReducer.windowListAnchor : null;
    // console.log({ windowListAnchor });

    /*
    console.log('state', state);
    // const disabled = false;
    // const windowCount = 0;

    const xy = state.compareReducer && state.compareReducer.xy
      ? state.compareReducer.xy : { x: 0, y: 0 };

    const rows = getRows(state); // []; // getRows(state);

    // eslint-disable-next-line no-undef
    window.setTimeout(() => {
      const scrollComponent = document.getElementById('scrollComponent');
      if (scrollComponent) {
        scrollComponent.scrollTop = state.compareReducer ? state.compareReducer.scrollTop : 0;
      }
    }, 0.1);

    console.log('render');
    */

    //     onClick={(e) => this.handleOpen(e)}

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

        {/*
          container={document.querySelector(`#${containerId} .mirador-viewer`)} */}

        <div>
          aaa
        </div>

      </>
    );
  }
}

CompareComponent.propTypes = {
  setScrollTop: PropTypes.func,
  compare: PropTypes.func,
  openDialog: PropTypes.func,
  closeDialog: PropTypes.func,
  // classes: PropTypes.objectOf(PropTypes.string).isRequired,
  // t: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  state: PropTypes.any.isRequired,
  setXY: PropTypes.func,
};

CompareComponent.defaultProps = {
  setScrollTop: () => { },
  compare: () => { },
  openDialog: () => { },
  closeDialog: () => { },
  setXY: () => { },
  // t: () => {},
};

const compareAction = (windowId, boxToZoom) => (dispatch) => {
  const zoomCenter = {
    x: boxToZoom.x + boxToZoom.width / 2,
    y: boxToZoom.y + boxToZoom.height / 2,
  };

  // console.log('zoomCenter', zoomCenter);

  dispatch(mirador.actions.updateViewport(windowId, {
    x: zoomCenter.x,
    y: zoomCenter.y,
    zoom: 1 / boxToZoom.width,
  }));

  /*
  */
};

const mapStateToProps = (state) => ({
  state,
});

const mapDispatchToProps = (dispatch) => ({
  compare: (windowId, boxToZoom) => dispatch(compareAction(windowId, boxToZoom)),
  openDialog: (currentTarget) => dispatch({ type: 'OPEN_WINDOW_DIALOG', target: currentTarget }),
  closeDialog: () => dispatch({ type: 'CLOSE_WINDOW_DIALOG' }),
  setScrollTop: (scrollTop) => dispatch({ type: 'SET_SCROLL_TOP', scrollTop }),
  setXY: (xy) => dispatch({ type: 'SET_XY', xy }),
});

export default {
  // target: 'WorkspaceControlPanelButtons',
  target: 'WindowTopBarPluginMenu',
  mode: 'add',
  component: CompareComponent,
  mapDispatchToProps,
  mapStateToProps,
  reducers: {
    compareReducer,
  },
};

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

/*
{Boolean(windowListAnchor) && (
          <Dialog
            disableEnforceFocus
            scroll="paper"
            fullWidth
            maxWidth="xs"
            open
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
            </>

          </Dialog>
        )}
        */
