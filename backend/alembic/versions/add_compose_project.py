"""Add ComposeProject table

Revision ID: add_compose_project
Revises:
Create Date: 2026-05-20

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_compose_project'
down_revision = 'c69ce46a46c3'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'compose_projects',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('project_name', sa.String(), nullable=False),
        sa.Column('yaml_content', sa.Text(), nullable=False),
        sa.Column('status', sa.String(), nullable=True, server_default='pending'),
        sa.Column('owner_username', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_compose_projects_id'), 'compose_projects', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_compose_projects_id'), table_name='compose_projects')
    op.drop_table('compose_projects')
