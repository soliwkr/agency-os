export type * from '#shared/types/schema';
export type * from './api/global-search';

// Aliases for generated names that differ from legacy imports
export type { DirectusFile as File } from '#shared/types/schema';
export type { DirectusFolder as Folder } from '#shared/types/schema';
export type { DirectusUser as User } from '#shared/types/schema';
export type { Seo as SEO } from '#shared/types/schema';
export type { BlockColumnsRow as BlockColumnRow } from '#shared/types/schema';
export type { BlockLogocloudLogo as BlockLogocloudFile } from '#shared/types/schema';
export type { BlockPost as BlockPosts } from '#shared/types/schema';
export type { BlockTestimonialSliderItem as BlockTestimonialItem } from '#shared/types/schema';
export type { OrganizationAddresse as OrganizationAddress } from '#shared/types/schema';
export type { OrganizationsContact as OrganizationContact } from '#shared/types/schema';

// Custom types not generated from Directus schema
export type PostType = 'blog' | 'project' | 'video';
export type BackgroundType = 'default' | 'muted' | 'elevated' | 'accented' | 'inverted' | 'primary';
export type BlockFaqQuestion = { title: string; answer: string };

export type BlockType =
	| 'block_columns'
	| 'block_cta'
	| 'block_faqs'
	| 'block_form'
	| 'block_gallery'
	| 'block_hero'
	| 'block_html'
	| 'block_logocloud'
	| 'block_quote'
	| 'block_richtext'
	| 'block_steps'
	| 'block_team'
	| 'block_testimonials'
	| 'block_video'
	| 'block_divider'
	| 'block_posts';

export type Block =
	| import('#shared/types/schema').BlockColumn
	| import('#shared/types/schema').BlockCta
	| import('#shared/types/schema').BlockFaq
	| import('#shared/types/schema').BlockForm
	| import('#shared/types/schema').BlockGallery
	| import('#shared/types/schema').BlockHero
	| import('#shared/types/schema').BlockHtml
	| import('#shared/types/schema').BlockLogocloud
	| import('#shared/types/schema').BlockQuote
	| import('#shared/types/schema').BlockRichtext
	| import('#shared/types/schema').BlockStep
	| import('#shared/types/schema').BlockTeam
	| import('#shared/types/schema').BlockTestimonial
	| import('#shared/types/schema').BlockVideo
	| import('#shared/types/schema').BlockDivider
	| import('#shared/types/schema').BlockPost;
