import Root, {
	type ButtonProps,
	type ButtonSize,
	type ButtonVariant,
	buttonVariants
} from './button.svelte';

import BindableRoot, {
	type HtmlButtonProps
} from './bindableButton.svelte';

export {
	Root,
	type ButtonProps as Props,
	//
	Root as Button,
	buttonVariants,
	type ButtonProps,
	type ButtonSize,
	type ButtonVariant,
	//
	BindableRoot as BindableButton,
	type HtmlButtonProps
};
