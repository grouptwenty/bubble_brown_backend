export function user(state = [], action) {
  switch (action.type) {
    case "setUserLogout":
    console.log("setUserLogout")
      state = []
      break;
    case "setMemberLogin":
      state = action.payload
      break;
    default:
  }
  return state;
}