import { useDispatch, useSelector } from 'react-redux';

import Scaffold from '@shared/components/scaffold';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { tryToSetActive } from '@modules/boards/slice';
import { push } from 'redux-first-history';
import { rootRoutePath } from '@shared/types/root-state';
import { requestId, selectors } from '@modules/user/slice';

function Lobby() {
  const dispatch = useDispatch();
  const { boardId } = useParams();
  const userId = useSelector(selectors.selectId);

  if (userId === null) {
    dispatch(requestId());
  }

  // todo why effect fire twice?
  useEffect(() => {
    if (typeof boardId !== 'string') {
      dispatch(push(rootRoutePath));
    } else {
      dispatch(tryToSetActive(boardId));
    }
  }, [boardId])

  return <Scaffold>Lobby content {userId} at {boardId}</Scaffold>;
}

export default Lobby
