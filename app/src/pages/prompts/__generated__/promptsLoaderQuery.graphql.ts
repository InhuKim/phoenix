/**
 * @generated SignedSource<<1458ed97b3e14f8b321c1e579aaf0a2f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type promptsLoaderQuery$variables = Record<PropertyKey, never>;
export type promptsLoaderQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"PromptFoldersList_folders" | "PromptsTable_prompts">;
};
export type promptsLoaderQuery = {
  response: promptsLoaderQuery$data;
  variables: promptsLoaderQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "color",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "promptsLoaderQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "PromptsTable_prompts"
      },
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "PromptFoldersList_folders"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "promptsLoaderQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "PromptConnection",
        "kind": "LinkedField",
        "name": "prompts",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "PromptEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": "prompt",
                "args": null,
                "concreteType": "Prompt",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  (v2/*: any*/),
                  (v3/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "PromptVersion",
                    "kind": "LinkedField",
                    "name": "version",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "createdAt",
                        "storageKey": null
                      },
                      (v1/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "PromptLabel",
                    "kind": "LinkedField",
                    "name": "labels",
                    "plural": true,
                    "selections": [
                      (v1/*: any*/),
                      (v2/*: any*/),
                      (v4/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "cursor",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Prompt",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "__typename",
                    "storageKey": null
                  },
                  (v1/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "PageInfo",
            "kind": "LinkedField",
            "name": "pageInfo",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "endCursor",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "hasNextPage",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "prompts(first:100)"
      },
      {
        "alias": null,
        "args": (v0/*: any*/),
        "filters": [
          "filter",
          "labelIds"
        ],
        "handle": "connection",
        "key": "PromptsTable_prompts",
        "kind": "LinkedHandle",
        "name": "prompts"
      },
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "PromptFolderConnection",
        "kind": "LinkedField",
        "name": "promptFolders",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "PromptFolderEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "PromptFolder",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Prompt",
                    "kind": "LinkedField",
                    "name": "prompts",
                    "plural": true,
                    "selections": [
                      (v1/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "promptFolders(first:100)"
      }
    ]
  },
  "params": {
    "cacheID": "9690c926bd5855e3f3d287c139b6e1c6",
    "id": null,
    "metadata": {},
    "name": "promptsLoaderQuery",
    "operationKind": "query",
    "text": "query promptsLoaderQuery {\n  ...PromptsTable_prompts\n  ...PromptFoldersList_folders\n}\n\nfragment PromptFoldersList_folders on Query {\n  promptFolders(first: 100) {\n    edges {\n      node {\n        id\n        name\n        description\n        color\n        prompts {\n          id\n        }\n      }\n    }\n  }\n}\n\nfragment PromptsTable_prompts on Query {\n  prompts(first: 100) {\n    edges {\n      prompt: node {\n        id\n        name\n        description\n        version {\n          createdAt\n          id\n        }\n        labels {\n          id\n          name\n          color\n        }\n      }\n      cursor\n      node {\n        __typename\n        id\n      }\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "b99bdc90dab1263eeddce8f87ea3e04c";

export default node;
