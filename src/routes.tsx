import { createBrowserRouter } from 'react-router-dom';
import Welcome from './modules/welcome';

export const rootRoutePath = '/';

export default createBrowserRouter([
  {
    path: rootRoutePath,
    element: <Welcome />
  },
]);

