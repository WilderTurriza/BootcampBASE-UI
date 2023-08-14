import { IconCoin } from "@tabler/icons-react";
import { Currency, DropdownOrderBy, Header, SearchInput } from "../components";
import { useEffect, useState } from "react";
import { Currency as ICurrency } from "../interfaces";
import { useGetAllCurrencies } from "../api";

//TODO Renderizar arreglo de currencies
//TODO Crear condicion en caso de que no haya datos
//TODO Hacer el ordenado
//TODO Crear handleDropdown para ordenar
//TODO Crear handleSearch filtrar el arreglo

export const Currencies = () => {
	const orderOptions = [
		{ label: "Nombre", value: "name" },
		{ label: "Simbolo", value: "symbol" },
		{ label: "Valor", value: "value" },
	];

	const { data: currencyData, isLoading, isError } = useGetAllCurrencies();
	const [currencies, setCurrencies] = useState<ICurrency[]>([]);
	const [currentOrderOption, setCurrentOrderOption] = useState("name");
	const [searchWord, setSearchWord] = useState("");

	useEffect(() => {
		if (currencyData) {
			// Ordenar las divisas y aplicar filtro si hay una búsqueda
			const orderedCurrencies = orderCurrencies(currencyData, currentOrderOption);
			const filteredCurrencies = applySearchFilter(orderedCurrencies, searchWord);
			setCurrencies(filteredCurrencies);
		}
	}, [currencyData, currentOrderOption, searchWord]);

	const handleDropdown = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setCurrentOrderOption(e.target.value);
	};

	const handleSearch = (searchWord: string) => {
		setSearchWord(searchWord);
	};

	// Función para ordenar las divisas según la opción seleccionada
	const orderCurrencies = (currencies: ICurrency[], orderOption: string): ICurrency[] => {
		const key = orderOption as keyof ICurrency;
		return [...currencies].sort((a, b) => a[key] > b[key] ? 1 : (a[key] < b[key] ? -1 : 0));
	};

	// Función para aplicar el filtro de búsqueda
	const applySearchFilter = (currencies: ICurrency[], searchWord: string): ICurrency[] => {
		if (!searchWord) {
			return currencies; // Sin filtro si no hay término de búsqueda
		}

		const searchLower = searchWord.toLowerCase();
		return currencies.filter(currency => {
			return (
				currency.symbol.toLowerCase().includes(searchLower) ||
				currency.name.toLowerCase().includes(searchLower) ||
				currency.value.toString().includes(searchWord)
			);
		});
	};

	return (
		<>
			<Header>
				<h1 className="text-3xl font-bold tracking-tight text-gray-900">
					Divisas
				</h1>
				<div className="flex w-full gap-2 sm:w-96">
					<DropdownOrderBy
						onChange={handleDropdown}
						options={orderOptions}
						value={currentOrderOption}
					/>
					<SearchInput
						Icon={IconCoin}
						onSearch={(e) => handleSearch(e.target.value)}
						propertie="divisa"
					>
					</SearchInput>
				</div>
			</Header>

			<section className="flex flex-col items-center h-[calc(100vh-10rem)] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<ul
					role="list"
					className="grid w-full gap-3 overflow-auto divide-y divide-gray-100 sm:grid-cols-2 xl:grid-cols-4 my-7"
				>
					{isLoading ? (
						<div>Loading...</div>
					) : isError ? (
						<div>Error: Algo salió mal. Por favor, intenta de nuevo más tarde.</div>
					) : currencies.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-full">
							<p className="text-3xl font-bold text-center">
								¡Oh no! :(
							</p>
							<p className="mt-5 text-lg text-center">
								Algo no ha salido como esperábamos. Por favor, inténtalo más tarde.
							</p>
						</div>
					) : (
						currencies.map((currency) => (
							<Currency currency={currency} key={currency.symbol} />
						))
					)}
				</ul>
			</section>
		</>
	);
};
