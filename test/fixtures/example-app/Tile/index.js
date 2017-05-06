import React from 'react';
import withLocalState from '../../pyradux/withLocalState';

import Tile from './Tile';
import reducer from './reducer';

export default withLocalState({reducer, stateKey: 'tile'}, Tile);
