export default [
  {
    "statements": [
      "CREATE TABLE \"tasks_electric\" (\n  \"id\" INTEGER NOT NULL,\n  \"project_id\" INTEGER NOT NULL,\n  \"project_task_index\" INTEGER,\n  \"project_task_name\" TEXT,\n  \"geometry_geojson\" TEXT,\n  \"feature_count\" INTEGER,\n  \"task_status\" TEXT,\n  \"locked_by\" INTEGER,\n  \"mapped_by\" INTEGER,\n  \"validated_by\" INTEGER,\n  CONSTRAINT \"tasks_pkey_1\" PRIMARY KEY (\"id\", \"project_id\")\n);\n",
      "CREATE INDEX \"ix_tasks_locked_by_1\" ON \"tasks_electric\" (\"locked_by\" ASC);\n",
      "CREATE INDEX \"ix_tasks_mapped_by_1\" ON \"tasks_electric\" (\"mapped_by\" ASC);\n",
      "CREATE INDEX \"ix_tasks_project_id_1\" ON \"tasks_electric\" (\"project_id\" ASC);\n",
      "CREATE INDEX \"ix_tasks_validated_by_1\" ON \"tasks_electric\" (\"validated_by\" ASC);\n",
      "INSERT OR IGNORE INTO _electric_trigger_settings (namespace, tablename, flag) VALUES ('main', 'tasks_electric', 1);",
      "DROP TRIGGER IF EXISTS update_ensure_main_tasks_electric_primarykey;",
      "CREATE TRIGGER update_ensure_main_tasks_electric_primarykey\n  BEFORE UPDATE ON \"main\".\"tasks_electric\"\nBEGIN\n  SELECT\n    CASE\n      WHEN old.\"id\" != new.\"id\" THEN\n      \t\tRAISE (ABORT, 'cannot change the value of column id as it belongs to the primary key')\n      WHEN old.\"project_id\" != new.\"project_id\" THEN\n      \t\tRAISE (ABORT, 'cannot change the value of column project_id as it belongs to the primary key')\n    END;\nEND;",
      "DROP TRIGGER IF EXISTS insert_main_tasks_electric_into_oplog;",
      "CREATE TRIGGER insert_main_tasks_electric_into_oplog\n   AFTER INSERT ON \"main\".\"tasks_electric\"\n   WHEN 1 = (SELECT flag from _electric_trigger_settings WHERE namespace = 'main' AND tablename = 'tasks_electric')\nBEGIN\n  INSERT INTO _electric_oplog (namespace, tablename, optype, primaryKey, newRow, oldRow, timestamp)\n  VALUES ('main', 'tasks_electric', 'INSERT', json_patch('{}', json_object('id', new.\"id\", 'project_id', new.\"project_id\")), json_object('feature_count', new.\"feature_count\", 'geometry_geojson', new.\"geometry_geojson\", 'id', new.\"id\", 'locked_by', cast(new.\"locked_by\" as TEXT), 'mapped_by', cast(new.\"mapped_by\" as TEXT), 'project_id', new.\"project_id\", 'project_task_index', new.\"project_task_index\", 'project_task_name', new.\"project_task_name\", 'task_status', new.\"task_status\", 'validated_by', cast(new.\"validated_by\" as TEXT)), NULL, NULL);\nEND;",
      "DROP TRIGGER IF EXISTS update_main_tasks_electric_into_oplog;",
      "CREATE TRIGGER update_main_tasks_electric_into_oplog\n   AFTER UPDATE ON \"main\".\"tasks_electric\"\n   WHEN 1 = (SELECT flag from _electric_trigger_settings WHERE namespace = 'main' AND tablename = 'tasks_electric')\nBEGIN\n  INSERT INTO _electric_oplog (namespace, tablename, optype, primaryKey, newRow, oldRow, timestamp)\n  VALUES ('main', 'tasks_electric', 'UPDATE', json_patch('{}', json_object('id', new.\"id\", 'project_id', new.\"project_id\")), json_object('feature_count', new.\"feature_count\", 'geometry_geojson', new.\"geometry_geojson\", 'id', new.\"id\", 'locked_by', cast(new.\"locked_by\" as TEXT), 'mapped_by', cast(new.\"mapped_by\" as TEXT), 'project_id', new.\"project_id\", 'project_task_index', new.\"project_task_index\", 'project_task_name', new.\"project_task_name\", 'task_status', new.\"task_status\", 'validated_by', cast(new.\"validated_by\" as TEXT)), json_object('feature_count', old.\"feature_count\", 'geometry_geojson', old.\"geometry_geojson\", 'id', old.\"id\", 'locked_by', cast(old.\"locked_by\" as TEXT), 'mapped_by', cast(old.\"mapped_by\" as TEXT), 'project_id', old.\"project_id\", 'project_task_index', old.\"project_task_index\", 'project_task_name', old.\"project_task_name\", 'task_status', old.\"task_status\", 'validated_by', cast(old.\"validated_by\" as TEXT)), NULL);\nEND;",
      "DROP TRIGGER IF EXISTS delete_main_tasks_electric_into_oplog;",
      "CREATE TRIGGER delete_main_tasks_electric_into_oplog\n   AFTER DELETE ON \"main\".\"tasks_electric\"\n   WHEN 1 = (SELECT flag from _electric_trigger_settings WHERE namespace = 'main' AND tablename = 'tasks_electric')\nBEGIN\n  INSERT INTO _electric_oplog (namespace, tablename, optype, primaryKey, newRow, oldRow, timestamp)\n  VALUES ('main', 'tasks_electric', 'DELETE', json_patch('{}', json_object('id', old.\"id\", 'project_id', old.\"project_id\")), NULL, json_object('feature_count', old.\"feature_count\", 'geometry_geojson', old.\"geometry_geojson\", 'id', old.\"id\", 'locked_by', cast(old.\"locked_by\" as TEXT), 'mapped_by', cast(old.\"mapped_by\" as TEXT), 'project_id', old.\"project_id\", 'project_task_index', old.\"project_task_index\", 'project_task_name', old.\"project_task_name\", 'task_status', old.\"task_status\", 'validated_by', cast(old.\"validated_by\" as TEXT)), NULL);\nEND;"
    ],
    "version": "20240623205608_952"
  }
]