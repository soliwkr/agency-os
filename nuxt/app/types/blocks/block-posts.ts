import type { Post } from '../content';

export interface BlockPosts {
	id?: string;
	title?: string | null;
	headline?: string | null;
	post_type?: 'all' | 'blog' | 'project' | 'video' | null;
	featured_post?: (string | Post) | null;
	show_search?: boolean | null;
	layout?: 'grid' | 'cards' | null;
	limit?: number | null;
}
