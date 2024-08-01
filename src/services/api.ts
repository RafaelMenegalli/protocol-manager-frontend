import axios, { AxiosError } from 'axios'
import { GetServerSidePropsContext } from "next";

export function setupAPIClient(ctx?: GetServerSidePropsContext) {

    const api = axios.create({
        baseURL: 'https://protocol-manager-backend.onrender.com',
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