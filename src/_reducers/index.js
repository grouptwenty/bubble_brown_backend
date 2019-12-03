import { combineReducers } from 'redux';
import { user } from './member.reducer';
import { washing_wachine } from './washing_wachine';


const rootReducer = combineReducers({
  user,
  washing_wachine,

});

export default rootReducer;