import { useDispatch, useSelector } from 'react-redux';

import Scaffold from '@shared/components/scaffold';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  tryAssignCurrentUser,
  selectors as boardSelectors,
  requestSyncPolling, tryToSetActive, cancelSyncPolling
} from '@modules/board/slice';
import { push } from 'redux-first-history';
import { rootRoutePath } from '@shared/types/root-state';
import { requestNewUser, selectors as userSelectors, updateName } from '@modules/user/slice';
import { boardIdParamName } from '@modules/lobby/routes';

function Lobby() {
  const dispatch = useDispatch();

  const { [boardIdParamName]: boardId } = useParams();
  const user = useSelector(userSelectors.selectSlice);
  const isHost = useSelector(boardSelectors.isHost(user.uuid));
  const users = useSelector(boardSelectors.selectUsers);
  const selectedBoard = useSelector(boardSelectors.selectBoardId);

  if (user.uuid === null) {
    dispatch(requestNewUser());
  }

  // todo why effect fire twice?
  useEffect(() => {
    if (typeof boardId !== 'string') {
      dispatch(push(rootRoutePath));
      return;
    }

    if (selectedBoard !== boardId) {
      dispatch(tryToSetActive(boardId));
    } else {
      if (user.uuid !== null) {
        dispatch(tryAssignCurrentUser());
        dispatch(requestSyncPolling());
      }
    }
  }, [boardId, user, selectedBoard]);

  useEffect(() => {
    return () => {
      dispatch(cancelSyncPolling())
    };
  }, []);

  const [nameChanged, changeName] = useState('');

  useEffect(() => {
    if (user.name !== null) {
      changeName(user.name);
    }
  }, [user])



  const nameInput = <div>
    <input value={nameChanged} onChange={(event) => changeName(event.target.value)}/>
    <button onClick={() => dispatch(updateName(nameChanged))}>change</button>
  </div>

  return <Scaffold>
    <div>
      <input readOnly={true} value={location.href} style={{width: 500}}/>
      <div>
        Lobby content {user.uuid} at {boardId} and you are { isHost ? '' : 'not '} a host
      </div>
      {users !== null &&
        <>
        <div>Users list</div>
          <ul>
            {users.map(gameUser =>
              <li key={gameUser.id}>{ gameUser.id === user.uuid ? nameInput : gameUser.name}</li>
            )}
          </ul>
        </>
      }
    </div>
  </Scaffold>;
}

export default Lobby
