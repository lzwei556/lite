import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import setPermission from './permission';

export interface State<T> {
  data: T;
}

const permissionPersistConfig = {
  key: 'permission',
  storage: storage
};

export default combineReducers({
  permission: persistReducer(permissionPersistConfig, setPermission)
});
