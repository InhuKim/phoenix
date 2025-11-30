from datetime import datetime
from typing import TYPE_CHECKING, Optional

import strawberry
from strawberry import UNSET
from strawberry.relay import Node, NodeID
from strawberry.types import Info

from phoenix.server.api.context import Context
from phoenix.server.api.types.Prompt import Prompt

if TYPE_CHECKING:
    from phoenix.db import models


@strawberry.type
class PromptFolder(Node):
    id: NodeID[int]
    name: str
    description: Optional[str]
    color: str
    parent_folder_id: Optional[strawberry.ID]
    created_at: datetime
    updated_at: datetime
    db_record: strawberry.Private[Optional["models.PromptFolder"]] = None

    @strawberry.field
    async def prompts(
        self,
        info: Info[Context, None],
    ) -> list[Prompt]:
        if self.db_record:
            return [Prompt(id=p.id, db_record=p) for p in self.db_record.prompts]
        return []

    @strawberry.field
    async def subfolders(
        self,
        info: Info[Context, None],
    ) -> list["PromptFolder"]:
        if self.db_record:
            return [PromptFolder.from_db(subfolder) for subfolder in self.db_record.subfolders]
        return []

    @strawberry.field
    async def parent_folder(
        self,
        info: Info[Context, None],
    ) -> Optional["PromptFolder"]:
        if self.db_record and self.db_record.parent_folder:
            return PromptFolder.from_db(self.db_record.parent_folder)
        return None

    @classmethod
    def from_db(cls, folder: "models.PromptFolder") -> "PromptFolder":
        return cls(
            id=folder.id,
            name=folder.name,
            description=folder.description,
            color=folder.color,
            parent_folder_id=(
                strawberry.ID(str(folder.parent_folder_id))
                if folder.parent_folder_id is not None
                else None
            ),
            created_at=folder.created_at,
            updated_at=folder.updated_at,
            db_record=folder,
        )
