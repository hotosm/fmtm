type ProjectInfo = {
	name: string;
	short_description: string;
	description: string;
	per_task_instructions: string;
};

type ProjectAuthor = {
	username: string;
	id: number;
};

export type ProjectTask = {
	id: number;
	project_id: number;
	project_task_index: number;
	project_task_name: string;
	feature_count: number;
	task_status: number;
	locked_by_uid: number;
	locked_by_username: string;
	outline_geojson: {
		type: string;
		geometry: {
			type: string;
			coordinates: [];
		};
		properties: {
			fid: number;
			uid: number;
			name: string;
		};
		id: number;
	};
};

export interface ProjectData {
	id: number;
	project_uuid: string;
	odkid: number;
	project_info: ProjectInfo;
	outline_geojson: {
		type: string;
		geometry: {
			type: string;
			coordinates: [];
		};
		properties: {
			id: number;
			bbox: [number, number, number, number];
		};
		id: number;
	};
	location_str: string;
	xform_category: string;
	xform_id: string;
	data_extract_url: string;
	odk_token: string;
	organisation_id: number;
	organisation_logo: string;
	custom_tms_url: string;
	author: ProjectAuthor;
	status: number;
	hashtags: string[];
	tasks: ProjectTask[];
}

export interface ZoomToTaskEventDetail {
	taskId: number;
}
