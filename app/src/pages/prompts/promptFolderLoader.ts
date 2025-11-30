import { graphql, loadQuery } from "react-relay";
import { LoaderFunctionArgs } from "react-router";

import RelayEnvironment from "@phoenix/RelayEnvironment";

import {
  promptFolderLoaderQuery,
  promptFolderLoaderQuery$variables,
} from "./__generated__/promptFolderLoaderQuery.graphql";

export const promptFolderLoaderGql = graphql`
  query promptFolderLoaderQuery($folderId: ID!) {
    promptFolder(folderId: $folderId) {
      id
      name
      description
      color
      createdAt
      updatedAt
      prompts {
        id
        name
        description
        version {
          createdAt
        }
        labels {
          id
          name
          color
        }
      }
    }
  }
`;

/**
 * Loads in the necessary page data for a prompt folder page
 */
export function promptFolderLoader({ params }: LoaderFunctionArgs) {
  const { folderId } = params;
  if (!folderId) {
    throw new Error("folderId is required");
  }

  return loadQuery<promptFolderLoaderQuery, promptFolderLoaderQuery$variables>(
    RelayEnvironment,
    promptFolderLoaderGql,
    { folderId }
  );
}

export type PromptFolderLoaderType = ReturnType<typeof promptFolderLoader>;
