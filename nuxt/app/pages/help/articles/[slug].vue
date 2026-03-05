<script setup lang="ts"></script>
<template>
	<BlockContainer>
		<header class="pb-8 border-b border-default">
			<GlobalSearch placeholder="Search for articles" :collections="['help_articles']" class="flex" />
		</header>
		<HelpArticleDetail />
	</BlockContainer>
</template>
