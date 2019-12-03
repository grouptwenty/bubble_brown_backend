export function washing_wachine(state = [], action) {
    switch (action.type) {
        case "setWashingMachine":
            console.log("setWashingMachine")
            state = action.payload
            break;

        case "clearWashingMachine":
            state = []
            break;
        default:
    }
    return state;
}
