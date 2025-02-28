-- Begin transaction
BEGIN;

-- Create task_assignments table only if it does not exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'task_assignments') THEN
        CREATE TABLE public.task_assignments (
            project_id INTEGER NOT NULL,
            task_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            assigned_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
        ALTER TABLE public.task_assignments OWNER TO fmtm;
    END IF;
END$$;

-- Add primary key constraint if it does not exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'task_assignments' AND constraint_name = 'task_assignments_pkey') THEN
        ALTER TABLE ONLY public.task_assignments
        ADD CONSTRAINT task_assignments_pkey PRIMARY KEY (task_id, user_id);
    END IF;
END$$;

-- Add foreign key constraints if they do not exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'task_assignments' AND constraint_name = 'task_assignments_user_id_fkey') THEN
        ALTER TABLE ONLY public.task_assignments
        ADD CONSTRAINT task_assignments_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'task_assignments' AND constraint_name = 'task_assignments_project_id_fkey') THEN
        ALTER TABLE public.task_assignments
        ADD CONSTRAINT task_assignments_project_id_fkey FOREIGN KEY (project_id)
        REFERENCES public.projects (id) ON DELETE CASCADE;
    END IF;
END$$;

-- Commit transaction
COMMIT;
