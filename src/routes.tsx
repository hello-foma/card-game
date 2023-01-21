import Welcome from '@modules//welcome';
import LobbyRoutes from '@modules/lobby/routes';
import { Route, Routes } from 'react-router-dom';

export const rootRoutePath = '/';

export default () => <Routes>
  <Route element={<Welcome />} path={rootRoutePath}></Route>
  {LobbyRoutes()}
</Routes>

