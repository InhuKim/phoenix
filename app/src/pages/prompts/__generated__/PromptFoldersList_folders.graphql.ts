/**
 * @generated SignedSource<<e4e8e29f2e1f51324ca8e4316817fbe2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PromptFoldersList_folders$data = {
  readonly promptFolders: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly color: string;
        readonly description: string | null;
        readonly id: string;
        readonly name: string;
        readonly prompts: ReadonlyArray<{
          readonly id: string;
        }>;
      };
    }>;
  };
  readonly " $fragmentType": "PromptFoldersList_folders";
};
export type PromptFoldersList_folders$key = {
  readonly " $data"?: PromptFoldersList_folders$data;
  readonly " $fragmentSpreads": FragmentRefs<"PromptFoldersList_folders">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PromptFoldersList_folders",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 100
        }
      ],
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
                (v0/*: any*/),
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
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Prompt",
                  "kind": "LinkedField",
                  "name": "prompts",
                  "plural": true,
                  "selections": [
                    (v0/*: any*/)
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
  ],
  "type": "Query",
  "abstractKey": null
};
})();

(node as any).hash = "bcac0cdda613fcd0d18cbb52f7204211";

export default node;
