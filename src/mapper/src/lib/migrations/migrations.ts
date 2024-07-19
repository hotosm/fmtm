export default [
  {
    "statements": [
      "CREATE TABLE \"task_history\" (\n  \"project_id\" INTEGER,\n  \"task_id\" INTEGER NOT NULL,\n  \"action\" TEXT NOT NULL,\n  \"action_text\" TEXT,\n  \"action_date\" TEXT NOT NULL,\n  \"user_id\" INTEGER NOT NULL,\n  \"event_id\" TEXT NOT NULL,\n  CONSTRAINT \"task_history_pkey\" PRIMARY KEY (\"event_id\")\n);\n",
      "CREATE INDEX \"idx_task_history_composite\" ON \"task_history\" (\"task_id\" ASC, \"project_id\" ASC);\n",
      "CREATE INDEX \"idx_task_history_project_id_user_id\" ON \"task_history\" (\"user_id\" ASC, \"project_id\" ASC);\n",
      "CREATE INDEX \"ix_task_history_project_id\" ON \"task_history\" (\"project_id\" ASC);\n",
      "CREATE INDEX \"ix_task_history_user_id\" ON \"task_history\" (\"user_id\" ASC);\n",
      "INSERT OR IGNORE INTO _electric_trigger_settings (namespace, tablename, flag) VALUES ('main', 'task_history', 1);",
      "DROP TRIGGER IF EXISTS update_ensure_main_task_history_primarykey;",
      "CREATE TRIGGER update_ensure_main_task_history_primarykey\n  BEFORE UPDATE ON \"main\".\"task_history\"\nBEGIN\n  SELECT\n    CASE\n      WHEN old.\"event_id\" != new.\"event_id\" THEN\n      \t\tRAISE (ABORT, 'cannot change the value of column event_id as it belongs to the primary key')\n    END;\nEND;",
      "DROP TRIGGER IF EXISTS insert_main_task_history_into_oplog;",
      "CREATE TRIGGER insert_main_task_history_into_oplog\n   AFTER INSERT ON \"main\".\"task_history\"\n   WHEN 1 = (SELECT flag from _electric_trigger_settings WHERE namespace = 'main' AND tablename = 'task_history')\nBEGIN\n  INSERT INTO _electric_oplog (namespace, tablename, optype, primaryKey, newRow, oldRow, timestamp)\n  VALUES ('main', 'task_history', 'INSERT', json_patch('{}', json_object('event_id', new.\"event_id\")), json_object('action', new.\"action\", 'action_date', new.\"action_date\", 'action_text', new.\"action_text\", 'event_id', new.\"event_id\", 'project_id', new.\"project_id\", 'task_id', new.\"task_id\", 'user_id', cast(new.\"user_id\" as TEXT)), NULL, NULL);\nEND;",
      "DROP TRIGGER IF EXISTS update_main_task_history_into_oplog;",
      "CREATE TRIGGER update_main_task_history_into_oplog\n   AFTER UPDATE ON \"main\".\"task_history\"\n   WHEN 1 = (SELECT flag from _electric_trigger_settings WHERE namespace = 'main' AND tablename = 'task_history')\nBEGIN\n  INSERT INTO _electric_oplog (namespace, tablename, optype, primaryKey, newRow, oldRow, timestamp)\n  VALUES ('main', 'task_history', 'UPDATE', json_patch('{}', json_object('event_id', new.\"event_id\")), json_object('action', new.\"action\", 'action_date', new.\"action_date\", 'action_text', new.\"action_text\", 'event_id', new.\"event_id\", 'project_id', new.\"project_id\", 'task_id', new.\"task_id\", 'user_id', cast(new.\"user_id\" as TEXT)), json_object('action', old.\"action\", 'action_date', old.\"action_date\", 'action_text', old.\"action_text\", 'event_id', old.\"event_id\", 'project_id', old.\"project_id\", 'task_id', old.\"task_id\", 'user_id', cast(old.\"user_id\" as TEXT)), NULL);\nEND;",
      "DROP TRIGGER IF EXISTS delete_main_task_history_into_oplog;",
      "CREATE TRIGGER delete_main_task_history_into_oplog\n   AFTER DELETE ON \"main\".\"task_history\"\n   WHEN 1 = (SELECT flag from _electric_trigger_settings WHERE namespace = 'main' AND tablename = 'task_history')\nBEGIN\n  INSERT INTO _electric_oplog (namespace, tablename, optype, primaryKey, newRow, oldRow, timestamp)\n  VALUES ('main', 'task_history', 'DELETE', json_patch('{}', json_object('event_id', old.\"event_id\")), NULL, json_object('action', old.\"action\", 'action_date', old.\"action_date\", 'action_text', old.\"action_text\", 'event_id', old.\"event_id\", 'project_id', old.\"project_id\", 'task_id', old.\"task_id\", 'user_id', cast(old.\"user_id\" as TEXT)), NULL);\nEND;"
    ],
    "version": "20240724091137_052"
  }
]