import GOBALS from '../GOBALS';
export default class UnitModel {

    constructor() {
    }
   
    async getUnitBy(data) {
        return fetch(GOBALS.URL + '/unit/getUnitBy', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then((response) => response.json())
            .then((responseJson) => {

                return responseJson;
            }).catch((error) => {
                return {
                    data: [],
                    error: error,
                    query_result: false,
                    server_result:false
                };
            });
    }
  

}