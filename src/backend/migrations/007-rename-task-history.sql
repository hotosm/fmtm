-- ## Migration to:
-- * Rename table task_history --> task_events.
-- * Rename columns https://github.com/hotosm/fmtm/issues/1610

-- Start a transaction
BEGIN;


-- Rename table
ALTER TABLE IF EXISTS public.task_history RENAME TO task_events;



-- Create new enums

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'taskevent') THEN
    CREATE TYPE public.taskevent AS ENUM (
        'MAP',
        'FINISH',
        'VALIDATE',
        'GOOD',
        'BAD',
        'SPLIT',
        'MERGE',
        'ASSIGN',
        'COMMENT'
    );
  END IF;
END $$;
ALTER TYPE public.taskevent OWNER TO fmtm;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'entityevent') THEN
    CREATE TYPE public.entitystate AS ENUM (
        'READY',
        'OPEN_IN_ODK',
        'SURVEY_SUBMITTED',
        'MARKED_BAD'
    );
  END IF;
END $$;
ALTER TYPE public.entitystate OWNER TO fmtm;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mappingstate') THEN
    CREATE TYPE public.mappingstate AS ENUM (
        'UNLOCKED_TO_MAP',
        'LOCKED_FOR_MAPPING',
        'UNLOCKED_TO_VALIDATE',
        'LOCKED_FOR_VALIDATION',
        'UNLOCKED_DONE'
    );
  END IF;
END $$;
ALTER TYPE public.mappingstate OWNER TO fmtm;



-- Update task_events field names and types

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'task_events' AND column_name = 'action') THEN
        ALTER TABLE public.task_events RENAME COLUMN action TO event;
        -- Change from taskaction --> taskevent
        ALTER TABLE task_events
            ALTER COLUMN event TYPE public.taskevent
            USING CASE event
                WHEN 'RELEASED_FOR_MAPPING' THEN 'BAD'::public.taskevent
                WHEN 'LOCKED_FOR_MAPPING' THEN 'MAP'::public.taskevent
                WHEN 'MARKED_MAPPED' THEN 'FINISH'::public.taskevent
                WHEN 'LOCKED_FOR_VALIDATION' THEN 'VALIDATE'::public.taskevent
                WHEN 'VALIDATED' THEN 'GOOD'::public.taskevent
                WHEN 'MARKED_INVALID' THEN 'BAD'::public.taskevent
                WHEN 'MARKED_BAD' THEN 'BAD'::public.taskevent
                WHEN 'SPLIT_NEEDED' THEN 'SPLIT'::public.taskevent
                WHEN 'RECREATED' THEN 'BAD'::public.taskevent
                WHEN 'COMMENT' THEN 'COMMENT'::public.taskevent
                ELSE NULL
            END;
        ALTER TABLE public.task_events RENAME COLUMN action_text TO comment;
        ALTER TABLE public.task_events RENAME COLUMN action_date TO created_at;
    END IF;
END $$;



-- Drop old enums

DROP TYPE IF EXISTS public.taskaction;
-- Note this no longer used
DROP TYPE IF EXISTS public.taskstatus;



-- Add task_events foreign keys

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_projects') THEN
        ALTER TABLE ONLY public.task_events
            ADD CONSTRAINT fk_projects FOREIGN KEY (project_id)
            REFERENCES public.projects (id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_project_task_id') THEN
        ALTER TABLE ONLY public.task_events
            ADD CONSTRAINT fk_project_task_id FOREIGN KEY (task_id, project_id)
            REFERENCES public.tasks (id, project_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_users') THEN
        ALTER TABLE ONLY public.task_events
            ADD CONSTRAINT fk_users FOREIGN KEY (user_id)
            REFERENCES public.users (id);
    END IF;
END $$;

-- Commit the transaction
COMMIT;
