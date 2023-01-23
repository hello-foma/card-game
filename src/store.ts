import boardsReducer from '@modules/boards/slice';
import userReducer from '@modules/user/slice';
import historyReducer from '@modules/history/slice';

export default {
  historyState: historyReducer('historyState'),
  boardsState: boardsReducer('boardsState'),
  userState: userReducer('userState'),
};
