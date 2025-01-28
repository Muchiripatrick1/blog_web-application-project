import * as usersApi from "@/network/api/users";
import { UnAuthorizedError } from "@/network/http-errors";
import useSWR from "swr";

export default function useAuthenticatedUser (){
    const { data, isLoading, error, mutate } = useSWR("authenticated_user", 
        async () => {
            try {
                return await usersApi.getAuthenticatedUser();
            } catch (error) {
                if(error instanceof UnAuthorizedError){ 
                    return null;
                }else {
                    throw error;
                }
            }
        }
    );

    return{
        user: data,
        userLoading: isLoading,
        userLoadingError: error,
        mutateUser: mutate,
    }
}