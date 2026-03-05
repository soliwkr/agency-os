import type { File } from '../system/index.js';
import type { NavigationItem } from './navigation.js';

export interface Globals {
	address_country?: string | null;
	address_locality?: string | null;
	address_region?: string | null;
	description?: string | null;
	email?: string | null;
	id?: string;
	og_image?: (string | File) | null;
	phone?: string | null;
	postal_code?: string | null;
	social_links: { [key: string]: any } | null;
	street_address?: string | null;
	tagline?: string | null;
	title?: string | null;
	url?: string | null;
	contact?: string;
	seo?: string;
	social?: string;
	menus?: string;
	header_navigation?: (string | NavigationItem)[];
	footer_navigation?: (string | NavigationItem)[];
	logo?: (string | File) | null;
	logo_dark_mode?: (string | File) | null;
	primary_color?: string | null;
	neutral_color?: string | null;
	border_radius?: 'none' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | 'full' | null;
	font_display?: string | null;
	font_body?: string | null;
	font_monospace?: string | null;
}
