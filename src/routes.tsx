import { createBrowserRouter } from 'react-router-dom';
import Welcome from '@modules//welcome';
import lobbyRoutes from '@modules/lobby/routes';

export const rootRoutePath = '/';

export default createBrowserRouter([
  {
    path: rootRoutePath,
    element: <Welcome />
  },
  ...lobbyRoutes
]);

