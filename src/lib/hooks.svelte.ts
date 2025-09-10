import type { UnknownAction, Action as BasicAction, Store, Dispatch } from '@reduxjs/toolkit';
import { getContext } from 'svelte';
import diff from 'microdiff';

export const contextStoreKey = Symbol('redux-store');
export const contextStoreStateKey = Symbol('redux-store-state');

export function useStore<State = unknown, Action extends BasicAction<string> = UnknownAction>() {
	const store = getContext<Store<State, Action>>(contextStoreKey);
	return store;
}

export function useSelector<TState, TSelected>(
	selector: (state: TState) => TSelected
): {
	readonly value: TSelected;
} {
	if (typeof selector !== 'function')
		throw new Error('You must pass a function as a selector to useSelector');

	const store = getContext<Store<TState, UnknownAction>>(contextStoreKey);

	let lastState = $state<TSelected>(selector(store.getState()));

	store.subscribe(() => {
		const nextState = selector(store.getState());

		const isArrayOrObject = typeof nextState === 'object' || Array.isArray(nextState);

		if (isArrayOrObject) {
			const diffValue = diff(
				$state.snapshot(lastState) as Record<string, unknown>,
				nextState as Record<string, unknown>
			);

			if (diffValue.length > 0) {
				lastState = nextState;
				return;
			}
			return;
		}

		if (nextState !== lastState) {
			lastState = nextState;
		}
	});

	return {
		get value() {
			return lastState;
		}
	};
}

export function useDispatch<
	AppDispatch extends Dispatch<UnknownAction> = Dispatch<UnknownAction>
>(): AppDispatch {
	const store = useStore();
	return store.dispatch as AppDispatch;
}
