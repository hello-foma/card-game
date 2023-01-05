import { createBrowserRouter } from 'react-router-dom';
import Welcome from './modules/welcome';

export const enum RouteName {
  root = '/',
}

export default createBrowserRouter([
  {
    path: RouteName.root,
    element: <Welcome />
  },
]);
