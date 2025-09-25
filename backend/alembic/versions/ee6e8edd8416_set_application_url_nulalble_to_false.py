from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "ee6e8edd8416"
down_revision = "ffe00db2e919"
branch_labels = None
depends_on = None

def upgrade():
    op.alter_column(
        "jobs",
        "application_url",
        existing_type=sa.String(),
        server_default="",
        existing_nullable=True,
    )

    op.execute("UPDATE jobs SET application_url = '' WHERE application_url IS NULL")

    op.alter_column(
        "jobs",
        "application_url",
        existing_type=sa.String(),
        nullable=False,
    )

    op.alter_column(
        "jobs",
        "application_url",
        existing_type=sa.String(),
        server_default=None,
    )

def downgrade():
    op.alter_column(
        "jobs",
        "application_url",
        existing_type=sa.String(),
        nullable=True,
    )
