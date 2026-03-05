import type { Page } from '../content/index.js';

export interface NavigationItem {
	has_children?: boolean | null;
	/** Icon that displays in dropdown menus on website. */
	icon?: string | null;
	id?: string;
	/** Label to help User. Displays below the link in dropdown nav menus. */
	label?: string | null;
	open_in_new_tab?: boolean | null;
	page?: (string | Page) | null;
	parent?: (string | NavigationItem) | null;
	sort?: number | null;
	title?: string | null;
	type?: string | null;
	url?: string | null;
	children?: (string | NavigationItem)[];
	/** Control the icon and label displayed on the website. */
	display_details?: string;
}
