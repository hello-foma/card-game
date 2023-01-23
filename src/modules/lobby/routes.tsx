import { Route } from 'react-router-dom';

import Lobby from './index';
export const boardIdParamName = 'boardId';
export const LobbyRouteName = (boardId = `:${boardIdParamName}`) => `board/${boardId}/lobby`;

export default () => <>
  <Route path={LobbyRouteName()} element={<Lobby />}></Route>
</>
