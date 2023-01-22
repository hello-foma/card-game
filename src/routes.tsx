import { Routes } from 'react-router-dom';

import LobbyRoutes from '@modules/lobby/routes';
import WelcomeRoutes from '@modules/welcome/routes';

export default () => <Routes>
  { WelcomeRoutes() }
  { LobbyRoutes() }
</Routes>

