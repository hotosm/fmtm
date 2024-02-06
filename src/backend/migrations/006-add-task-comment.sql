-- ## Migration to create task_comment table

-- ## Apply Migration
-- Start a transaction
BEGIN;

-- Create the 'task_comment' table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.task_comment (
    id SERIAL PRIMARY KEY,
    task_id INT NOT NULL,
    project_id INT NOT NULL,
    comment_text TEXT NOT NULL,
    commented_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Add foreign key constraint for task_id referencing a task table
    CONSTRAINT fk_task_id FOREIGN KEY (task_id, project_id) REFERENCES tasks(id, project_id),

    -- Add foreign key constraint for project_id referencing a project table
    CONSTRAINT fk_project_id FOREIGN KEY (project_id) REFERENCES projects(id),

    -- Add foreign key constraint for user_id referencing a user table
    CONSTRAINT fk_user_id FOREIGN KEY (commented_by) REFERENCES users(id)

);
ALTER TABLE public.task_comment OWNER TO fmtm;

-- Commit the transaction
COMMIT;

