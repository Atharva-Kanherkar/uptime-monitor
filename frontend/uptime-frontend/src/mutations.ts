// mutations.ts
import { gql } from '@apollo/client';

export const CREATE_USER = gql`
 mutation CreateUser($input: UserInput!) {
  createUser(input: $input) {
    email
    password
  }
}
`
;
 
export const LOGIN_USER = gql`
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      id
      email
      userName
      profilePhoto
      isPaid
      slackUserId
      slackToken
      slackChannelId
    }
  }
}
`;

 export const METRICS_HISTORY_QUERY = gql`
query MetricsHistory($url: String!) {
  metricsHistory(url: $url) {
    responseTime
    status
  }
}
`;

export const GET_METRICS_MUTATION = gql`
mutation GetMetrics($url: String!) {
  getMetrics(url: $url) {
    responseTime
    status
    url
  }
}
`;
export const ME_QUERY = gql`
query Me {
  me {
    email
    id
    password
    isPaid
    profilePhoto
    slackChannelId
    slackToken
    slackUserId
    userName
    website {
      url
    }
  }
}
`;
export const SEND_DEMO_EMAIL = gql`
mutation SendDemoEmail($email: String!) {
  sendDemoEmail(email: $email)
}
`;

