import { combineReducers } from 'redux';
import userLogin from './user';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import setPermission from './permission';

export interface State<T> {
  data: T;
}

const authPersistConfig = {
  key: 'auth',
  storage: storage
};

const permissionPersistConfig = {
  key: 'permission',
  storage: storage
};

export default combineReducers({
  auth: persistReducer(authPersistConfig, userLogin),
  permission: persistReducer(permissionPersistConfig, setPermission)
});
