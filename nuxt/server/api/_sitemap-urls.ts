import type { Post, Page, SEO } from '~/types';

async function getPosts() {
	const posts = await directusServer.request(
		readItems('posts', {
			fields: [
				'id',
				'slug',
				'date_updated',
				{
					seo: ['canonical_url', 'sitemap_change_frequency', 'sitemap_priority'],
				},
			],
			// @ts-ignore
			filter: {
				status: {
					_eq: 'published',
				},
			},
			limit: -1,
		}),
	);

	const entries = posts.map((post) => {
		const seo = post.seo as SEO;

		return {
			loc: `/posts/${post.slug}`,
			lastmod: post.date_updated,
			changefreq: seo?.sitemap_change_frequency || 'monthly',
			priority: seo?.sitemap_priority || 0.5,
		};
	});

	return entries;
}

async function getPages() {
	const pages = await directusServer.request(
		readItems('pages', {
			fields: [
				'id',
				'permalink',
				'date_updated',
				{
					seo: ['canonical_url', 'sitemap_change_frequency', 'sitemap_priority'],
				},
			],
			// @ts-ignore
			filter: {
				status: {
					_eq: 'published',
				},
			},
			limit: -1,
		}),
	);

	const entries = pages.map((page) => {
		const seo = page.seo as SEO;

		return {
			loc: `${page.permalink}`,
			lastmod: page.date_updated,
			changefreq: seo?.sitemap_change_frequency || 'monthly',
			priority: seo?.sitemap_priority || 0.5,
		};
	});

	return entries;
}

async function getCategories() {
	const categories = await directusServer.request(
		readItems('categories', {
			fields: [
				'id',
				'slug',
				{
					seo: ['canonical_url', 'sitemap_change_frequency', 'sitemap_priority'],
				},
			],

			limit: -1,
		}),
	);

	const entries = categories.map((category) => {
		return {
			loc: `/posts/categories/${category.slug}`,
			changefreq: category.seo?.sitemap_change_frequency || 'monthly',
			priority: category.seo?.sitemap_priority || 0.5,
		};
	});

	return entries;
}

export default defineEventHandler(async () => {
	const [posts, pages, categories] = await Promise.all([
		getPosts(),
		getPages(),
		getCategories(),
	]);

	return [...posts, ...pages, ...categories];
});
