import CoreModules from '@/shared/CoreModules.js';
import React, { useEffect } from 'react';
import environment from '@/environment';
import { SubmissionService } from '@/api/Submission';
import SubmissionInstanceMap from '@/components/SubmissionMap/SubmissionInstanceMap';
import { GetProjectDashboard } from '@/api/Project';
import Button from '@/components/common/Button';
import { SubmissionActions } from '@/store/slices/SubmissionSlice';
import UpdateReviewStatusModal from '@/components/ProjectSubmissions/UpdateReviewStatusModal';

const SubmissionDetails = () => {
  const dispatch = CoreModules.useAppDispatch();
  const params = CoreModules.useParams();
  const encodedProjectId = params.projectId;
  const decodedProjectId = environment.decode(encodedProjectId);
  const encodedTaskId = params.taskId;
  const decodedTaskId = environment.decode(encodedTaskId);
  const paramsInstanceId = params.instanceId;
  const projectDashboardDetail = CoreModules.useAppSelector((state) => state.project.projectDashboardDetail);

  // const submissionDetails = CoreModules.useAppSelector((state) => state.submission.submissionDetails);
  const submissionDetails = {
    start: '2024-02-21T15:46:15.790+05:45',
    end: '2024-02-21T15:47:03.138+05:45',
    today: '2024-02-21',
    phonenumber: null,
    deviceid: 'collect:GbHDtlOGabIxAO0H',
    username: 'svcfmtm',
    email: '3794',
    instructions: null,
    warmup: {
      type: 'Point',
      coordinates: [85.3284991, 27.7303609, 1278.800048828125],
      properties: {
        accuracy: 10.981,
      },
    },
    all: {
      model: 'basic',
      existing: '110627',
      xid: '110627',
      xlocation:
        '27.713884 85.320455 0 0; 27.713872 85.320544 0 0; 27.713874 85.320544 0 0; 27.713818 85.320991 0 0; 27.713807 85.321073 0 0; 27.7139 85.321088 0 0; 27.714233 85.321142 0 0; 27.714223 85.321215 0 0; 27.714292 85.321226 0 0; 27.714336 85.320882 0 0; 27.714267 85.320871 0 0; 27.714243 85.32106 0 0; 27.71391 85.321006 0 0; 27.713967 85.32056 0 0; 27.714303 85.320614 0 0; 27.714275 85.320841 0 0; 27.714344 85.320852 0 0; 27.714373 85.320626 0 0; 27.714482 85.320643 0 0; 27.714493 85.320554 0 0; 27.713884 85.320455 0 0',
      buildings: {
        category: 'service',
        name: null,
        building_material: 'glass',
        building_levels: null,
        religion: null,
        denomination: null,
        muslim: null,
        hindu: null,
        religious: null,
        service: 'pump_station',
        Shop: null,
        tourism: null,
        education_details: null,
        link: null,
        government: null,
        medical: null,
        food: null,
        cuisine: null,
        heritage: null,
        emergency: null,
        operator: null,
        inscription: null,
        housing: null,
        provider: null,
        rooms: null,
        ref: null,
        building_neighbor: null,
      },
      gps: {
        point: null,
        comment: 'Nice',
        image: '1708509704584.jpg',
      },
    },
    details: {
      power: null,
      generator_source: null,
      generator: null,
      water: null,
      water_source: null,
      pump_unit: null,
      capacity: null,
      age: null,
      building_prefab: null,
      building_floor: null,
      building_roof: null,
      condition: null,
      access_roof: null,
      levels_underground: null,
      geological_site: null,
      lateral_material: null,
      lateral_system: null,
    },
    meta: {
      instanceID: 'uuid:3b051100-d29f-4544-99b9-fb865f07716e',
    },
    __id: 'uuid:3b051100-d29f-4544-99b9-fb865f07716e',
    __system: {
      submissionDate: '2024-02-21T10:02:02.213Z',
      updatedAt: null,
      submitterId: '49715',
      submitterName: 'generate app user_buildings_3794',
      attachmentsPresent: 1,
      attachmentsExpected: 1,
      status: null,
      reviewState: null,
      deviceId: 'collect:GbHDtlOGabIxAO0H',
      edits: 0,
      formVersion: '2024-02-21T10:01:01Z',
    },
  };

  useEffect(() => {
    dispatch(GetProjectDashboard(`${import.meta.env.VITE_API_URL}/projects/project_dashboard/${decodedProjectId}`));
  }, []);

  // useEffect(() => {
  //   dispatch(
  //     SubmissionService(
  //       `${
  //         import.meta.env.VITE_API_URL
  //       }/central/submission?project_id=${decodedProjectId}&xmlFormId=${decodedTaskId}&submission_id=${paramsInstanceId}`,
  //     ),
  //   );
  // }, []);

  function removeNullValues(obj) {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== null) {
        if (typeof value === 'object') {
          const nestedObj = removeNullValues(value);
          if (Object.keys(nestedObj).length > 0) {
            newObj[key] = nestedObj;
          }
        } else {
          newObj[key] = value;
        }
      }
    }
    return newObj;
  }
  const filteredData = removeNullValues(submissionDetails);

  var coordinatesArray = submissionDetails?.all?.xlocation?.split(';').map(function (coord) {
    let coordinate = coord
      .trim()
      .split(' ')
      .slice(0, 2)
      .map((value) => {
        return parseFloat(value);
      });
    return [coordinate[1], coordinate[0]];
  });

  const geojsonFeature = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: coordinatesArray,
        },
        properties: {},
      },
    ],
  };

  const renderValue = (value, key = '') => {
    if (key === 'start' || key === 'end') {
      return (
        <p>
          {value?.split('T')[0]}, {value?.split('T')[1]}
        </p>
      );
    } else if (typeof value === 'object' && Object.values(value).includes('Point')) {
      return (
        <div>
          <p className="fmtm-capitalize"></p> {value?.type} ({value?.coordinates?.[0]},{value?.coordinates?.[1]},
          {value?.coordinates?.[2]}){renderValue(value?.properties)}
        </div>
      );
    } else if (typeof value === 'object') {
      return (
        <ul className="fmtm-flex fmtm-flex-col fmtm-gap-1">
          {Object.entries(value).map(([key, nestedValue]) => (
            <CoreModules.Box sx={{ textTransform: 'capitalize' }} key={key}>
              <span color="error" className="fmtm-font-bold">
                {key}:{' '}
              </span>
              {renderValue(nestedValue, key)}
            </CoreModules.Box>
          ))}
        </ul>
      );
    } else {
      return <span>{value}</span>;
    }
  };

  return (
    <div className="fmtm-bg-gray-100 fmtm-box-border fmtm-border-[1px] fmtm-border-t-white fmtm-border-t-[0px] fmtm-px-[1.5rem] md:fmtm-px-[3.5rem] fmtm-py-[1.5rem] md:fmtm-py-[2rem]">
      <UpdateReviewStatusModal />
      <div className="fmtm-flex fmtm-flex-col xl:fmtm-flex-row">
        <div>
          <div className="fmtm-bg-white fmtm-rounded-lg fmtm-w-full md:fmtm-w-[35rem] fmtm-h-fit fmtm-p-2 fmtm-px-4 md:fmtm-p-4 md:fmtm-shadow-[0px_10px_20px_0px_rgba(96,96,96,0.1)] fmtm-flex fmtm-flex-col">
            <h2 className="fmtm-text-2xl fmtm-text-[#545454] fmtm-font-bold fmtm-mb-4">
              {/* {projectDashboardDetail?.project_name_prefix} */}
              generate app user
            </h2>
            <h2 className="fmtm-text-xl fmtm-font-bold fmtm-text-[#545454]">Task: {decodedTaskId}</h2>
            <h2 className="fmtm-text-lg fmtm-font-bold fmtm-text-[#545454]">Submission Id: {paramsInstanceId}</h2>
          </div>
          <Button
            btnText="Update Review Status"
            btnType="primary"
            className="fmtm-w-fit fmtm-justify-center !fmtm-rounded fmtm-font-bold fmtm-text-sm !fmtm-py-2 fmtm-mt-8"
            onClick={() => {
              dispatch(
                SubmissionActions.SetUpdateReviewStatusModal({
                  toggleModalStatus: true,
                  submissionId: paramsInstanceId,
                }),
              );
            }}
          />
        </div>
        <div className="fmtm-flex fmtm-flex-grow fmtm-justify-center">
          <div className="fmtm-w-full fmtm-my-10 xl:fmtm-my-0 xl:fmtm-w-[500px] 2xl:fmtm-w-[700px] fmtm-h-[300px] fmtm-rounded-lg fmtm-overflow-hidden">
            <SubmissionInstanceMap featureGeojson={geojsonFeature} />
          </div>
        </div>
      </div>
      {Object.entries(filteredData).map(([key, value]) => (
        <div key={key}>
          <CoreModules.Box sx={{ borderBottom: '1px solid #e2e2e2', padding: '8px' }}>
            <div className="fmtm-capitalize fmtm-text-xl fmtm-font-bold fmtm-mb-1">{key}</div>
            {renderValue(value, key)}
          </CoreModules.Box>
        </div>
      ))}{' '}
    </div>
  );
};

export default SubmissionDetails;
