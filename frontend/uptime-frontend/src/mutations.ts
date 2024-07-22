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
export const GET_METRICS = gql`
mutation GetMetrics($url: String!) {
  getMetrics(url: $url) {
    responseTime
    status
    url
  }
}
`;