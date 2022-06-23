export function selectOnFocus(node): SvelteActionReturnType {
	const selectOnFocus = () => {
		node.select();
	};

	node.addEventListener('focus', selectOnFocus);
	node.addEventListener('select', selectOnFocus);

	return {
		destroy: () => {
			node.removeEventListener('focus', selectOnFocus);
			node.addEventListener('select', selectOnFocus);
		}
	};
}
