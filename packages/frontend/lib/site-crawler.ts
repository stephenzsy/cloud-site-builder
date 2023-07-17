import { gql } from "graphql-request";

export interface SiteCrawler {}
const BLOCK_QUERY = gql`
  query Block($id: ID) {
    block(id: $id) {
      data {
        id
        attributes {
          componentType
          locale
          props
          type
          updatedAt
          localizations {
            data {
              id
              attributes {
                locale
              }
            }
          }
          simple {
            id
            richText
            text
            link {
              data {
                id
              }
            }
          }
          slots {
            description
            id
            slotName
            simple {
              id
              richText
              text
              link {
                data {
                  id
                }
              }
            }
            block {
              data {
                id
              }
            }
          }
        }
      }
    }
  }
`;
