/**
 * @generated SignedSource<<9e0e4664f3ad6be126a2e1f90f28c39c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type promptFolderLoaderQuery$variables = {
  folderId: string;
};
export type promptFolderLoaderQuery$data = {
  readonly promptFolder: {
    readonly color: string;
    readonly createdAt: string;
    readonly description: string | null;
    readonly id: string;
    readonly name: string;
    readonly prompts: ReadonlyArray<{
      readonly description: string | null;
      readonly id: string;
      readonly labels: ReadonlyArray<{
        readonly color: string;
        readonly id: string;
        readonly name: string;
      }>;
      readonly name: string;
      readonly version: {
        readonly createdAt: string;
      };
    }>;
    readonly updatedAt: string;
  } | null;
};
export type promptFolderLoaderQuery = {
  response: promptFolderLoaderQuery$data;
  variables: promptFolderLoaderQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "folderId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "folderId",
    "variableName": "folderId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "color",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "updatedAt",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "concreteType": "PromptLabel",
  "kind": "LinkedField",
  "name": "labels",
  "plural": true,
  "selections": [
    (v2/*: any*/),
    (v3/*: any*/),
    (v5/*: any*/)
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "promptFolderLoaderQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "PromptFolder",
        "kind": "LinkedField",
        "name": "promptFolder",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Prompt",
            "kind": "LinkedField",
            "name": "prompts",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "PromptVersion",
                "kind": "LinkedField",
                "name": "version",
                "plural": false,
                "selections": [
                  (v6/*: any*/)
                ],
                "storageKey": null
              },
              (v8/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "promptFolderLoaderQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "PromptFolder",
        "kind": "LinkedField",
        "name": "promptFolder",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Prompt",
            "kind": "LinkedField",
            "name": "prompts",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "PromptVersion",
                "kind": "LinkedField",
                "name": "version",
                "plural": false,
                "selections": [
                  (v6/*: any*/),
                  (v2/*: any*/)
                ],
                "storageKey": null
              },
              (v8/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "bb3f10695de0b05050b88409e49db228",
    "id": null,
    "metadata": {},
    "name": "promptFolderLoaderQuery",
    "operationKind": "query",
    "text": "query promptFolderLoaderQuery(\n  $folderId: ID!\n) {\n  promptFolder(folderId: $folderId) {\n    id\n    name\n    description\n    color\n    createdAt\n    updatedAt\n    prompts {\n      id\n      name\n      description\n      version {\n        createdAt\n        id\n      }\n      labels {\n        id\n        name\n        color\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "0ff0d426e1f22ce3cfe848431f1932e1";

export default node;
