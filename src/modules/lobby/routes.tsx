import { Route } from 'react-router-dom';

import Lobby from './index';

export const LobbyRouteName = (boardId = ':boardId') => `board/${boardId}/lobby`;

export default () => <>
  <Route path={LobbyRouteName()} element={<Lobby />}></Route>
</>
