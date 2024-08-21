export interface PostContent {
	title: string;
	coverImageKey: string;
	formattedContent: string;
	bodyImageKeys: string[];
}

export interface User {
	avatar: string;
	name: string;
	description: string;
	jobCategory: {
		parentId: number;
		i18nKey: string;
		id: number;
		title: string;
	};
	roleCategories: {
		parentId: number;
		i18nKey: string;
		id: number;
		title: string;
	}[];
	userHash: string;
	oneidHash: string;
	url: string;
	profileMode: string;
	preferences: {
		career: boolean;
		education: boolean;
	};
	recommendationId: number;
	isFollowed: boolean;
	followCounts: {
		userFollowings: number;
		userFollowers: number;
		teamFollowings: number;
		teamFollowers: number;
		totalFollowings: number;
		totalFollowers: number;
	};
	type: string;
	id: number;
	annual: number;
	status: number;
}

export interface PostDetail {
	coverImage: string;
	bestType: string;
	isLiked: boolean;
	likersSummary: {
		avatar: string;
		oneidHash: string;
		id: number;
	}[];
	formattedContent: string;
	reportsCount: number;
	commentsCount: number;
	likesCount: number;
	isCommented: boolean;
	user: User;
	comments: {
		postId: number;
		likesCount: number;
		reportsCount: number;
		createdAt: string;
		updatedAt: string;
		isLiked: boolean;
		user: User;
		id: number;
		user_id: number;
		content: string;
	}[];
	team: {
		id: number;
		name: string;
		avatar: string;
		isFollowed: boolean;
		image: {
			url: string;
		};
		url: string;
	};
	keywordIds: number[];
	updatedAt: string;
	createdAt: string;
	score: number;
	id: number;
	title: string;
	status: string;
	content: string;
}

export interface PublishResponse {
	postId: number;
}

export interface Team {
	isCreator: boolean;
	isFollowed: boolean;
	id: number;
	name: string;
	description: string;
	viewsCount: number;
	avatar: string | null;
	creatorId: number;
	isPublic: boolean;
	type: string;
	followerCount: number;
	url: string;
}
