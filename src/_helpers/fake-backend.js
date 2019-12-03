const loadState = () => {
    try {
      const serializedState = localStorage.getItem('store')
      if (serializedState === null) {
        return undefined
      } else {
        return JSON.parse(serializedState)
      }
    } catch (error) {
      return undefined
    }
  }
  
  const saveState = (state) => {
    try {
      const serializedState = JSON.stringify(state)
      localStorage.setItem('store', serializedState)
      //console.log('store',serializedState)
    } catch (error) {
      console.log(error.message)
    }
  }
  const saveStateLogout = () => {
    try {
      localStorage.setItem('store', [])
      //console.log('store',serializedState)
    } catch (error) {
      console.log(error.message)
    }
  }
  const setUserState = (state) => {
    try {
      const setUserState = JSON.stringify(state)
      localStorage.setItem('setUserState', setUserState)
      //console.log('store')
    } catch (error) {
      console.log(error.message)
    }
  }
  
  
  export {
    loadState,
    saveState,
    setUserState,
    saveStateLogout
  }