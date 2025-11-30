import { useState, useCallback } from "react";
import { graphql, useMutation } from "react-relay";

import {
  Button,
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTitleExtra,
  Flex,
  Form,
  TextField,
  TextArea,
  Input,
  Label,
  Modal,
  ModalOverlay,
  View,
} from "@phoenix/components";
import { useNotifyError, useNotifySuccess } from "@phoenix/contexts";

import { CreateFolderDialogMutation } from "./__generated__/CreateFolderDialogMutation.graphql";

export function CreateFolderDialog({
  onCreated,
}: {
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#5bdbff");

  const [commit, isCommitting] = useMutation<CreateFolderDialogMutation>(
    graphql`
      mutation CreateFolderDialogMutation(
        $name: String!
        $description: String
        $color: String!
      ) {
        createPromptFolder(
          input: { name: $name, description: $description, color: $color }
        ) {
          id
          name
          description
          color
        }
      }
    `
  );

  const notifySuccess = useNotifySuccess();
  const notifyError = useNotifyError();

  const handleCreate = useCallback(() => {
    if (!name.trim()) {
      notifyError({
        title: "Validation Error",
        message: "Folder name is required",
      });
      return;
    }

    commit({
      variables: {
        name: name.trim(),
        description: description.trim() || null,
        color,
      },
      onCompleted: () => {
        notifySuccess({
          title: "Folder Created",
          message: `Folder "${name}" has been created successfully.`,
        });
        onCreated();
      },
      onError: (error) => {
        notifyError({
          title: "Failed to create folder",
          message: error.message,
        });
      },
    });
  }, [commit, notifyError, notifySuccess, onCreated, name, description, color]);

  return (
    <ModalOverlay>
      <Modal size="M">
        <Dialog>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
              <DialogTitleExtra>
                <DialogCloseButton slot="close" />
              </DialogTitleExtra>
            </DialogHeader>
            <Form>
              <View padding="size-200">
                <Flex direction="column" gap="size-200">
                  <TextField value={name} onChange={setName} isRequired>
                    <Label>Folder Name</Label>
                    <Input placeholder="Enter folder name" />
                  </TextField>
                  <TextField value={description} onChange={setDescription}>
                    <Label>Description</Label>
                    <TextArea placeholder="Enter folder description (optional)" />
                  </TextField>
                  <TextField value={color} onChange={setColor}>
                    <Label>Color</Label>
                    <Input type="color" />
                  </TextField>
                </Flex>
              </View>
              <View
                paddingEnd="size-200"
                paddingTop="size-100"
                paddingBottom="size-100"
                borderTopWidth="thin"
                borderTopColor="grey-300"
              >
                <Flex direction="row" gap="size-100" justifyContent="end">
                  <DialogCloseButton>
                    <Button variant="default">Cancel</Button>
                  </DialogCloseButton>
                  <Button
                    variant="primary"
                    onPress={handleCreate}
                    loading={isCommitting}
                    disabled={!name.trim()}
                  >
                    Create Folder
                  </Button>
                </Flex>
              </View>
            </Form>
          </DialogContent>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
