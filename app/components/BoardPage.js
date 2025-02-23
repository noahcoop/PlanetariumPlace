import React from 'react';
import ReactDOM from 'react-dom';
import { useState } from 'react';

import { connect } from "react-redux";
import { setTile, setLocalTile, setBrushColor, getData, fetchTiles, fetchTileChanges, playChange, setBoardId, setActiveCountry} from "../actions/index";
import { bindActionCreators } from 'redux';

import { useInterval } from './hooks/useInterval';
import { useTimeout } from './hooks/useTimeout';

import Board from './Board';
import Globe from './Globe';
import PersistentDrawer from './PersistentDrawer';
import PersistentSearchDrawer from './PersistentSearchDrawer';
import PermanentDrawer from './PermanentDrawer';
import IconDrawer from './IconDrawer';
import TabBar from './TabBar';
import ButtonBar from './ButtonBar';
import VerticalColorPicker from './VerticalColorPicker';
import Overlay from './Overlay';
import { hexcolor2int } from '../utils/general';
import * as Time from '../utils/time';
import * as System from '../constants/system';
// import * as Board from '../modules/board';
// import useWindowDimensions from './useWindowDimensions';

import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Grid from '@material-ui/core/Grid';
/*
import GlobeIcon from '@material-ui/icons/Public';
import MapIcon from '@material-ui/icons/Map';
import ViewIcon from '@material-ui/icons/History'; // Visibility, HourglassFullTwoTone, History
import ViewOffIcon from '@material-ui/icons/FastForward'; // VisibilityOff, HourglassEmpty, Update, FastForward
import AddIcon from '@material-ui/icons/Add';
*/

function mapDispatchToProps(dispatch) {
  return {
    //- getData: () => getData()(dispatch), //  cursed
    // getData: () => getData(dispatch),
    fetchTiles: () => fetchTiles()(dispatch),
    fetchTileChanges: (lastUpdated, boardId) => fetchTileChanges()(lastUpdated, boardId, dispatch),
    // fetchTileChanges: bindActionCreators(({x, y}, color) => setTile({x, y, color}), dispatch),
    // setTile: ({x, y}, color) => dispatch(setTile({x, y, color})),
    setTile: bindActionCreators(({x, y}, color) => setTile({x, y, color}), dispatch),
    setLocalTile: bindActionCreators((index, color) => setLocalTile({index, color}), dispatch),
    playChange: bindActionCreators((change) => playChange({change}), dispatch),
    setBoardId: bindActionCreators(setBoardId, dispatch),
    setActiveCountry: bindActionCreators(setActiveCountry, dispatch),
    // setBrushColor: (color) => dipatch(setBrushColor(color))
    // setBrushColor: bindActionCreators((color) => dipatch(setBrushColor(color)), dispatch) // no work
    // setBrushColor: bindActionCreators((color) => setBrushColor(color), dispatch) // works
    setBrushColor: bindActionCreators(setBrushColor, dispatch)
  };
}

const mapStateToProps = (state) => {
    return {
        boardId: state.boardId,
        // lastUpdated: state.board.lastUpdated,
        // unplayedChanges: state.board.unplayedChanges,
        // articles: state.articles,
        // remoteTiles: state.remoteTiles,
        tilesRgba: state.board.tilesRgba,
        tiles: state.board.tiles,
        map: state.board.map,
        values: state.board.values,
        width: state.board.width,
        // mouseDown: state.mouseDown,
        activeCountry: state.board.activeCountry,
        brushColor: state.brushColor
    };
};

// export default class BoardPage extends React.Component {
const BoardPage = (props) => {
        const style = { // may wanna move this elsewhere and delet the div
            position: "absolute",
            width: "100%",
            height: "100%",
            overflow: "hidden"
        };

        React.useEffect(() => {
            props.fetchTiles();
            // props.getData();
            // alert("doing something");
        }, [props.boardId]);
        // }, []);
        // console.log(props.remoteTiles);

        const TILE_UPDATE_FREQUENCY = System.TILE_UPDATE_FREQUENCY;
        const TILE_UPDATE_OFFSET = System.TILE_UPDATE_OFFSET;
        // setInterval(() => {
        useInterval(() => {
            console.log("updating async tiles...");
            const placeholderDate = new Date();
            props.fetchTileChanges(props.boardId, placeholderDate);
            // props.fetchTileChanges(props.boardId, props.lastUpdated);
            // props.fetchTileChanges(1, new Date());

            // play a bunch of actions after some time (the delay is stored in the payload)
            // this shit needs to get run after tile changes have been fetched
            /*
            console.log(props.unplayedChanges);
            while (!props.unplayedChanges.isEmpty()) {
                let change = props.unplayedChanges.dequeue();
                console.log(change);
                props.playChange(change);
            }
            */
        }, TILE_UPDATE_FREQUENCY);

        const onChangeComplete = (color) => {
            var brushColorInt = hexcolor2int(color);
            // alert("painting = " + brushColorInt);
            props.setBrushColor(brushColorInt);
        };

        const [viewFlashback, setViewFlashback] = React.useState(false);
        const [tool, setTool] = React.useState(0);

        // var tiles = [];
        const boardProps = {
            tilesRgba: props.tilesRgba,
            tiles: props.tiles,
            map: props.map,
            values: props.values,
            width: props.width,
            // mouseDown: props.mouseDown,
            brushColor: props.brushColor,
            activeCountry: props.activeCountry,
            viewFlashback: viewFlashback,

            setTile: props.setTile
        }

        const NUM_BOARD_IDS = 2;

        const [useGlobe, setUseGlobe] = React.useState(true);
        const boardViewer = (!useGlobe) ?
            <Board
                {...boardProps}
            /*{mouseDown={props.mouseDown}*/
            />
            :
            <Globe
                {...boardProps}
            />
        ;

        /*
        const globeFab = <Fab
            color="primary"
            aria-label="view"
            style={{
                margin: "7px"
            }}
            onClick={() => setUseGlobe(!useGlobe)}
         >
            <GlobeIcon />
        </Fab>;

        const flashbackFab = <Fab
            color="primary"
            aria-label="view"
            style={{
                margin: "7px"
            }}

            onClick={() => setViewFlashback(!viewFlashback)}
         >
            {(!viewFlashback) ? <ViewIcon /> : <ViewOffIcon />}
        </Fab>;
        */

        /*
        const globeFab = <ToggleButtonGroup
            orientation="vertical"
            color="primary"
            aria-label="view"
            style={{
                marginBottom: "0px"
            }}
         >
            <ToggleButton selected={useGlobe} onClick={() => setUseGlobe(true)}>
                <GlobeIcon />
            </ToggleButton>
            <ToggleButton selected={!useGlobe} onClick={() => setUseGlobe(false)}>
                <MapIcon />
            </ToggleButton>
        </ToggleButtonGroup>;

        const flashbackFab = <ToggleButtonGroup
            orientation="vertical"
            color="primary"
            aria-label="view"
            style={{
                marginBottom: "14px"
            }}
         >
            <ToggleButton selected={viewFlashback} onClick={() => setViewFlashback(true)}>
                <ViewIcon />
            </ToggleButton>
            <ToggleButton selected={!viewFlashback} onClick={() => setViewFlashback(false)}>
                <ViewOffIcon />
            </ToggleButton>
        </ToggleButtonGroup>;
        */
        /*
        const globeFab = <ToggleButtonGroup
            orientation="horizontal"
            color="primary"
            aria-label="view"
            style={{
                // marginBottom: "0px"
            }}
         >
            <ToggleButton selected={useGlobe} onClick={() => setUseGlobe(true)}>
                <GlobeIcon />
            </ToggleButton>
            <ToggleButton selected={!useGlobe} onClick={() => setUseGlobe(false)}>
                <MapIcon />
            </ToggleButton>
        </ToggleButtonGroup>;

        const flashbackFab = <ToggleButtonGroup
            orientation="horizontal"
            color="primary"
            aria-label="view"
            style={{
                // marginBottom: "14px"
            }}
         >
            <ToggleButton selected={viewFlashback} onClick={() => setViewFlashback(true)}>
                <ViewIcon />
            </ToggleButton>
            <ToggleButton selected={!viewFlashback} onClick={() => setViewFlashback(false)}>
                <ViewOffIcon />
            </ToggleButton>
        </ToggleButtonGroup>;
        */

        /*
        const boardIdFab = <Fab
            color="primary"
            aria-label="view"
            style={{
                margin: "7px"
            }}

            onClick={() => props.setBoardId(1 + (props.boardId % NUM_BOARD_IDS))}
         >
            <AddIcon />
        </Fab>;
        */
        // const { isLandscape } = useWindowDimensions();

        /*
        // set the spacing property?
        const fabView = (
            <Grid
              container
              direction="row"
              justify="flex-end"
              alignItems="flex-end"

              style={{
                  // position: 'absolute',
                  // bottom: "64px", // theme.spacing(2),
                  // right: "64px", // theme.spacing(2),
                  // height: "70px"
                  padding: 24,
                  gap: 24
              }}
            >
                <Grid item>
                    {flashbackFab}
                </Grid>
                <Grid item>
                    {globeFab}
                </Grid>
            </Grid>
        );
        */

        /*
        return (
            <>
                <div style={style}>
                    <PersistentDrawer
                        onChangeComplete={onChangeComplete}
                    />
                    {boardViewer}
                </div>
                {fabView}
            </>
        );
        */
        /*
        return (
            <>
                <div style={style}>
                    {boardViewer}
                    <TabBar
                        onChangeComplete={onChangeComplete}
                    >
                    </TabBar>
                </div>
                {fabView}
            </>
        );
        */
        /*
        return (
            <>
                <div style={style}>
                    <IconDrawer
                        onChangeComplete={onChangeComplete}
                    >
                    </IconDrawer>
                    {boardViewer}
                </div>
                {fabView}
            </>
        );
        */
        return (
            <>
                <div style={style}>
                    <PersistentSearchDrawer
                        onChangeComplete={onChangeComplete}
                        setActiveCountry={props.setActiveCountry}
                    >
                    </PersistentSearchDrawer>
                    {boardViewer}
                </div>
                <Overlay
                    onChangeComplete={onChangeComplete}
                    useGlobe={useGlobe} setUseGlobe={setUseGlobe}
                    viewFlashback={viewFlashback} setViewFlashback={setViewFlashback}
                    tool={tool} setTool={setTool}
                >

                </Overlay>
            </>
        );
}

/*
<Board
    tilesRgba={props.tilesRgba}
    tiles={props.tiles}
    map={props.map}
    values={props.values}
    width={props.width}
    mouseDown={props.mouseDown}
    brushColor={props.brushColor}

    setTile={props.setTile}
/>
*/

export default connect(
  mapStateToProps,
  // { getData },
  mapDispatchToProps
)(BoardPage);
