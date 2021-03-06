import { gql } from 'apollo-server-express';

const userType = gql`
	scalar ObjectID
	
	type User {
		_id: ObjectID!
		username: String!
		email: String!
		createdAt: Date
		updatedAt: Date
	}

`;

export { userType }