import { all } from 'redux-saga/effects';

import { saga as boardsSaga } from '@modules/boards/slice';
import {saga as welcomeSaga} from '@modules/welcome/slice';

export default function* () {
  yield all([
    ...welcomeSaga,
     ...boardsSaga,
    ]
  );
}
