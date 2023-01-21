import { combineReducers } from '@reduxjs/toolkit';

import boardsReducer from '@modules/boards/slice';

export default combineReducers({
  boardsState: boardsReducer
});
