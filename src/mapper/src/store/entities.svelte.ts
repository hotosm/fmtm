import type { PGliteWithSync } from '@electric-sql/pglite-sync';
import { ShapeStream, Shape, FetchError } from '@electric-sql/client';
import type { ShapeData } from '@electric-sql/client';
import type { Feature, FeatureCollection } from 'geojson';
import type { LngLatLike } from 'svelte-maplibre';

import type { EntitiesDbType, EntityStatusPayload, entityStatusOptions } from '$lib/types';
import { EntityStatusNameMap } from '$lib/types';
import { getAlertStore } from './common.svelte';

const API_URL = import.meta.env.VITE_API_URL;

type entitiesApiResponse = {
	id: string;
	task_id: number;
	osm_id: number;
	status: number;
	updated_at: string | null;
	submission_ids: string;
};

type entitiesShapeType = {
	entity_id: string;
	status: entityStatusOptions;
	project_id: number;
	task_id: number;
};

// What we actually use in the frontend (a merger from API / ShapeStream / DB)
type entitiesListType = {
	entity_id: string;
	status: entityStatusOptions;
	project_id: number;
	task_id: number;
	osm_id?: number | undefined;
	submission_ids?: string | undefined;
};

type entityIdCoordinateMapType = {
	entityId: string;
	coordinate: [number, number];
};

type newBadGeomType<T> = {
	geojson: Feature;
	id: number;
	project_id: number;
	status: T;
	task_id: number;
};

type taskSubmissionInfoType = {
	task_id: number;
	index: number;
	submission_count: number;
	feature_count: number;
};

let userLocationCoord: LngLatLike | undefined = $state();
let selectedEntity: string | null = $state(null);
let entitiesList: entitiesListType[] = $state([]);
// Map from entity_id to osm_id
let entityMap = $derived(new Map(entitiesList.map((entity) => [entity.entity_id, entity.osm_id])));
// Map from entity_id to full entity data
let entityMapByEntity = $derived(new Map(entitiesList.map((entity) => [entity.entity_id, entity])));
// Map from osm_id to full entity data (only include defined osm_ids)
let entityMapByOsm = $derived(
	new Map(entitiesList.filter((e) => e.osm_id !== undefined).map((entity) => [entity.osm_id!, entity])),
);

let badGeomFeatcol: FeatureCollection = $state({ type: 'FeatureCollection', features: [] });
let newGeomFeatcol: FeatureCollection = $state({ type: 'FeatureCollection', features: [] });
let syncEntityStatusLoading: boolean = $state(false);
let updateEntityStatusLoading: boolean = $state(false);
let selectedEntityCoordinate: entityIdCoordinateMapType | null = $state(null);
let entityToNavigate: entityIdCoordinateMapType | null = $state(null);
let toggleGeolocation: boolean = $state(false);
let taskSubmissionInfo: taskSubmissionInfoType[] = $state([]);
let alertStore = getAlertStore();

function addStatusToGeojsonProperty(geojsonData: FeatureCollection, entityType: '' | 'new'): FeatureCollection {
	if (entityType === 'new') {
		return {
			...geojsonData,
			features: geojsonData.features.map((feature) => {
				const entity = entityMapByEntity.get(feature?.properties?.entity_id);
				return {
					...feature,
					properties: {
						...feature.properties,
						status: entity?.status,
						entity_id: entity?.entity_id,
					},
				};
			}),
		};
	} else {
		return {
			...geojsonData,
			features: geojsonData.features.map((feature) => {
				const entity = entityMapByOsm.get(feature?.properties?.osm_id);
				return {
					...feature,
					properties: {
						...feature.properties,
						status: entity?.status,
						entity_id: entity?.entity_id,
					},
				};
			}),
		};
	}
}

function getEntitiesStatusStore() {
	async function getEntityStatusStream(db: PGliteWithSync, projectId: number): Promise<ShapeStream | undefined> {
		if (!db || !projectId) {
			return;
		}

		const entitiesSync = await db.electric.syncShapeToTable({
			shape: {
				url: `${import.meta.env.VITE_SYNC_URL}/v1/shape`,
				params: {
					table: 'odk_entities',
					where: `project_id=${projectId}`,
				},
			},
			table: 'odk_entities',
			primaryKey: ['entity_id'],
			shapeKey: 'odk_entities',
			initialInsertMethod: 'csv', // performance boost on initial sync
		});

		// Populate initial entity statuses
		await getInitialEntities(db, projectId);

		entitiesSync.stream.subscribe(
			(entities: ShapeData[]) => {
				// Create map for faster lookup
				const rows: entitiesShapeType[] = entities
					.filter((item): item is { value: entitiesShapeType } => 'value' in item && item.value !== null)
					.map((item) => item.value);

				const newEntities = rows.map((entity) => ({
					entity_id: entity.entity_id,
					status: entity.status,
					project_id: projectId,
					task_id: entity.task_id,
				}));

				// Merge, replacing by entity_id
				const entityMap = new Map(entitiesList.map((e) => [e.entity_id, e]));
				for (const entity of newEntities) {
					entityMap.set(entity.entity_id, entity);
				}

				entitiesList = Array.from(entityMap.values());
			},
			(error: FetchError) => {
				console.error('entity sync error', error);
			},
		);

		return entitiesSync;
	}

	async function getInitialEntities(db: PGliteWithSync, projectId: number) {
		const dbEntities = await db.query(`SELECT * FROM odk_entities WHERE project_id = $1;`, [projectId]);
		entitiesList = dbEntities.rows.map((entity: EntitiesDbType) => ({
			entity_id: entity.entity_id,
			status: entity.status,
			project_id: projectId,
			task_id: entity.task_id,
		}));
	}

	async function setSelectedEntity(entityOsmId: number | null) {
		selectedEntity = entityOsmId;
	}

	async function setSelectedEntityCoordinate(entityCoordinate: entityIdCoordinateMapType | null) {
		selectedEntityCoordinate = entityCoordinate;
	}

	function _setTaskSubmissionInfo(entities: entitiesApiResponse[]) {
		const taskEntityMap = entities?.reduce((acc: Record<number, entitiesListType[]>, item) => {
			if (!acc[item?.task_id]) {
				acc[item.task_id] = [];
			}
			acc[item.task_id].push(item);
			return acc;
		}, {});

		const taskInfo = Object.entries(taskEntityMap).map(([taskId, taskEntities]) => {
			// Calculate feature_count
			const featureCount = taskEntities.length;
			let submissionCount = 0;
			// Calculate submission_count
			taskEntities.forEach((entity) => {
				if (entity.status > 1) {
					submissionCount++;
				}
			});
			return {
				task_id: +taskId,
				index: +taskId,
				submission_count: submissionCount,
				feature_count: featureCount,
			};
		});
		taskSubmissionInfo = taskInfo;
	}

	// Manually sync the entity status via button (if local db gets out of sync with backend)
	async function syncEntityStatus(db: PGliteWithSync, projectId: number) {
		try {
			syncEntityStatusLoading = true;
			const entityStatusResponse = await fetch(`${API_URL}/projects/${projectId}/entities/statuses`, {
				credentials: 'include',
			});
			if (!entityStatusResponse.ok) {
				throw Error('Failed to get entities for project');
			}

			const responseJson: entitiesApiResponse[] = await entityStatusResponse.json();
			// Convert API response into our internal entity shape
			const newEntities = responseJson.map((entity: entitiesApiResponse) => ({
				entity_id: entity.id,
				status: EntityStatusNameMap[entity.status],
				project_id: projectId,
				task_id: entity.task_id,
				submission_ids: entity.submission_ids,
				osm_id: entity.osm_id,
			}));
			syncEntityStatusLoading = false;

			// Replace in-memory list from store
			entitiesList = newEntities;

			// Clear odk_entities table first in local db, then re-add data
			// FIXME we should sync any pending entities first, if in the staging table
			await db.exec(`DELETE FROM odk_entities WHERE project_id = $1;`, [projectId]);
			for (const entity of newEntities) {
				await db.run(
					`INSERT INTO odk_entities (entity_id, status, project_id, task_id, submission_ids, osm_id)
					VALUES ($1, $2, $3, $4, $5, $6)`,
					[
						entity.entity_id,
						entity.status,
						entity.project_id,
						entity.task_id,
						JSON.stringify(entity.submission_ids),
						entity.osm_id,
					],
				);
			}

			// FIXME should we also be calling _setTaskSubmissionInfo in other places
			// where we set the entity statuses?
			_setTaskSubmissionInfo(responseJson);
		} catch (error) {
			syncEntityStatusLoading = false;
		}
	}

	async function updateEntityStatus(projectId: number, payload: EntityStatusPayload) {
		try {
			updateEntityStatusLoading = true;
			await fetch(`${API_URL}/projects/${projectId}/entity/status`, {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: {
					'Content-type': 'application/json',
				},
				credentials: 'include',
			});
			updateEntityStatusLoading = false;
		} catch (error) {
			updateEntityStatusLoading = false;
		}
	}

	async function createEntity(projectId: number, payload: FeatureCollection) {
		try {
			const resp = await fetch(`${API_URL}/central/entity?project_id=${projectId}`, {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: {
					'Content-type': 'application/json',
				},
				credentials: 'include',
			});
			if (!resp.ok) {
				const errorData = await resp.json();
				throw new Error(errorData.detail);
			}
			return await resp.json();
		} catch (error: any) {
			alertStore.setAlert({
				variant: 'danger',
				message: error.message || 'Failed to create entity',
			});
		}
	}

	function setEntityToNavigate(entityCoordinate: entityIdCoordinateMapType | null) {
		entityToNavigate = entityCoordinate;
	}

	function setToggleGeolocation(status: boolean) {
		toggleGeolocation = status;
	}

	function setUserLocationCoordinate(coordinate: LngLatLike | undefined) {
		userLocationCoord = coordinate;
	}

	return {
		getEntityStatusStream: getEntityStatusStream,
		setSelectedEntity: setSelectedEntity,
		syncEntityStatus: syncEntityStatus,
		updateEntityStatus: updateEntityStatus,
		createEntity: createEntity,
		setSelectedEntityCoordinate: setSelectedEntityCoordinate,
		setEntityToNavigate: setEntityToNavigate,
		setToggleGeolocation: setToggleGeolocation,
		setUserLocationCoordinate: setUserLocationCoordinate,
		get selectedEntity() {
			return selectedEntity;
		},
		get entityMap() {
			return entityMap;
		},
		get entityMapByEntity() {
			return entityMapByEntity;
		},
		get entityMapByOsm() {
			return entityMapByOsm;
		},
		get badGeomFeatcol() {
			return badGeomFeatcol;
		},
		get newGeomFeatcol() {
			return newGeomFeatcol;
		},
		get syncEntityStatusLoading() {
			return syncEntityStatusLoading;
		},
		get updateEntityStatusLoading() {
			return updateEntityStatusLoading;
		},
		get selectedEntityCoordinate() {
			return selectedEntityCoordinate;
		},
		get entityToNavigate() {
			return entityToNavigate;
		},
		get toggleGeolocation() {
			return toggleGeolocation;
		},
		get userLocationCoord() {
			return userLocationCoord;
		},
		get entitiesList() {
			return entitiesList;
		},
		get taskSubmissionInfo() {
			return taskSubmissionInfo;
		},
	};
}

function getNewBadGeomStore() {
	async function getNewBadGeomStream(db: PGliteWithSync, projectId: number): Promise<ShapeStream | undefined> {
		if (!db || !projectId) {
			return;
		}

		const newBadGeomSync = await db.electric.syncShapeToTable({
			shape: {
				url: `${import.meta.env.VITE_SYNC_URL}/v1/shape`,
				params: {
					table: 'geometrylog',
					where: `project_id=${projectId}`,
				},
			},
			table: 'geometrylog',
			primaryKey: ['id'],
			shapeKey: 'geometrylog',
			initialInsertMethod: 'csv', // performance boost on initial sync
		});

		// Set initial state of newGeom and badGeom from db
		await getInitialGeomRecords(db, projectId);

		// Append new geoms created to the existing state
		newBadGeomSync.stream.subscribe(
			(geoms: ShapeData[]) => {
				const rows: newBadGeomType<'NEW' | 'BAD'>[] = geoms
					.filter((item): item is { value: newBadGeomType<'NEW' | 'BAD'> } => 'value' in item && item.value !== null)
					.map((item) => item.value);

				const badRows = rows.filter((row) => row.status === 'BAD').map((row) => row.geojson);
				const newRows = rows.filter((row) => row.status === 'NEW').map((row) => row.geojson);

				badGeomFeatcol = {
					...badGeomFeatcol,
					features: [...badGeomFeatcol.features, ...badRows],
				};
				newGeomFeatcol = {
					...newGeomFeatcol,
					features: [...newGeomFeatcol.features, ...newRows],
				};
			},
			(error: FetchError) => {
				console.error('geom sync error', error);
			},
		);

		return newBadGeomSync;
	}

	async function getInitialGeomRecords(db: PGliteWithSync, projectId: number) {
		const dbNewGeoms = await db.query(`SELECT * FROM geometrylog WHERE project_id = $1 AND status = 'NEW';`, [
			projectId,
		]);
		const existingNewGeoms = dbNewGeoms.rows.map((row: newBadGeomType<'NEW'>) => row.geojson);
		newGeomFeatcol = {
			type: 'FeatureCollection',
			features: existingNewGeoms,
		};

		const dbBadGeoms = await db.query(`SELECT * FROM geometrylog WHERE project_id = $1 AND status = 'BAD';`, [
			projectId,
		]);
		const existingBadGeoms = dbBadGeoms.rows.map((row: newBadGeomType<'BAD'>) => row.geojson);
		badGeomFeatcol = {
			type: 'FeatureCollection',
			features: existingBadGeoms,
		};
	}

	async function createGeomRecord(projectId: number, payload: Record<string, any>) {
		try {
			const resp = await fetch(`${API_URL}/projects/${projectId}/geometry/records`, {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: {
					'Content-type': 'application/json',
				},
				credentials: 'include',
			});
			if (!resp.ok) {
				const errorData = await resp.json();
				throw new Error(errorData.detail);
			}
		} catch (error: any) {
			alertStore.setAlert({
				variant: 'danger',
				message: error.message || 'Failed to create geometry record',
			});
		}
	}

	return {
		getNewBadGeomStream: getNewBadGeomStream,
		createGeomRecord: createGeomRecord,
	};
}

export { getEntitiesStatusStore, getNewBadGeomStore, addStatusToGeojsonProperty };
