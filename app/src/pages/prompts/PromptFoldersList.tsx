import { useMemo } from "react";
import { graphql, useFragment } from "react-relay";
import { useNavigate } from "react-router";
import { css } from "@emotion/react";

import { Card, Flex, Heading, Icon, Icons, Text, View } from "@phoenix/components";

import { PromptFoldersList_folders$key } from "./__generated__/PromptFoldersList_folders.graphql";

export function PromptFoldersList(props: { query: PromptFoldersList_folders$key }) {
  const data = useFragment<PromptFoldersList_folders$key>(
    graphql`
      fragment PromptFoldersList_folders on Query {
        promptFolders(first: 100) {
          edges {
            node {
              id
              name
              description
              color
              prompts {
                id
              }
            }
          }
        }
      }
    `,
    props.query
  );

  const navigate = useNavigate();

  const folders = useMemo(() => {
    return data.promptFolders.edges.map((edge) => edge.node);
  }, [data]);

  if (folders.length === 0) {
    return null;
  }

  const folderCardCSS = css`
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: var(--ac-global-rounding-medium);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .card__body {
      padding: var(--ac-global-dimension-size-200);
    }
  `;

  return (
    <View padding="size-200" borderBottomWidth="thin" borderBottomColor="grey-200">
      <Flex direction="column" gap="size-200">
        <Heading level={3} weight="heavy">Folders</Heading>
        <Flex direction="row" gap="size-200" wrap="wrap">
          {folders.map((folder) => {
            const promptCount = folder.prompts.length;
            return (
              <div
                key={folder.id}
                onClick={() => navigate(`/prompts/folders/${folder.id}`)}
                css={folderCardCSS}
              >
                <Card
                  variant="compact"
                  backgroundColor="grey-75"
                  borderColor={folder.color}
                  borderWidth="medium"
                  collapsible={false}
                  titleSeparator={true}
                  title={
                    <Flex direction="row" gap="size-100" alignItems="center">
                      <Icon
                        svg={<Icons.FolderOutline />}
                        color={folder.color}
                        size="M"
                      />
                      <Text weight="heavy" size="M">{folder.name}</Text>
                    </Flex>
                  }
                  style={{
                    minWidth: "240px",
                    maxWidth: "280px",
                  }}
                >
                  <Flex direction="column" gap="size-150">
                    {folder.description && (
                      <Text
                        color="text-700"
                        size="S"
                        css={css`
                          display: -webkit-box;
                          -webkit-line-clamp: 2;
                          -webkit-box-orient: vertical;
                          overflow: hidden;
                          text-overflow: ellipsis;
                          line-height: 1.4;
                        `}
                      >
                        {folder.description}
                      </Text>
                    )}
                    <Flex direction="row" alignItems="center" gap="size-50">
                      <Icon svg={<Icons.FileOutline />} size="S" />
                      <Text color="text-700" size="S">
                        {promptCount} {promptCount === 1 ? "prompt" : "prompts"}
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
              </div>
            );
          })}
        </Flex>
      </Flex>
    </View>
  );
}
