import Scaffold from '@shared/components/scaffold';
import './index.css'
import { useDispatch } from 'react-redux';
import { requestCreate as requestBoardCreate  } from '@modules/boards/slice';

function Welcome() {
  const dispatch = useDispatch();

  const footer = <footer>
    <button onClick={() => dispatch(requestBoardCreate())}>Create game</button>
  </footer>;

  return (
    <Scaffold footer={footer} title={'Cheat card game'}>
      <p>Game's description</p>
    </Scaffold>
  )
}

export default Welcome
