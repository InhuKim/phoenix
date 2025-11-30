import { Flex, Text, View } from "@phoenix/components";

export function PromptsEmpty() {
  return (
    <View width="100%" paddingY="size-400">
      <Flex
        direction="column"
        width="100%"
        alignItems="center"
        justifyContent="center"
      >
        <View width="100%" maxWidth="780px">
          <Flex direction="column" gap="size-400" alignItems="center">
            <Text size="XL">
              Create and manage prompt templates for your AI applications.
            </Text>
          </Flex>
        </View>
      </Flex>
    </View>
  );
}
