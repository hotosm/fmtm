import React, { useState } from 'react';
import TaskSubmissions from './TaskSubmissions';
import CustomBarChart from '../../components/common/BarChart';
import AssetModules from '../../shared/AssetModules.js';
import CustomPieChart from '../../components/common/PieChart';
import Table, { TableHeader } from '../../components/common/CustomTable';
import CustomLineChart from '../../components/common/LineChart';

type InfographicsCardType = {
  header: string;
  subHeader?: React.ReactElement;
  body: React.ReactElement;
};

const SubmissionsInfographics = () => {
  const [submissionProjection, setSubmissionProjection] = useState(10);
  const items = [
    { name: 'haha' },
    { name: 'haha' },
    { name: 'haha' },
    { name: 'haha' },
    { name: 'haha' },
    { name: 'haha' },
    { name: 'haha' },
  ];

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

  const InfographicsCard = ({ header, subHeader, body }: InfographicsCardType) => (
    <div className="fmtm-w-full fmtm-h-[24rem] fmtm-bg-white fmtm-flex fmtm-flex-col fmtm-gap-5 fmtm-p-5 fmtm-rounded-xl">
      <div className="fmtm-flex fmtm-items-end fmtm-justify-between">
        <h5 className="fmtm-text-lg">{header}</h5>
        <AssetModules.FileDownloadOutlinedIcon />
      </div>
      {subHeader && subHeader}
      <div className="fmtm-h-[80%] ">{body}</div>
    </div>
  );

  return (
    <div className="fmtm-flex fmtm-flex-col fmtm-gap-5">
      <div className="fmtm-flex fmtm-gap-10">
        <div className="fmtm-w-[65%]">
          <InfographicsCard
            header="Form Submissions"
            subHeader={<FormSubmissionSubHeader />}
            body={<CustomBarChart />}
          />
        </div>
        <div className="fmtm-w-[35%]">
          <InfographicsCard header="Project Progress" body={<CustomPieChart />} />
        </div>
      </div>
      <div className="fmtm-flex fmtm-gap-10">
        <div className="fmtm-w-[65%]">
          <InfographicsCard
            header={`Total Contributors: 25`}
            body={
              <Table data={items} flag="dashboard" onRowClick={() => {}} style={{ height: '100%' }}>
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
                      title={row?.name}
                    >
                      <span className="fmtm-text-[15px]">{row?.name}</span>
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
                      title={row?.name}
                    >
                      <span className="fmtm-text-[15px]">{row?.name}</span>
                    </div>
                  )}
                />
              </Table>
            }
          />
        </div>
        <div className="fmtm-w-[35%]">
          <InfographicsCard header={`Total Contributors: 25`} body={<CustomPieChart />} />
        </div>
      </div>
      <div className="fmtm-w-[100%]">
        <InfographicsCard header="Planned vs Actual" body={<CustomLineChart />} />
      </div>

      <div>
        <TaskSubmissions />
      </div>
    </div>
  );
};

export default SubmissionsInfographics;
