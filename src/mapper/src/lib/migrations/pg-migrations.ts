export default [
  {
    "statements": [
      "CREATE TYPE taskaction AS ENUM (\n 'RELEASED_FOR_MAPPING',\n 'LOCKED_FOR_MAPPING',\n 'MARKED_MAPPED',\n 'LOCKED_FOR_VALIDATION',\n 'VALIDATED',\n 'MARKED_INVALID',\n 'MARKED_BAD',\n 'SPLIT_NEEDED',\n 'RECREATED',\n 'COMMENT'\n)",
      "CREATE TABLE task_history (\n    project_id integer,\n    task_id integer NOT NULL,\n    action taskaction NOT NULL,\n    action_text character varying,\n    action_date timestamp without time zone NOT NULL,\n    user_id bigint NOT NULL,\n    event_id uuid NOT NULL,\n    CONSTRAINT task_history_pkey PRIMARY KEY (event_id)\n)",
      "CREATE INDEX idx_task_history_composite ON public.task_history USING btree (task_id, project_id)",
      "CREATE INDEX idx_task_history_project_id_user_id ON public.task_history USING btree (user_id, project_id)",
      "CREATE INDEX ix_task_history_project_id ON public.task_history USING btree (project_id)",
      "CREATE INDEX ix_task_history_user_id ON public.task_history USING btree (user_id)",
      "INSERT INTO \"public\".\"_electric_trigger_settings\" (\"namespace\", \"tablename\", \"flag\")\n  VALUES ('public', 'task_history', 1)\n  ON CONFLICT DO NOTHING;",
      "DROP TRIGGER IF EXISTS update_ensure_public_task_history_primarykey ON \"public\".\"task_history\";",
      "CREATE OR REPLACE FUNCTION update_ensure_public_task_history_primarykey_function()\nRETURNS TRIGGER AS $$\nBEGIN\n  IF OLD.\"event_id\" IS DISTINCT FROM NEW.\"event_id\" THEN\n    RAISE EXCEPTION 'Cannot change the value of column event_id as it belongs to the primary key';\n  END IF;\n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql;",
      "CREATE TRIGGER update_ensure_public_task_history_primarykey\n  BEFORE UPDATE ON \"public\".\"task_history\"\n    FOR EACH ROW\n      EXECUTE FUNCTION update_ensure_public_task_history_primarykey_function();",
      "DROP TRIGGER IF EXISTS insert_public_task_history_into_oplog ON \"public\".\"task_history\";",
      "    CREATE OR REPLACE FUNCTION insert_public_task_history_into_oplog_function()\n    RETURNS TRIGGER AS $$\n    BEGIN\n      DECLARE\n        flag_value INTEGER;\n      BEGIN\n        -- Get the flag value from _electric_trigger_settings\n        SELECT flag INTO flag_value FROM \"public\"._electric_trigger_settings WHERE namespace = 'public' AND tablename = 'task_history';\n\n        IF flag_value = 1 THEN\n          -- Insert into _electric_oplog\n          INSERT INTO \"public\"._electric_oplog (namespace, tablename, optype, \"primaryKey\", \"newRow\", \"oldRow\", timestamp)\n          VALUES (\n            'public',\n            'task_history',\n            'INSERT',\n            json_strip_nulls(json_build_object('event_id', new.\"event_id\")),\n            jsonb_build_object('action', new.\"action\", 'action_date', new.\"action_date\", 'action_text', new.\"action_text\", 'event_id', new.\"event_id\", 'project_id', new.\"project_id\", 'task_id', new.\"task_id\", 'user_id', cast(new.\"user_id\" as TEXT)),\n            NULL,\n            NULL\n          );\n        END IF;\n\n        RETURN NEW;\n      END;\n    END;\n    $$ LANGUAGE plpgsql;",
      "CREATE TRIGGER insert_public_task_history_into_oplog\n  AFTER INSERT ON \"public\".\"task_history\"\n    FOR EACH ROW\n      EXECUTE FUNCTION insert_public_task_history_into_oplog_function();",
      "DROP TRIGGER IF EXISTS update_public_task_history_into_oplog ON \"public\".\"task_history\";",
      "    CREATE OR REPLACE FUNCTION update_public_task_history_into_oplog_function()\n    RETURNS TRIGGER AS $$\n    BEGIN\n      DECLARE\n        flag_value INTEGER;\n      BEGIN\n        -- Get the flag value from _electric_trigger_settings\n        SELECT flag INTO flag_value FROM \"public\"._electric_trigger_settings WHERE namespace = 'public' AND tablename = 'task_history';\n\n        IF flag_value = 1 THEN\n          -- Insert into _electric_oplog\n          INSERT INTO \"public\"._electric_oplog (namespace, tablename, optype, \"primaryKey\", \"newRow\", \"oldRow\", timestamp)\n          VALUES (\n            'public',\n            'task_history',\n            'UPDATE',\n            json_strip_nulls(json_build_object('event_id', new.\"event_id\")),\n            jsonb_build_object('action', new.\"action\", 'action_date', new.\"action_date\", 'action_text', new.\"action_text\", 'event_id', new.\"event_id\", 'project_id', new.\"project_id\", 'task_id', new.\"task_id\", 'user_id', cast(new.\"user_id\" as TEXT)),\n            jsonb_build_object('action', old.\"action\", 'action_date', old.\"action_date\", 'action_text', old.\"action_text\", 'event_id', old.\"event_id\", 'project_id', old.\"project_id\", 'task_id', old.\"task_id\", 'user_id', cast(old.\"user_id\" as TEXT)),\n            NULL\n          );\n        END IF;\n\n        RETURN NEW;\n      END;\n    END;\n    $$ LANGUAGE plpgsql;",
      "CREATE TRIGGER update_public_task_history_into_oplog\n  AFTER UPDATE ON \"public\".\"task_history\"\n    FOR EACH ROW\n      EXECUTE FUNCTION update_public_task_history_into_oplog_function();",
      "DROP TRIGGER IF EXISTS delete_public_task_history_into_oplog ON \"public\".\"task_history\";",
      "    CREATE OR REPLACE FUNCTION delete_public_task_history_into_oplog_function()\n    RETURNS TRIGGER AS $$\n    BEGIN\n      DECLARE\n        flag_value INTEGER;\n      BEGIN\n        -- Get the flag value from _electric_trigger_settings\n        SELECT flag INTO flag_value FROM \"public\"._electric_trigger_settings WHERE namespace = 'public' AND tablename = 'task_history';\n\n        IF flag_value = 1 THEN\n          -- Insert into _electric_oplog\n          INSERT INTO \"public\"._electric_oplog (namespace, tablename, optype, \"primaryKey\", \"newRow\", \"oldRow\", timestamp)\n          VALUES (\n            'public',\n            'task_history',\n            'DELETE',\n            json_strip_nulls(json_build_object('event_id', old.\"event_id\")),\n            NULL,\n            jsonb_build_object('action', old.\"action\", 'action_date', old.\"action_date\", 'action_text', old.\"action_text\", 'event_id', old.\"event_id\", 'project_id', old.\"project_id\", 'task_id', old.\"task_id\", 'user_id', cast(old.\"user_id\" as TEXT)),\n            NULL\n          );\n        END IF;\n\n        RETURN NEW;\n      END;\n    END;\n    $$ LANGUAGE plpgsql;",
      "CREATE TRIGGER delete_public_task_history_into_oplog\n  AFTER DELETE ON \"public\".\"task_history\"\n    FOR EACH ROW\n      EXECUTE FUNCTION delete_public_task_history_into_oplog_function();"
    ],
    "version": "20240724091137_052"
  }
]