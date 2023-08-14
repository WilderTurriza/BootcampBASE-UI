import { Currency as ICurrency } from "../interfaces";

interface Props {
	currency: ICurrency;
}

export const Currency = ({ currency }: Props) => {
	const { name, symbol, value } = currency;

	return (
		<li className="w-full p-4 bg-white border border-gray-900 rounded-lg shadow sm:p-8 dark:bg-white dark:border-gray-100">
			<h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-500">
				{symbol}
			</h5>
			<div className="flex items-baseline text-gray-900 dark:text-black">
				<span className="text-xl font-extrabold" >$</span>
				<span className="text-2xl font-extrabold tracking-tight text-ellipsis">
					{value}
				</span>
				<span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-500">
					MXN
				</span>
			</div>
			<ul role="list" className="space-y-5 my-7">
				<li className="flex space-x-3 items-center">
					<span className="text-base font-normal leading-tight text-gray-400 dark:text-gray-500">
						{name}
					</span>
				</li>
			</ul>
		</li>
	);
};