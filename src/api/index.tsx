import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Client, ClientDTO, Currency } from "../interfaces";
import { httpClient } from "../http";

export const useGetCustomers = () => {
    return useMutation({
        mutationKey: ["Customers"],
        mutationFn: async (name: string) => {
            const { data } = await httpClient.get<Client[]>("/customers", {
                params: {
                    name,
                },
            });

            return data;
        },
    });
};

export const useCreateCustomer = () => {
    return useMutation({
        mutationKey: ["Customers"],
        mutationFn: async (customer: Omit<Client, "customerId">) => {
            const { data } = await httpClient.post<ClientDTO>("/customers", {
                ...customer,
            });

            return data;
        },
    });
};

export const useGetCustomer = ({ clientId }: { clientId: number }) => {
    return useQuery<ClientDTO>(["Customers", clientId], async () => {
        const { data } = await httpClient.get<ClientDTO>(`/customers/${clientId}`);
        return data;
    });
};


/*export const useGetAllCurrencies = () => {
    return useMutation({
        mutationKey: ["Currency"],
        mutationFn: async () => {
            const { data } = await httpClient.get<Currency[]>("/currency");
            return data;
        },
    });
};*/

export const useGetAllCurrencies = () => {
    const queryClient = useQueryClient();

    return useQuery<Currency[], Error>(
        ["Currency"], // QueryKey
        async () => {
            const delayMilliseconds = 1000;
            let data: Currency[] = []; // Establecemos el tipo explícito aquí
            try {
                const response = await httpClient.get<Currency[]>("/currency");
                data = response.data;
            } catch (error) {
                console.error('Error en la solicitud:', error);
                await new Promise(resolve => setTimeout(resolve, delayMilliseconds));
            }

            return data;
        },
        {
            onError: (error: Error) => {
                // Manejar el error, por ejemplo, limpiar la caché si la solicitud falla
                queryClient.invalidateQueries(["Currency"]);
            }
        }
    );
};