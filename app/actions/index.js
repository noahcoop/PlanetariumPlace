import { ADD_ARTICLE, SET_TILE, SET_MOUSE_DOWN, SET_BRUSH_COLOR, TILES_FETCHED } from "../constants/actionTypes";
import * as Action from "../constants/actionTypes";
import * as System from '../constants/system';
import * as API from "../utils/api";
import store from "../store/index";


export function addArticle(payload) {
    return { type: ADD_ARTICLE, payload };
};

export function setTile(payload) {
    return { type: SET_TILE, payload };
};

export function setLocalTile(payload) {
    return { type: Action.SET_LOCAL_TILE, payload };
};

export function setBoardId(payload) {
    return { type: Action.SET_BOARD_ID, payload };
};

export function playChange(payload) {
    return { type: Action.PLAY_CHANGE, payload };
};

export function setMouseDown(payload) {
    return { type: SET_MOUSE_DOWN, payload };
};
export function setActiveCountry(payload) {
    return { type: Action.SET_ACTIVE_COUNTRY, payload };
};

export function setBrushColor(payload) {
    return { type: SET_BRUSH_COLOR, payload };
};

/*
export function fetchTileChanges(payload) {
    return { type: Action.TILE_CHANGES_FETCHED, payload };
};
*/

export function getData() {
    // alert("aaaaa");
    return function(dispatch) { // , getState
        // alert("bbbbb");
        return fetch("https://jsonplaceholder.typicode.com/posts")
            .then(response => response.json())
            .then(json => {
                dispatch({ type: "DATA_LOADED", payload: json });
            }
        );
    };
}

/**
* Handle a single "chunk" or response data.
* This modifies the local timestamp, canvas, and offset variables.
* @function
* @param {Uint8Array} responseArray
*/

export function fetchTiles() {
    // alert("aaaaa");
    return function(dispatch, getState) { // , getState
        // const canvas = API.fetchTiles();
        // return dispatch({ type: TILES_FETCHED, payload: API.fetchTiles() });
        /*
        return API.fetchTiles().then((canvas) => {
            console.log("resolved!");
            console.log(canvas);
            return dispatch({ type: TILES_FETCHED, payload: canvas });
        });
        */
        const state = store.getState();
        const boardId = state.boardId;
        return API.fetchTiles(boardId, dispatch);
    }
}

export function fetchTileChanges() {
    // alert("aaaaa");
    return function(lastUpdated, boardId, dispatch) { // , getState
        // TODO: access the state here in order to avoid unnecessary rerenders every 5 secs
        // const canvas = API.fetchTiles();
        // return dispatch({ type: TILES_FETCHED, payload: API.fetchTiles() });
        /*
        return API.fetchTiles().then((canvas) => {
            console.log("resolved!");
            console.log(canvas);
            return dispatch({ type: TILES_FETCHED, payload: canvas });
        });
        */
        const state = store.getState();
        lastUpdated = state.board.lastUpdated;
        return API.fetchTileChanges(lastUpdated, boardId, dispatch);
    }
}
