import { useState } from "react";

import {
  Button,
  DebouncedSearch,
  DialogTrigger,
  Flex,
  Icon,
  Icons,
  View,
} from "@phoenix/components";
import { CanModify } from "@phoenix/components/auth";
import { usePromptsFilterContext } from "@phoenix/pages/prompts/PromptsFilterProvider";
import { PromptsLabelMenu } from "@phoenix/pages/prompts/PromptsLabelMenu";

import { CreateFolderDialog } from "./CreateFolderDialog";

export function PromptsFilterBar() {
  const {
    setFilter,
    filter,
    selectedPromptLabelIds,
    setSelectedPromptLabelIds,
  } = usePromptsFilterContext();

  return (
    <View
      padding="size-200"
      borderBottomWidth="thin"
      borderBottomColor="grey-200"
      flex="none"
    >
      <Flex
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap="size-100"
      >
        <DebouncedSearch
          aria-label="Search prompts by name"
          onChange={setFilter}
          defaultValue={filter}
          placeholder="Search prompts by name"
        />
        <Flex direction="row" alignItems="center" gap="size-100" flex="none">
          <PromptsLabelMenu
            selectedLabelIds={selectedPromptLabelIds}
            onSelectionChange={setSelectedPromptLabelIds}
          />
          <CanModify>
            <DialogTrigger>
              <Button
                size="M"
                leadingVisual={<Icon svg={<Icons.PlusOutline />} />}
                variant="default"
              >
                New Folder
              </Button>
              <CreateFolderDialog
                onCreated={() => {
                  window.location.reload();
                }}
              />
            </DialogTrigger>
          </CanModify>
        </Flex>
      </Flex>
    </View>
  );
}
