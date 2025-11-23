import { useMemo, useState } from "react";
import { usePreloadedQuery } from "react-relay";
import { useLoaderData, useNavigate } from "react-router";
import { css } from "@emotion/react";
import invariant from "tiny-invariant";

import {
  Flex,
  Heading,
  Icon,
  Icons,
  Link,
  LinkButton,
  Token,
  View,
} from "@phoenix/components";
import { StopPropagation } from "@phoenix/components/StopPropagation";
import { selectableTableCSS } from "@phoenix/components/table/styles";
import { useTimeFormatters } from "@phoenix/hooks/useTimeFormatters";
import { useViewerCanModify } from "@phoenix/contexts";

import { PromptActionMenu } from "./PromptActionMenu";
import { PromptFolderFilterBar } from "./PromptFolderFilterBar";
import {
  promptFolderLoaderGql,
  PromptFolderLoaderType,
} from "./promptFolderLoader";

export function PromptFolderPage() {
  const loaderData = useLoaderData<PromptFolderLoaderType>();
  invariant(loaderData, "loaderData is required");
  const data = usePreloadedQuery(promptFolderLoaderGql, loaderData);
  const navigate = useNavigate();
  const canModify = useViewerCanModify();
  const [filter, setFilter] = useState("");
  const { fullTimeFormatter } = useTimeFormatters();

  const folder = data.promptFolder;

  const filteredPrompts = useMemo(() => {
    if (!folder) return [];
    if (!filter.trim()) return folder.prompts;

    const lowerFilter = filter.toLowerCase();
    return folder.prompts.filter((prompt) =>
      prompt.name.toLowerCase().includes(lowerFilter)
    );
  }, [folder, filter]);

  if (!folder) {
    return (
      <Flex
        direction="column"
        height="100%"
        alignItems="center"
        justifyContent="center"
      >
        <Heading>Folder not found</Heading>
      </Flex>
    );
  }

  return (
    <Flex direction="column" height="100%">
      <View
        padding="size-200"
        borderBottomWidth="thin"
        borderBottomColor="grey-200"
      >
        <Flex direction="row" gap="size-100" alignItems="center">
          <Icon
            svg={<Icons.FolderOutline />}
            color={folder.color}
            size="L"
          />
          <Flex direction="column" flex="1 1 auto">
            <Heading level={2}>{folder.name}</Heading>
            {folder.description && (
              <p
                css={css`
                  color: var(--ac-global-text-color-700);
                  margin: 0;
                `}
              >
                {folder.description}
              </p>
            )}
          </Flex>
        </Flex>
      </View>

      <PromptFolderFilterBar
        onFilterChange={setFilter}
        onNewPrompt={() => navigate(`/playground?folderId=${folder.id}`)}
        defaultFilter={filter}
      />

      <div
        css={css`
          flex: 1 1 auto;
          overflow: auto;
        `}
      >
        {filteredPrompts.length === 0 ? (
          <View padding="size-400">
            <p>
              {filter.trim()
                ? "No prompts match your search"
                : "No prompts in this folder"}
            </p>
          </View>
        ) : (
          <table css={selectableTableCSS}>
            <thead>
              <tr>
                <th>name</th>
                <th>labels</th>
                <th>description</th>
                <th>last updated</th>
                {canModify && <th></th>}
              </tr>
            </thead>
            <tbody>
              {filteredPrompts.map((prompt) => (
                <tr
                  key={prompt.id}
                  onClick={() => navigate(`/prompts/${prompt.id}`)}
                >
                  <td>
                    <Link to={`/prompts/${prompt.id}`}>{prompt.name}</Link>
                  </td>
                  <td>
                    <ul
                      css={css`
                        display: flex;
                        flex-direction: row;
                        gap: var(--ac-global-dimension-size-100);
                        list-style: none;
                        padding: 0;
                        margin: 0;
                      `}
                    >
                      {prompt.labels.map((label) => (
                        <Token key={label.id} color={label.color}>
                          {label.name}
                        </Token>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <span>{prompt.description || "--"}</span>
                  </td>
                  <td>
                    <time title={prompt.version.createdAt || ""}>
                      {prompt.version.createdAt
                        ? fullTimeFormatter(new Date(prompt.version.createdAt))
                        : "--"}
                    </time>
                  </td>
                  {canModify && (
                    <td>
                      <Flex
                        direction="row"
                        gap="size-100"
                        justifyContent="end"
                        width="100%"
                      >
                        <StopPropagation>
                          <LinkButton
                            leadingVisual={
                              <Icon svg={<Icons.PlayCircleOutline />} />
                            }
                            size="S"
                            aria-label="Open in playground"
                            to={`/prompts/${prompt.id}/playground`}
                          >
                            Playground
                          </LinkButton>
                        </StopPropagation>
                        <PromptActionMenu
                          promptId={prompt.id}
                          onDeleted={() => {
                            // Refresh the page or handle deletion
                            window.location.reload();
                          }}
                        />
                      </Flex>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Flex>
  );
}
