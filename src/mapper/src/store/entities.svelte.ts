import { ShapeStream, Shape } from '@electric-sql/client';
import type { ShapeData, Row } from '@electric-sql/client';

type entitiesStatusListType = {
	osmid: number | undefined;
	entity_id: string;
	project_id: number;
	status: string;
	task_id: number;
};

type entitiesListType = {
	id: string;
	task_id: number;
	osm_id: number;
	status: number;
	updated_at: string | null;
};

type entitiesShapeType = {
	entity_id: string;
	status: string;
	project_id: number;
	task_id: number;
};

let selectedEntity = $state(null);
let entitiesShape: Shape;
let entitiesStatusList: entitiesStatusListType[] = $state([]);

function getEntityStatusStream(projectId: number): ShapeStream | undefined {
	if (!projectId) {
		return;
	}
	return new ShapeStream({
		url: `${import.meta.env.VITE_SYNC_URL}/v1/shape`,
		table: 'odk_entities',
		where: `project_id=${projectId}`,
	});
}

function getEntitiesStatusStore() {
	async function subscribeToEntityStatusUpdates(entitiesStream: ShapeStream, entitiesList: entitiesListType[]) {
		entitiesShape = new Shape(entitiesStream);

		entitiesShape.subscribe((entities: ShapeData) => {
			const rows: entitiesShapeType[] = entities.rows;
			if (rows && Array.isArray(rows)) {
				entitiesStatusList = rows?.map((entity) => {
					return {
						...entity,
						osmid: entitiesList?.find((entityx) => entityx.id === entity.entity_id)?.osm_id,
					};
				});
			}
		});
	}

	return {
		subscribeToEntityStatusUpdates: subscribeToEntityStatusUpdates,
		get selectedEntity() {
			return selectedEntity;
		},
		get entitiesStatusList() {
			return entitiesStatusList;
		},
	};
}

export { getEntityStatusStream, getEntitiesStatusStore };
