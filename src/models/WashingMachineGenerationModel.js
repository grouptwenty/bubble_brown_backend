import GOBALS from '../GOBALS';
export default class WashingMachineGenerationModel {

    constructor() {
    }
    async getWashingMachineGenerationBy(data) {
        return fetch(GOBALS.URL + '/machine-generation/getWashingMachineGenerationBy', {
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

    async getWashingMachineGenerationMaxCode(data) {
        return fetch(GOBALS.URL + '/machine-generation/getWashingMachineGenerationMaxCode', {
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

    async insertGenerationBy(data) {
        return fetch(GOBALS.URL + '/machine-generation/insertGenerationBy', {
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

    
    async getGenerationByCode(data) {
        return fetch(GOBALS.URL + '/machine-generation/getGenerationByCode', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ washing_machine_generation_code: data })
        }).then((response) => response.json())
            .then((responseJson) => {

                return responseJson;
            }).catch((error) => {
                return {
                    data: [],
                    error: error,
                    query_result: false,
                    server_result: false
                };
            });
    }
    
    async updateGenerationBy(data) {
        return fetch(GOBALS.URL + '/machine-generation/updateGenerationBy', {
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

    async deleteByCode(data) {
        return fetch(GOBALS.URL + '/machine-generation/deleteByCode', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({washing_machine_generation_code:data})
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