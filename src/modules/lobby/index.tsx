import { useDispatch } from 'react-redux';

import Scaffold from '@shared/components/scaffold';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { tryToSetActive } from '@modules/boards/slice';
import { push } from 'redux-first-history';
import { rootRoutePath } from '@shared/types/root-state';

function Lobby() {
  const dispatch = useDispatch();
  const { boardId } = useParams();
  // todo why effect fire twice?
  useEffect(() => {
    if (typeof boardId !== 'string') {
      dispatch(push(rootRoutePath));
    } else {
      dispatch(tryToSetActive(boardId));
    }
  }, [boardId])

  return <Scaffold>Lobby content</Scaffold>;
}

export default Lobby
