import { gql } from 'apollo-server-express';

const postType = gql`
	scalar Date
	scalar Upload

	type Post {
		_id: ObjectID!
		content: String!
		attachment: String
		creator: User!
		createdAt: Date
		updatedAt: Date
	}

	type Pagination {
		currentPage: Int,
		totalPages: Int,
		itemsPerPage: Int,
		totalItems: Int,
	}

	type PaginatedPost {
		pagination: Pagination
		posts: [Post],
	}

`;

export { postType }