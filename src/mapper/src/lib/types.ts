export type ProjectTask = {
	id: number;
	project_id: number;
	project_task_index: number;
	feature_count: number;
	outline: {
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
	odkid: number;
	name: string;
	short_description: string;
	description: string;
	per_task_instructions: string;
	outline: {
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
	odk_form_id: string;
	data_extract_url: string;
	odk_token: string;
	organisation_id: number;
	organisation_logo: string;
	author_id: number;
	custom_tms_url: string;
	status: number;
	hashtags: string[];
	tasks: ProjectTask[];
}

export interface ZoomToTaskEventDetail {
	taskId: number;
}

export type TaskStatus = {
	RELEASED_FOR_MAPPING: string;
	LOCKED_FOR_MAPPING: string;
	UNLOCKED_TO_VALIDATE: string;
	LOCKED_FOR_VALIDATION: string;
	VALIDATED: string;
	INVALIDATED: string;
	BAD: string;
	SPLIT: string;
	ARCHIVED: string;
};
export const TaskStatusEnum: TaskStatus = Object.freeze({
	RELEASED_FOR_MAPPING: '0',
	LOCKED_FOR_MAPPING: '1',
	UNLOCKED_TO_VALIDATE: '2',
	LOCKED_FOR_VALIDATION: '3',
	VALIDATED: '4',
	INVALIDATED: '5',
	BAD: '6',
	SPLIT: '7',
	ARCHIVED: '8',
});

// TODO fix me
export type TaskEvent = {
	event_id: string;
	comment: string;
	created_at: string;
	username: string;
	profile_img: string;
	status: TaskStatus;
};