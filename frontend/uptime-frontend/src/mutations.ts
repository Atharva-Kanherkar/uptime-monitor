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

export const METRICS_HISTORY_QUERY = gql`
  query MetricsHistory($url: String!) {
    metricsHistory(url: $url) {
      id
      status
      responseTime
      timestamp
    }
  }
`;