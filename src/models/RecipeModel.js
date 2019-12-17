import GOBALS from '../GOBALS';
export default class RecipeModel {

    constructor() {
    }
   
    async getRecipeByCode(data) {
        return fetch(GOBALS.URL + '/recipe/getRecipeByCode', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({menu_code: data})
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
    async getRecipeMaxCode(data) {
        return fetch(GOBALS.URL + '/recipe/getRecipeMaxCode', {
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

    async deleteRecipeByCode(data) {
        return fetch(GOBALS.URL + '/recipe/deleteRecipeByCode', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({menu_code:data})
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
    async insertRecipe(data) {
        return fetch(GOBALS.URL + '/recipe/insertRecipe', {
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

    // async insertUserBy(data) {
    //     return fetch(GOBALS.URL + '/user/insertUserBy', {
    //         method: 'POST',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(data)
    //     }).then((response) => response.json())
    //         .then((responseJson) => {

    //             return responseJson;
    //         }).catch((error) => {
    //             return {
    //                 data: [],
    //                 error: error,
    //                 query_result: false,
    //                 server_result:false
    //             };
    //         });
    // }

    // async updateUserBy(data) {
    //     return fetch(GOBALS.URL + '/user/updateUserBy', {
    //         method: 'POST',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(data)
    //     }).then((response) => response.json())
    //         .then((responseJson) => {

    //             return responseJson;
    //         }).catch((error) => {
    //             return {
    //                 data: [],
    //                 error: error,
    //                 query_result: false,
    //                 server_result:false
    //             };
    //         });
    // }

    // async deleteByCode(data) {
    //     return fetch(GOBALS.URL + '/user/deleteByCode', {
    //         method: 'POST',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({user_code:data})
    //     }).then((response) => response.json())
    //         .then((responseJson) => {

    //             return responseJson;
    //         }).catch((error) => {
    //             return {
    //                 data: [],
    //                 error: error,
    //                 query_result: false,
    //                 server_result:false
    //             };
    //         });
    // }

    // async getUserByCode(data) {
    //     return fetch(GOBALS.URL + '/user/getUserByCode', {
    //         method: 'POST',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({user_code:data})
    //     }).then((response) => response.json())
    //         .then((responseJson) => {

    //             return responseJson;
    //         }).catch((error) => {
    //             return {
    //                 data: [],
    //                 error: error,
    //                 query_result: false,
    //                 server_result:false
    //             };
    //         });
    // }
    

}