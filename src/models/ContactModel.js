import GOBALS from '../GOBALS';
export default class ContactModel {

    constructor() {
    }
    async getContactBy(data) {
        return fetch(GOBALS.URL + '/contact/getContactBy', {
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


    // async getNewsByCode(data) {
    //     return fetch(GOBALS.URL + '/news/getNewsByCode', {
    //         method: 'POST',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({ news_code: data })
    //     }).then((response) => response.json())
    //         .then((responseJson) => {

    //             return responseJson;
    //         }).catch((error) => {
    //             return {
    //                 data: [],
    //                 error: error,
    //                 query_result: false,
    //                 server_result: false
    //             };
    //         });
    // }


    async deleteByCode(data) {
        return fetch(GOBALS.URL + '/contact/deleteByCode', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ contact_code: data })
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

}