"""add prompt folders

Revision ID: add_prompt_folders
Revises: deb2c81c0bb2
Create Date: 2025-11-23

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

_Integer = sa.Integer().with_variant(
    sa.BigInteger(),
    "postgresql",
)

# revision identifiers, used by Alembic.
revision: str = "add_prompt_folders"
down_revision: Union[str, None] = "deb2c81c0bb2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create prompt_folders table
    op.create_table(
        "prompt_folders",
        sa.Column("id", _Integer, nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("description", sa.String(), nullable=True),
        sa.Column("color", sa.String(), nullable=False, server_default="#5bdbff"),
        sa.Column("parent_folder_id", _Integer, nullable=True),
        sa.Column("created_at", sa.TIMESTAMP(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.TIMESTAMP(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(
            ["parent_folder_id"],
            ["prompt_folders.id"],
            name="fk_prompt_folders_parent_folder_id_prompt_folders",
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name="pk_prompt_folders"),
    )

    # Create indices for prompt_folders
    op.create_index("ix_prompt_folders_name", "prompt_folders", ["name"])
    op.create_index(
        "ix_prompt_folders_parent_folder_id", "prompt_folders", ["parent_folder_id"]
    )

    # Add folder_id column to prompts table using batch mode for SQLite
    with op.batch_alter_table("prompts") as batch_op:
        batch_op.add_column(sa.Column("folder_id", _Integer, nullable=True))
        batch_op.create_foreign_key(
            "fk_prompts_folder_id_prompt_folders",
            "prompt_folders",
            ["folder_id"],
            ["id"],
            ondelete="SET NULL",
        )
        batch_op.create_index("ix_prompts_folder_id", ["folder_id"])


def downgrade() -> None:
    # Remove folder_id from prompts table using batch mode for SQLite
    with op.batch_alter_table("prompts") as batch_op:
        batch_op.drop_index("ix_prompts_folder_id")
        batch_op.drop_constraint("fk_prompts_folder_id_prompt_folders", type_="foreignkey")
        batch_op.drop_column("folder_id")

    # Drop prompt_folders table
    op.drop_index("ix_prompt_folders_parent_folder_id", table_name="prompt_folders")
    op.drop_index("ix_prompt_folders_name", table_name="prompt_folders")
    op.drop_table("prompt_folders")
