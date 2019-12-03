import GOBALS from '../GOBALS';
export default class AdminModel {

    constructor() {
    }
    async checkAdminModelLogin(data) {
        return fetch(GOBALS.URL + '/admin/checkAdminModelLogin', {
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
                    server_result: false
                };
            });
    }


    async getAdminby() {
        return fetch(GOBALS.URL + '/admin/getAdminby', {
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
                    server_result: false
                };
            });
    }

    async getAdminMaxCode() {
        return fetch(GOBALS.URL + '/admin/getAdminMaxCode', {
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
                    server_result: false
                };
            })
    }

    async insertAdminBy(data) {
        return fetch(GOBALS.URL + '/admin/insertAdminBy', {
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
                    server_result: false
                };
            })
    }


    async getAdminbyCode(data) {
        return fetch(GOBALS.URL + '/admin/getAdminbyCode', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ admin_code: data })
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


    async updateAdminBy(data) {
        return fetch(GOBALS.URL + '/admin/updateAdminBy', {
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
                    server_result: false
                };
            })
    }

    async deleteAdminBy(data) {
        return fetch(GOBALS.URL + '/admin/deleteAdminBy', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ admin_code: data })
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
            })
    }

}