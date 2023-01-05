import { useNavigate } from 'react-router-dom';

import Scaffold from '@shared/components/scaffold';
import './index.css'
import Scaffold from '../../shared/scaffold/scaffold';

function Welcome() {
  const footer = <footer>
    <button>Create game</button>
  </footer>;

  return (
    <Scaffold footer={footer} title={'Cheat card game'}>
      <p>Game's description</p>
    </Scaffold>
  )
}

export default Welcome
