import { RouteObject } from 'react-router-dom';

import Lobby from './index';

export const LobbyRouteName = 'board/:boardId/lobby';

export default [
  {
    path: LobbyRouteName,
    element: <Lobby/>
  },
] as RouteObject[];
