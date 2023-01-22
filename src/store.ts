import boardsReducer from '@modules/boards/slice';
import userReducer from '@modules/user/slice';

export default {
  boardsState: boardsReducer('boardsState'),
  userState: userReducer('userState'),
};
