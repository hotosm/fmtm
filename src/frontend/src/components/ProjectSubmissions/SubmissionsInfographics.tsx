import React, { useEffect, useRef, useState } from 'react';
import TaskSubmissions from './TaskSubmissions';
import CustomBarChart from '../../components/common/BarChart';
import CustomPieChart from '../../components/common/PieChart';
import Table, { TableHeader } from '../../components/common/CustomTable';
import CustomLineChart from '../../components/common/LineChart';
import CoreModules from '../../shared/CoreModules';
import InfographicsCard from './InfographicsCard';
import { ProjectContributorsService, ProjectSubmissionInfographicsService } from '../../api/SubmissionService';
import environment from '../../environment';

const pieData = [
  { names: 'Group A', value: 400 },
  { names: 'Group D', value: 200 },
];

const lineKeyData = [
  {
    name: '11/25',
    Actual: 4000,
    Planned: 2400,
    amt: 2400,
  },
  {
    name: '11/26',
    Actual: 3000,
    Planned: 1398,
    amt: 2210,
  },
  {
    name: '11/27',
    Actual: 2000,
    Planned: 9800,
    amt: 2290,
  },
  {
    name: '11/28',
    Actual: 2780,
    Planned: 3908,
    amt: 2000,
  },
  {
    name: '11/29',
    Actual: 1890,
    Planned: 4800,
    amt: 2181,
  },
  {
    name: '11/30',
    Actual: 2390,
    Planned: 3800,
    amt: 2500,
  },
  {
    name: '12/01',
    Actual: 3490,
    Planned: 4300,
    amt: 2100,
  },
  {
    name: '12/02',
    Actual: 2780,
    Planned: 3908,
    amt: 2000,
  },
  {
    name: '12/03',
    Actual: 1890,
    Planned: 4800,
    amt: 2181,
  },
  {
    name: '12/04',
    Actual: 2390,
    Planned: 3800,
    amt: 2500,
  },
  {
    name: '12/05',
    Actual: 3490,
    Planned: 4300,
    amt: 2100,
  },
];

const SubmissionsInfographics = () => {
  const formSubmissionRef = useRef(null);
  const projectProgressRef = useRef(null);
  const totalContributorsRef = useRef(null);
  const plannedVsActualRef = useRef(null);
  const dispatch = CoreModules.useAppDispatch();

  const params = CoreModules.useParams();
  const encodedId = params.projectId;
  const decodedId = environment.decode(encodedId);

  const submissionInfographicsData = CoreModules.useAppSelector((state) => state.submission.submissionInfographics);
  const submissionContributorsData = CoreModules.useAppSelector((state) => state.submission.submissionContributors);
  const submissionContributorsLoading = CoreModules.useAppSelector(
    (state) => state.submission.submissionContributorsLoading,
  );
  const [submissionProjection, setSubmissionProjection] = useState(10);

  useEffect(() => {
    dispatch(
      ProjectSubmissionInfographicsService(
        `${import.meta.env.VITE_API_URL}/submission/submission_page/${decodedId}?days=${submissionProjection}`,
      ),
    );
  }, [submissionProjection]);

  useEffect(() => {
    dispatch(ProjectContributorsService(`${import.meta.env.VITE_API_URL}/projects/contributors/${decodedId}`));
  }, []);

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

  return (
    <div className="fmtm-flex fmtm-flex-col fmtm-gap-5">
      <div className="fmtm-flex fmtm-gap-10">
        <div className="fmtm-w-[65%]">
          <InfographicsCard
            cardRef={formSubmissionRef}
            header="Form Submissions"
            subHeader={<FormSubmissionSubHeader />}
            body={
              false ? (
                <CoreModules.Skeleton className="!fmtm-w-full fmtm-h-full" />
              ) : (
                <CustomBarChart
                  data={submissionInfographicsData}
                  xLabel="Submission Data"
                  yLabel="Submission Count"
                  dataKey="count"
                  nameKey="date"
                />
              )
            }
          />
        </div>
        <div className="fmtm-w-[35%]">
          <InfographicsCard
            cardRef={projectProgressRef}
            header="Project Progress"
            body={
              false ? (
                <CoreModules.Skeleton className="!fmtm-w-full fmtm-h-full" />
              ) : (
                <CustomPieChart data={pieData} dataKey="value" nameKey="names" />
              )
            }
          />
        </div>
      </div>
      <div className="fmtm-flex fmtm-gap-10">
        <div className="fmtm-w-[65%]">
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
        <div className="fmtm-w-[35%]">
          <InfographicsCard
            header={`Total Contributors: 25`}
            body={
              false ? (
                <CoreModules.Skeleton className="!fmtm-w-full fmtm-h-full" />
              ) : (
                <CustomPieChart data={pieData} dataKey="value" nameKey="names" />
              )
            }
          />
        </div>
      </div>
      <div className="fmtm-w-[100%]">
        <InfographicsCard
          cardRef={plannedVsActualRef}
          header="Planned vs Actual"
          body={
            false ? (
              <CoreModules.Skeleton className="!fmtm-w-full fmtm-h-full" />
            ) : (
              <CustomLineChart
                data={lineKeyData}
                xAxisDataKey="name"
                lineOneKey="Planned"
                lineTwoKey="Actual"
                xLabel="Submission Date"
                yLabel="Submission Count"
              />
            )
          }
        />
      </div>

      <div>
        <TaskSubmissions />
      </div>
    </div>
  );
};

export default SubmissionsInfographics;
