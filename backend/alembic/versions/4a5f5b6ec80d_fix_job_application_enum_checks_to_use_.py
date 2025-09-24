"""fix job/application enum checks to use values

Revision ID: 4a5f5b6ec80d
Revises: 6d1d6e6fcdcc
Create Date: 2025-09-24 13:03:43.746570

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4a5f5b6ec80d'
down_revision: Union[str, Sequence[str], None] = '6d1d6e6fcdcc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
