import { createStore } from 'redux';
import rootReducer from '../_reducers';
var persistStore = []; 

    try {
      const serializedState = localStorage.getItem('store')
      if (serializedState === null) {
        persistStore =  undefined
      } else {
        persistStore =  JSON.parse(serializedState)
      }
    } catch (error) {
        persistStore =  undefined
    }

export const store = createStore(
    rootReducer,
    persistStore
    
);