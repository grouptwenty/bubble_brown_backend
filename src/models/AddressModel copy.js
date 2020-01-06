import GOBALS from '../GOBALS';


export default class AddressModel {

    async getProvinceBy() {
        return fetch(GOBALS.URL + '/address/getProvinceBy', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
          
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

    async getAmphurInfoByProviceID(id) {
        return fetch(GOBALS.URL + '/address/getAmphurInfoByProviceID', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                province_id: id
            })
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

    async getDistrictInfoByAmphurID(id) {
        return fetch(GOBALS.URL + '/address/getDistrictInfoByAmphurID', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amphur_id: id
            })
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

    async getZipcodeByDistrictID(id) {
        return fetch(GOBALS.URL + '/address/getZipcodeByDistrictID', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                district_id: id
            })
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