import { Route } from 'react-router-dom';
import Welcome from './index';
import { rootRoutePath } from '@shared/types/root-state';

export default () => <>
  <Route element={<Welcome />} path={rootRoutePath}></Route>
</>
