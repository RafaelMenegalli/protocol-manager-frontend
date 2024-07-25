import axios, { AxiosError } from 'axios'
import { GetServerSidePropsContext } from "next";

export function setupAPIClient(ctx?: GetServerSidePropsContext) {

    const api = axios.create({
        baseURL: 'http://localhost:3333',
    })

    api.interceptors.response.use((response) => {
        return response
    }, (error: AxiosError) => {
        if (error.response?.status === 401) {
        }

        return Promise.reject(error)
    })

    return api
}