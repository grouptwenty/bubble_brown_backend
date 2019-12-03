import GOBALS from '../GOBALS';
export default class RepairModel {

    constructor() {
    }
    async getRepairBy(data) {
        return fetch(GOBALS.URL + '/repair/getRepairBy', {
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

    
    
    async updateRepairBy(data) {
        return fetch(GOBALS.URL + '/repair/updateRepairBy', {
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
        return fetch(GOBALS.URL + '/repair/deleteByCode', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({repair_code:data})
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

    async getRepairByCode(data) {
        return fetch(GOBALS.URL + '/repair/getRepairByCode', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({repair_code:data})
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

    async getRepairStatusBy(data) {
        return fetch(GOBALS.URL + '/repair/getRepairStatusBy', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({repair_code:data})
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