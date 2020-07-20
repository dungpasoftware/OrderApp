import axios from 'axios';
import { ROOT_API_CONNECTION } from '../common/apiConnection';


const instance = axios.create({
    baseURL: ROOT_API_CONNECTION,
});

function listAllCategory(accessToken) {
    instance.defaults.headers['token'] = accessToken;
    return instance.get(`/categories`)
        .then(response => {
            let newListCategory = [...response.data]
            newListCategory.unshift({
                categoryId: 0,
                categoryName: 'Tất cả',
            })
            return {
                listCategoryAPI: newListCategory,
            };
        })
        .catch(err => {
            console.log(err);
        });
}

function listDishByCategory(accessToken, categoryId) {
    instance.defaults.headers['token'] = accessToken;
    return instance.get(`/categories/${categoryId}/dishes`)
        .then(response => {
            return {
                listDishAPI: response.data,
            };
        })
        .catch(err => {
            console.log(err);
        });
}

function listOptionsByDishId(accessToken, dishId) {
    instance.defaults.headers['token'] = accessToken;
    return instance.get(`/dishes/${dishId}/options`)
        .then(response => {
            return {
                listOptionsAPI: response.data,
            };
        })
        .catch(err => {
            console.log(err);
        });
}

const dishRequest = { listAllCategory, listDishByCategory, listOptionsByDishId }
export default dishRequest