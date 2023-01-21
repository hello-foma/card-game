// If any of these functions are dispatched, invoke the appropriate saga
import { saga as boardsSaga } from '@modules/boards/slice';
import { all } from 'redux-saga/effects';

export default function* () {
  yield all([
     ...boardsSaga,
    ]
  );
}
