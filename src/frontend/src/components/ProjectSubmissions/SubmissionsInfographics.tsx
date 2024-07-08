import React, { useEffect, useRef, useState } from 'react';
import TaskSubmissions from '@/components/ProjectSubmissions/TaskSubmissions';
import CustomBarChart from '@/components/common/BarChart';
import CustomPieChart from '@/components/common/PieChart';
import Table, { TableHeader } from '@/components/common/CustomTable';
import CustomLineChart from '@/components/common/LineChart';
import CoreModules from '@/shared/CoreModules';
import InfographicsCard from '@/components/ProjectSubmissions/InfographicsCard';
import {
  ProjectContributorsService,
  // ProjectSubmissionInfographicsService,
  // ValidatedVsMappedInfographicsService,
} from '@/api/SubmissionService';
import useDocumentTitle from '@/utilfunctions/useDocumentTitle';
import { useAppSelector } from '@/types/reduxTypes';
import { taskHistoryTypes } from '@/models/project/projectModel';

type formSubmissionType = { date: string; count: number; label: string };
type validatedMappedType = { date: string; Validated: number; Mapped: number; label: string };

// get date N days ago
const dateNDaysAgo = (NDays: number) => {
  return new Date(new Date().getTime() - NDays * 24 * 60 * 60 * 1000).toISOString();
};

// extract month & day in MM/DD format for chart date labels
const getMonthDate = (date: string) => {
  const splittedDate = date?.split('T')[0]?.split('-');
  return `${splittedDate[1]}/${splittedDate[2]}`;
};

// generates an array of date strings for last 30 days
const generateLast30Days = (): string[] => {
  const last30Days: string[] = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    last30Days.push(date.toISOString().split('T')[0]);
  }

  return last30Days;
};

const SubmissionsInfographics = ({ toggleView, entities }) => {
  useDocumentTitle('Submission Infographics');
  const formSubmissionRef = useRef(null);
  const projectProgressRef = useRef(null);
  const totalContributorsRef = useRef(null);
  const plannedVsActualRef = useRef(null);
  const dispatch = CoreModules.useAppDispatch();

  const params = CoreModules.useParams();
  const projectId = params.projectId;

  // const submissionInfographicsData = useAppSelector((state) => state.submission.submissionInfographics);
  // const submissionInfographicsLoading = useAppSelector((state) => state.submission.submissionInfographicsLoading);
  const submissionContributorsData = useAppSelector((state) => state.submission.submissionContributors);
  const submissionContributorsLoading = useAppSelector((state) => state.submission.submissionContributorsLoading);
  const [submissionProjection, setSubmissionProjection] = useState<10 | 30>(10);
  // const validatedVsMappedInfographics = useAppSelector((state) => state.submission.validatedVsMappedInfographics);
  // const validatedVsMappedLoading = useAppSelector((state) => state.submission.validatedVsMappedLoading);
  const taskInfo = useAppSelector((state) => state.task.taskInfo);
  const taskLoading = useAppSelector((state) => state.task.taskLoading);
  const entityOsmMapLoading = useAppSelector((state) => state.project.entityOsmMapLoading);
  const projectTaskList = useAppSelector((state) => state.project.projectTaskBoundries);
  const projectDetailsLoading = useAppSelector((state) => state.project.projectDetailsLoading);

  const today = new Date().toISOString();
  const [formSubmissionsData, setFormSubmissionsData] = useState<formSubmissionType[]>([]);
  const [validatedVsMappedInfographics, setValidatedVsMappedInfographics] = useState<validatedMappedType[]>([]);

  useEffect(() => {
    if (!projectTaskList || (projectTaskList && projectTaskList?.length === 0)) return;

    const projectIndex = projectTaskList.findIndex((project) => project.id == +projectId);
    // task activities history list
    const taskActivities = projectTaskList?.[projectIndex]?.taskBoundries?.reduce((acc: taskHistoryTypes[], task) => {
      return [...acc, ...task?.task_history];
    }, []);

    // filter activities for last 30 days
    const taskActivities30Days = taskActivities?.filter((activity) => {
      const actionDate = new Date(activity?.action_date).toISOString();
      return actionDate >= dateNDaysAgo(30) && actionDate <= today;
    });

    // only filter MAPPED & VALIDATED activities
    const groupedData: validatedMappedType[] = taskActivities30Days?.reduce((acc: validatedMappedType[], activity) => {
      const date = activity?.action_date.split('T')[0];
      const index = acc.findIndex((submission) => submission.date === date);
      if (acc?.find((submission) => submission.date === date)) {
        if (activity?.action_text?.includes('LOCKED_FOR_MAPPING to MAPPED')) {
          acc[index].Mapped += 1;
        }
        if (activity?.action_text?.includes('LOCKED_FOR_VALIDATION to VALIDATED')) {
          acc[index].Validated += 1;
        }
      } else {
        const splittedDate = date?.split('-');
        const label = `${splittedDate[1]}/${splittedDate[2]}`;
        if (activity?.action_text?.includes('LOCKED_FOR_MAPPING to MAPPED')) {
          acc.push({ date: date, Validated: 0, Mapped: 1, label });
        }
        if (activity?.action_text?.includes('LOCKED_FOR_VALIDATION to VALIDATED')) {
          acc.push({ date: date, Validated: 1, Mapped: 0, label });
        }
      }
      return acc;
    }, []);

    // generate validatedMapped data for last 30 days
    const last30Days = generateLast30Days().map((datex) => {
      const mappedVsValidatedValue = groupedData?.find((group) => {
        return group?.date === datex;
      });

      if (mappedVsValidatedValue) {
        return mappedVsValidatedValue;
      } else {
        // if no validated-mapped date - return count of 0 for both
        const splittedDate = datex?.split('-');
        const label = `${splittedDate[1]}/${splittedDate[2]}`;
        return { date: datex, Validated: 0, Mapped: 0, label: label };
      }
    });

    // sort by ascending date
    const sortedValidatedMapped = last30Days?.sort((a, b) => {
      const dateA: any = new Date(a.date);
      const dateB: any = new Date(b.date);
      return dateA - dateB;
    });

    const cumulativeCount = {
      validated: 0,
      mapped: 0,
    };

    // generate cumulative count data
    const finalData = sortedValidatedMapped?.map((submission) => {
      cumulativeCount.validated += submission.Validated;
      cumulativeCount.mapped += submission.Mapped;
      return { ...submission, Validated: cumulativeCount.validated, Mapped: cumulativeCount.mapped };
    });

    setValidatedVsMappedInfographics(finalData);
  }, [projectTaskList]);

  // data for validated vs mapped graph
  useEffect(() => {
    if (entities?.length === 0) return;

    // get entities updated within the last 10 or 30 days
    const updatedEntityLastNDays = entities?.filter((entity) => {
      const updatedDate = new Date(entity?.updated_at).toISOString();
      return updatedDate >= dateNDaysAgo(submissionProjection) && updatedDate <= today;
    });

    // group entity submission according to date
    const submissions: formSubmissionType[] = [];
    updatedEntityLastNDays?.map((entity) => {
      if (submissions?.find((submission) => submission.label === getMonthDate(entity.updated_at))) {
        const index = submissions.findIndex((submission) => submission.label === getMonthDate(entity.updated_at));
        submissions[index].count += 1;
      } else {
        submissions.push({
          date: entity.updated_at?.split('T')[0],
          label: getMonthDate(entity.updated_at),
          count: 1,
        });
      }
    });

    // sort submissions by ascending date
    const sortedEntitySubmissions = submissions?.sort((a, b) => {
      const dateA: any = new Date(a.date);
      const dateB: any = new Date(b.date);
      return dateA - dateB;
    });
    setFormSubmissionsData(sortedEntitySubmissions);
  }, [entities, submissionProjection]);

  // useEffect(() => {
  //   dispatch(
  //     ProjectSubmissionInfographicsService(
  //       `${import.meta.env.VITE_API_URL}/submission/submission_page/${projectId}?days=${submissionProjection}`,
  //     ),
  //   );
  // }, [submissionProjection]);

  // useEffect(() => {
  //   dispatch(
  //     ValidatedVsMappedInfographicsService(`${import.meta.env.VITE_API_URL}/tasks/activity/?project_id=${projectId}`),
  //   );
  // }, []);

  // useEffect(() => {
  //   dispatch(ProjectContributorsService(`${import.meta.env.VITE_API_URL}/projects/contributors/${projectId}`));
  // }, []);

  const FormSubmissionSubHeader = () => (
    <div className="fmtm-text-sm fmtm-flex fmtm-gap-5 fmtm-mb-2">
      <div
        className={`fmtm-border-b-[2px] fmtm-cursor-pointer  ${
          submissionProjection === 10 ? 'fmtm-border-[#f3c5c5]' : 'fmtm-border-white hover:fmtm-border-gray-300'
        }`}
        onClick={() => setSubmissionProjection(10)}
      >
        <p>Last 10 days</p>
      </div>
      <div
        className={`fmtm-border-b-[2px] fmtm-cursor-pointer ${
          submissionProjection === 30 ? 'fmtm-border-[#f3c5c5]' : 'fmtm-border-white hover:fmtm-border-gray-300'
        }`}
        onClick={() => setSubmissionProjection(30)}
      >
        <p>Last 30 days</p>
      </div>
    </div>
  );

  const totalFeatureCount = taskInfo.reduce((total, task) => total + task.feature_count, 0);
  const totalSubmissionCount = taskInfo.reduce((total, task) => total + task.submission_count, 0);
  const projectProgressData = [
    {
      names: 'Current',
      value:
        totalSubmissionCount > totalFeatureCount || (totalSubmissionCount === 0 && totalFeatureCount === 0)
          ? 100
          : totalSubmissionCount,
    },
    {
      names: 'Remaining',
      value: totalSubmissionCount > totalFeatureCount ? 0 : totalFeatureCount - totalSubmissionCount,
    },
  ];

  return (
    <div className="fmtm-flex fmtm-flex-col fmtm-gap-5">
      {toggleView}
      <div className="fmtm-flex fmtm-flex-col lg:fmtm-flex-row fmtm-gap-5 lg:fmtm-gap-10">
        <div className="lg:fmtm-w-[60%] xl:fmtm-w-[70%]">
          <InfographicsCard
            cardRef={formSubmissionRef}
            header="Form Submissions"
            subHeader={<FormSubmissionSubHeader />}
            body={
              entityOsmMapLoading ? (
                <CoreModules.Skeleton className="!fmtm-w-full fmtm-h-full" />
              ) : formSubmissionsData.length > 0 ? (
                <CustomBarChart
                  data={formSubmissionsData}
                  xLabel="Submission Data"
                  yLabel="Submission Count"
                  dataKey="count"
                  nameKey="label"
                />
              ) : (
                <div className="fmtm-w-full fmtm-h-full fmtm-flex fmtm-justify-center fmtm-items-center fmtm-text-3xl fmtm-text-gray-400">
                  No form submissions!
                </div>
              )
            }
          />
        </div>
        <div className="lg:fmtm-w-[40%] xl:fmtm-w-[30%]">
          <InfographicsCard
            cardRef={projectProgressRef}
            header="Project Progress"
            body={
              taskLoading ? (
                <CoreModules.Skeleton className="!fmtm-w-full fmtm-h-full" />
              ) : (
                <CustomPieChart data={projectProgressData} dataKey="value" nameKey="names" />
              )
            }
          />
        </div>
      </div>
      <div className="fmtm-flex fmtm-flex-col lg:fmtm-flex-row fmtm-gap-5 lg:fmtm-gap-10">
        <div className="lg:fmtm-w-[60%] xl:fmtm-w-[70%]">
          <InfographicsCard
            cardRef={plannedVsActualRef}
            header="Validated vs Mapped Task"
            body={
              projectDetailsLoading ? (
                <CoreModules.Skeleton className="!fmtm-w-full fmtm-h-full" />
              ) : validatedVsMappedInfographics.length > 0 ? (
                <CustomLineChart
                  data={validatedVsMappedInfographics}
                  xAxisDataKey="label"
                  lineOneKey="Validated"
                  lineTwoKey="Mapped"
                  xLabel="Submission Date"
                  yLabel="Task Count"
                />
              ) : (
                <div className="fmtm-w-full fmtm-h-full fmtm-flex fmtm-justify-center fmtm-items-center fmtm-text-3xl fmtm-text-gray-400">
                  No Tasks Validated or Mapped in the Last 30 Days
                </div>
              )
            }
          />
        </div>
        <div className="lg:fmtm-w-[40%] xl:fmtm-w-[30%]">
          <InfographicsCard
            cardRef={totalContributorsRef}
            header={`Total Contributors: ${submissionContributorsData.length}`}
            body={
              <Table
                data={submissionContributorsData}
                onRowClick={() => {}}
                style={{ height: '100%' }}
                isLoading={submissionContributorsLoading}
              >
                <TableHeader
                  dataField="SN"
                  headerClassName="snHeader"
                  rowClassName="snRow"
                  dataFormat={(row, _, index) => <span>{index + 1}</span>}
                />

                <TableHeader
                  dataField="OSMID"
                  headerClassName="codeHeader"
                  rowClassName="codeRow"
                  dataFormat={(row) => (
                    <div
                      className="fmtm-w-[7rem] fmtm-max-w-[7rem]fmtm-overflow-hidden fmtm-truncate"
                      title={row?.user}
                    >
                      <span className="fmtm-text-[15px]">{row?.user}</span>
                    </div>
                  )}
                />
                <TableHeader
                  dataField="Contributions"
                  headerClassName="codeHeader"
                  rowClassName="codeRow"
                  dataFormat={(row) => (
                    <div
                      className="fmtm-w-[7rem] fmtm-max-w-[7rem] fmtm-overflow-hidden fmtm-truncate"
                      title={row?.contributions}
                    >
                      <span className="fmtm-text-[15px]">{row?.contributions}</span>
                    </div>
                  )}
                />
              </Table>
            }
          />
        </div>
      </div>
      {/* <div>
        <InfographicsCard
          cardRef={plannedVsActualRef}
          header="Planned vs Actual"
          body={
            false ? (
              <CoreModules.Skeleton className="!fmtm-w-full fmtm-h-full" />
            ) : lineKeyData.length > 0 ? (
              <CustomLineChart
                data={lineKeyData}
                xAxisDataKey="name"
                lineOneKey="Planned"
                lineTwoKey="Actual"
                xLabel="Submission Date"
                yLabel="Submission Count"
              />
            ) : (
              <div className="fmtm-w-full fmtm-h-full fmtm-flex fmtm-justify-center fmtm-items-center fmtm-text-3xl fmtm-text-gray-400">
                No data available!
              </div>
            )
          }
        />
      </div> */}
      <div>
        <TaskSubmissions />
      </div>
    </div>
  );
};

export default SubmissionsInfographics;
