import {applyMiddleware, combineReducers, createStore} from "redux";
import logger from "redux-logger";

//Store gets told that this function is responsible for changing state
//Handler that returns new state
const mathReducer = (state = {
    result:10,
    lastValues: []
}, action) => {
    switch (action.type) {
        case "ADD":
            state = {
                ...state,
                result: state.result + action.payload,
                lastValues: [...state.lastValues, action.payload]
            }

            break;
        case "SUBTRACT":
            state = {
                ...state,
                result: state.result - action.payload,
                lastValues: [...state.lastValues, action.payload]
            }
            break;
        default:
            break;
    }
    return state
}

const userReducer = (state = {
    name: "Max",
    age: 27,
}, action) => {
    switch (action.type) {
        case "SET_NAME":
            state = {
                ...state,
                name: action.payload
            }

            break;
        case "SET_AGE":
            state = {
                ...state,
                age: action.payload
            }
            break;
        default:
            break;
    }
    return state
}

export default createStore(combineReducers(
    {math: mathReducer,user: userReducer})
    ,{},
    applyMiddleware(logger))
