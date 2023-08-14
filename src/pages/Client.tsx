import { IconPlus } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { Header, CreditCard } from "../components";
import { useGetCustomer } from "../api";
import { ClientDTO } from "../interfaces";
import { FetchingData } from "../components/FetchingData";
import { useParams } from "react-router-dom";

export const Client = () => {
	const { id } = useParams<{ id: string | undefined }>();

	// Manejar el caso en que clientId es undefined
	const parsedClientId = id ? parseInt(id) : 0; // Puedes usar 0 u otro valor predeterminado

	const { data: clientData, isLoading, isError } = useGetCustomer({
		clientId: parsedClientId,
	});
	const [clientDto, setClientDto] = useState<ClientDTO | null>(null);
	const [clientName, setClientName] = useState("");

	useEffect(() => {
		if (clientData) {
			const newClientDto: ClientDTO = {
				information: {
					birthdate: clientData.information.birthdate,
					curp: clientData.information.curp,
					customerId: clientData.information.customerId,
					gender: clientData.information.gender,
					name: clientData.information.name,
				},
				accounts: clientData.accounts,
			};

			// Guardamos el nuevo objeto ClientDTO en el estado
			setClientDto(newClientDto);
		}
	}, [clientData]);


	return (
		<>
			<Header>
				<h1 className="text-3xl font-bold tracking-tight text-gray-900 text-center">
					{isLoading ? "Cargando..." : isError ? "Error" : clientName}
				</h1>
			</Header>

			<section className="flex flex-col items-center h-[calc(100vh-10rem)] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 py-7 w-full">
					<FetchingData isLoading={isLoading} isError={isError}>
						{/* Verificar si hay cuentas antes de generar las tarjetas */}
						{clientDto && clientDto.accounts.length > 0 ? (
							// Generar una CreditCard por cada cuenta en accounts
							clientDto.accounts.map((account, index) => (
								<CreditCard
									name={clientDto.information.name}
									cardNumber={account.accountNumber}
									balance={account.balance}
									key={index}
								/>
							))
						) : (
							<p>No hay cuentas disponibles</p>
						)}
					</FetchingData>
				</ul>
				
			</section>

		</>
	);

};