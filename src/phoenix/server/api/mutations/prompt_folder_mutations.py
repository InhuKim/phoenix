from typing import Any, Optional

import strawberry
from sqlalchemy import delete, select, update
from sqlalchemy.exc import IntegrityError as PostgreSQLIntegrityError
from sqlite3 import IntegrityError as SQLiteIntegrityError
from strawberry import UNSET
from strawberry.relay.types import GlobalID
from strawberry.types import Info

from phoenix.db import models
from phoenix.server.api.auth import IsNotReadOnly, IsNotViewer
from phoenix.server.api.context import Context
from phoenix.server.api.exceptions import BadRequest, Conflict, NotFound
from phoenix.server.api.queries import Query
from phoenix.server.api.types.node import from_global_id_with_expected_type
from phoenix.server.api.types.PromptFolder import PromptFolder


@strawberry.input
class CreatePromptFolderInput:
    name: str
    description: Optional[str] = None
    color: str = "#5bdbff"
    parent_folder_id: Optional[GlobalID] = None


@strawberry.input
class UpdatePromptFolderInput:
    folder_id: GlobalID
    name: Optional[str] = UNSET
    description: Optional[str] = UNSET
    color: Optional[str] = UNSET
    parent_folder_id: Optional[GlobalID] = UNSET


@strawberry.input
class DeletePromptFolderInput:
    folder_id: GlobalID


@strawberry.input
class MovePromptToFolderInput:
    prompt_id: GlobalID
    folder_id: Optional[GlobalID] = None


@strawberry.type
class DeletePromptFolderMutationPayload:
    query: Query


@strawberry.type
class PromptFolderMutationMixin:
    @strawberry.mutation(permission_classes=[IsNotReadOnly, IsNotViewer])  # type: ignore
    async def create_prompt_folder(
        self, info: Info[Context, None], input: CreatePromptFolderInput
    ) -> PromptFolder:
        parent_folder_id: Optional[int] = None
        if input.parent_folder_id is not None:
            parent_folder_id = from_global_id_with_expected_type(
                global_id=input.parent_folder_id, expected_type_name="PromptFolder"
            )

        folder = models.PromptFolder(
            name=input.name,
            description=input.description,
            color=input.color,
            parent_folder_id=parent_folder_id,
        )

        async with info.context.db() as session:
            session.add(folder)
            try:
                await session.commit()
            except (PostgreSQLIntegrityError, SQLiteIntegrityError):
                raise Conflict(f"A folder named '{input.name}' already exists")

        return PromptFolder.from_db(folder)

    @strawberry.mutation(permission_classes=[IsNotReadOnly, IsNotViewer])  # type: ignore
    async def update_prompt_folder(
        self, info: Info[Context, None], input: UpdatePromptFolderInput
    ) -> PromptFolder:
        folder_id = from_global_id_with_expected_type(
            global_id=input.folder_id, expected_type_name="PromptFolder"
        )

        values: dict[str, Any] = {}
        if input.name is not UNSET:
            values["name"] = input.name
        if input.description is not UNSET:
            values["description"] = input.description
        if input.color is not UNSET:
            values["color"] = input.color
        if input.parent_folder_id is not UNSET:
            if input.parent_folder_id is None:
                values["parent_folder_id"] = None
            else:
                parent_folder_id = from_global_id_with_expected_type(
                    global_id=input.parent_folder_id, expected_type_name="PromptFolder"
                )
                values["parent_folder_id"] = parent_folder_id

        if not values:
            raise BadRequest("No fields provided to update")

        async with info.context.db() as session:
            stmt = (
                update(models.PromptFolder)
                .where(models.PromptFolder.id == folder_id)
                .values(**values)
                .returning(models.PromptFolder)
            )

            result = await session.execute(stmt)
            folder = result.scalar_one_or_none()

            if folder is None:
                raise NotFound(f"Folder with ID '{input.folder_id}' not found")

            await session.commit()

        return PromptFolder.from_db(folder)

    @strawberry.mutation(permission_classes=[IsNotReadOnly, IsNotViewer])  # type: ignore
    async def delete_prompt_folder(
        self, info: Info[Context, None], input: DeletePromptFolderInput
    ) -> DeletePromptFolderMutationPayload:
        folder_id = from_global_id_with_expected_type(
            global_id=input.folder_id, expected_type_name="PromptFolder"
        )

        async with info.context.db() as session:
            stmt = delete(models.PromptFolder).where(models.PromptFolder.id == folder_id)
            result = await session.execute(stmt)

            if result.rowcount == 0:  # type: ignore[attr-defined]
                raise NotFound(f"Folder with ID '{input.folder_id}' not found")

            await session.commit()

        return DeletePromptFolderMutationPayload(query=Query())

    @strawberry.mutation(permission_classes=[IsNotReadOnly, IsNotViewer])  # type: ignore
    async def move_prompt_to_folder(
        self, info: Info[Context, None], input: MovePromptToFolderInput
    ) -> strawberry.scalars.JSON:
        from phoenix.server.api.types.Prompt import Prompt

        prompt_id = from_global_id_with_expected_type(
            global_id=input.prompt_id, expected_type_name=Prompt.__name__
        )

        folder_id: Optional[int] = None
        if input.folder_id is not None:
            folder_id = from_global_id_with_expected_type(
                global_id=input.folder_id, expected_type_name="PromptFolder"
            )

        async with info.context.db() as session:
            stmt = (
                update(models.Prompt)
                .where(models.Prompt.id == prompt_id)
                .values(folder_id=folder_id)
            )

            result = await session.execute(stmt)

            if result.rowcount == 0:  # type: ignore[attr-defined]
                raise NotFound(f"Prompt with ID '{input.prompt_id}' not found")

            await session.commit()

        return {"success": True, "prompt_id": str(input.prompt_id), "folder_id": str(input.folder_id) if input.folder_id else None}
