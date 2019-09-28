import { SET_ALERT, REMOVE_ALERT } from "../actions/types";

// alert reducer
const initialState = [];

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      return [...state, payload];
    case REMOVE_ALERT:
      // remove specific alert by id
      return state.filter(alert => alert.id !== payload);
    default:
      return state;
  }
}
