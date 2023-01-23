import Scaffold from '@shared/components/scaffold';
import { useDispatch, useSelector } from 'react-redux';

import './index.css'
import { requestCreate as requestBoardCreate  } from './slice';
import { selectors } from '@modules/history/slice';
import { Link } from 'react-router-dom';
import { LobbyRouteName } from '@modules/lobby/routes';

function Welcome() {
  const dispatch = useDispatch();
  const boards = useSelector(selectors.selectRecords);

  const footer = <footer>
    <button onClick={() => dispatch(requestBoardCreate())}>Create game</button>
  </footer>;

  return (
    <Scaffold footer={footer} title={'Cheat card game'}>
      <p>Game's description</p>
      <ul>
        { boards.map(board => <li key={board.id}><Link to={LobbyRouteName(board.id)}>{board.id}</Link></li>)}
      </ul>

    </Scaffold>
  )
}

export default Welcome
