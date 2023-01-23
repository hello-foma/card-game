import { useDispatch, useSelector } from 'react-redux';

import Scaffold from '@shared/components/scaffold';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { tryToSetActive, tryAssignCurrentUser, selectors as boardSelectors } from '@modules/board/slice';
import { push } from 'redux-first-history';
import { rootRoutePath } from '@shared/types/root-state';
import { requestId, selectors as userSelectors } from '@modules/user/slice';
import { boardIdParamName } from '@modules/lobby/routes';

function Lobby() {
  const dispatch = useDispatch();
  const { [boardIdParamName]: boardId } = useParams();
  const userId = useSelector(userSelectors.selectId);
  const isHost = useSelector(boardSelectors.isHost(userId));
  const users = useSelector(boardSelectors.selectUsers);

  if (userId === null) {
    dispatch(requestId());
  }

  // todo why effect fire twice?
  useEffect(() => {
    if (typeof boardId !== 'string') {
      dispatch(push(rootRoutePath));
    } else {
      dispatch(tryToSetActive(boardId));
      dispatch(tryAssignCurrentUser());
    }
  }, [boardId])

  return <Scaffold>
    <div>
      <input readOnly={true} value={location.href} style={{width: 500}}/>
      <div>
        Lobby content {userId} at {boardId} and you are { isHost ? '' : 'not '} a host
      </div>
      {users !== null &&
        <>
        <div>Users list</div>
          <ul>
            {users.map(user => <li key={user}>{user}</li>)}
          </ul>
        </>
      }
    </div>
  </Scaffold>;
}

export default Lobby
