/**
 * @generated SignedSource<<29ed72fa5b5d00b8790bf8cdaf26264a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateFolderDialogMutation$variables = {
  color: string;
  description?: string | null;
  name: string;
};
export type CreateFolderDialogMutation$data = {
  readonly createPromptFolder: {
    readonly color: string;
    readonly description: string | null;
    readonly id: string;
    readonly name: string;
  };
};
export type CreateFolderDialogMutation = {
  response: CreateFolderDialogMutation$data;
  variables: CreateFolderDialogMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "color"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "description"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "name"
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "fields": [
          {
            "kind": "Variable",
            "name": "color",
            "variableName": "color"
          },
          {
            "kind": "Variable",
            "name": "description",
            "variableName": "description"
          },
          {
            "kind": "Variable",
            "name": "name",
            "variableName": "name"
          }
        ],
        "kind": "ObjectValue",
        "name": "input"
      }
    ],
    "concreteType": "PromptFolder",
    "kind": "LinkedField",
    "name": "createPromptFolder",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "description",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "color",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "CreateFolderDialogMutation",
    "selections": (v3/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "CreateFolderDialogMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "06bf6f59c51df11555b88f8a2a2cdcae",
    "id": null,
    "metadata": {},
    "name": "CreateFolderDialogMutation",
    "operationKind": "mutation",
    "text": "mutation CreateFolderDialogMutation(\n  $name: String!\n  $description: String\n  $color: String!\n) {\n  createPromptFolder(input: {name: $name, description: $description, color: $color}) {\n    id\n    name\n    description\n    color\n  }\n}\n"
  }
};
})();

(node as any).hash = "30fc80caafc0142e1fcd841589b0eb89";

export default node;
