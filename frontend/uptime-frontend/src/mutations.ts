// mutations.ts
import { gql } from '@apollo/client';

export const CREATE_USER = gql`
 mutation CreateUser($input: UserInput!) {
  createUser(input: $input) {
    email
    password
  }
}
`;
