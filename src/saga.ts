import { all } from 'redux-saga/effects';

import { saga as boardsSaga } from '@modules/board/slice';
import { saga as welcomeSaga } from '@modules/welcome/slice';
import { saga as userSaga } from '@modules/user/slice'
import { saga as historySaga } from '@modules/history/slice'

export default function* () {
  yield all([
    ...historySaga,
    ...welcomeSaga,
    ...boardsSaga,
    ...userSaga,
    ]
  );
}
