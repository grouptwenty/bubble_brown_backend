import GOBALS from '../GOBALS';
export default class UploadModel {
    async uploadImages(data) {
        return  fetch(GOBALS.URL_UPLOAD_IMG, {
            method: 'post',
            headers: {

            },
            body: data
        })
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            }).catch((error) => {
                return {
                    data: [],
                    error: error,
                    upload_result: false,
                    server_result: false
                };
                //console.error(error);
            });
    }
    async deleteImages(data, folder) {
        return await fetch(GOBALS.URL_DELETE_IMG, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image_name: data,
                folder_name: folder
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            }).catch((error) => {
                return {
                    data: [],
                    error: error,
                    upload_result: false,
                    server_result: false
                };
                //console.error(error);
            });
    }
}