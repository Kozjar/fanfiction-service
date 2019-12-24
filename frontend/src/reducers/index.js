import { combineReducers } from 'redux';
import language from './langReducer'
import user from './userReducer'

export default combineReducers({
  language,
  user
});