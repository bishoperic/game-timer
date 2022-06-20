export function selectOnFocus(node): SvelteActionReturnType {
	const selectOnFocus = () => {
		node.select();
	};

	node.addEventListener('focus', selectOnFocus);

	return {
		destroy: () => {
			node.removeEventListener('focus', selectOnFocus);
		}
	};
}
