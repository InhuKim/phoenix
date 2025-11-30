import { useState } from "react";

import {
  Button,
  DebouncedSearch,
  Flex,
  Icon,
  Icons,
  View,
} from "@phoenix/components";
import { CanModify } from "@phoenix/components/auth";

type PromptFolderFilterBarProps = {
  onFilterChange: (filter: string) => void;
  onNewPrompt: () => void;
  defaultFilter?: string;
};

export function PromptFolderFilterBar({
  onFilterChange,
  onNewPrompt,
  defaultFilter = "",
}: PromptFolderFilterBarProps) {
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
          onChange={onFilterChange}
          defaultValue={defaultFilter}
          placeholder="Search prompts by name"
        />
        <Flex direction="row" alignItems="center" gap="size-100" flex="none">
          <CanModify>
            <Button
              size="M"
              leadingVisual={<Icon svg={<Icons.PlusOutline />} />}
              variant="default"
              onPress={onNewPrompt}
            >
              New Prompt
            </Button>
          </CanModify>
        </Flex>
      </Flex>
    </View>
  );
}
