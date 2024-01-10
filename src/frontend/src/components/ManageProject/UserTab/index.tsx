import React, { useState } from 'react';
import AssignTab from './AssignTab';
import InviteTab from './InviteTab';
import Table, { TableHeader } from '../../common/CustomTable';
import AssetModules from '../../../shared/AssetModules.js';

const tabList = ['Assign', 'Invite'];
const data = [
  {
    username: 'Adarsha Kumar Sharma',
    role: 'Municipal Admin',
    user_status: 'Active',
    last_contribution: '1/5/2024',
  },
  {
    username: 'Adarsha Kumar Sharma',
    role: 'Municipal Admin',
    user_status: 'Active',
    last_contribution: '1/5/2024',
  },
  {
    username: 'Adarsha Kumar Sharma',
    role: 'Municipal Admin',
    user_status: 'Active',
    last_contribution: '1/5/2024',
  },
  {
    username: 'Adarsha Kumar Sharma',
    role: 'Municipal Admin',
    user_status: 'Active',
    last_contribution: '1/5/2024',
  },
  {
    username: 'Adarsha Kumar Sharma',
    role: 'Municipal Admin',
    user_status: 'Active',
    last_contribution: '1/5/2024',
  },
];

const UserTab = () => {
  const [tabView, setTabView] = useState<'Assign' | 'Invite' | string>('Assign');

  return (
    <div className="fmtm-flex fmtm-flex-col lg:fmtm-flex-row fmtm-gap-10 fmtm-w-full">
      <div className=" fmtm-w-[23%] fmtm-min-w-[14rem]">
        <div className="fmtm-flex fmtm-gap-3 fmtm-mb-5">
          {tabList.map((tab) => (
            <div
              key={tab}
              className={`fmtm-w-fit fmtm-text-[#9B9999] fmtm-px-2 fmtm-border-b-[1px] hover:fmtm-border-primaryRed fmtm-duration-300 fmtm-cursor-pointer ${
                tabView === tab ? 'fmtm-border-primaryRed' : 'fmtm-border-transparent'
              }`}
              onClick={() => setTabView(tab)}
            >
              {tab}
            </div>
          ))}
        </div>
        <div>{tabView === 'Assign' ? <AssignTab /> : <InviteTab />}</div>
      </div>
      {/* <div className="fmtm-h-full fmtm-bg-red-400 fmtm-w-full"> */}
      <Table style={{ 'max-height': '60vh' }} data={data} onRowClick={() => {}} isLoading={false}>
        <TableHeader
          dataField="SN"
          headerClassName="snHeader"
          rowClassName="snRow"
          dataFormat={(row, _, index) => <span>{index + 1}</span>}
        />

        <TableHeader
          dataField="Username"
          headerClassName="codeHeader"
          rowClassName="codeRow"
          dataFormat={(row) => (
            <div className="fmtm-w-[18rem] fmtm-overflow-hidden fmtm-truncate" title={row?.username}>
              <span className="fmtm-text-[15px]">{row?.username}</span>
            </div>
          )}
        />
        <TableHeader
          dataField="Role"
          headerClassName="codeHeader"
          rowClassName="codeRow"
          dataFormat={(row) => (
            <div className="fmtm-w-[7rem] fmtm-overflow-hidden fmtm-truncate" title={row?.role}>
              <span className="fmtm-text-[15px]">{row?.role}</span>
            </div>
          )}
        />
        <TableHeader
          dataField="User Status"
          headerClassName="codeHeader"
          rowClassName="codeRow"
          dataFormat={(row) => (
            <div className="fmtm-w-[7rem] fmtm-overflow-hidden fmtm-truncate" title={row?.user_status}>
              <span className="fmtm-text-[15px]">{row?.user_status}</span>
            </div>
          )}
        />
        <TableHeader
          dataField="Last Contribution"
          headerClassName="codeHeader"
          rowClassName="codeRow"
          dataFormat={(row) => (
            <div className="fmtm-w-[7rem] fmtm-overflow-hidden fmtm-truncate" title={row?.last_contribution}>
              <span className="fmtm-text-[15px]">{row?.last_contribution}</span>
            </div>
          )}
        />
        <TableHeader
          dataField=""
          headerClassName="codeHeader"
          rowClassName="codeRow"
          dataFormat={(row) => (
            <div className="fmtm-w-[1.5rem] fmtm-overflow-hidden fmtm-truncate" title={row?.last_contribution}>
              <AssetModules.MoreVertIcon />
            </div>
          )}
        />
      </Table>
      {/* </div> */}
    </div>
  );
};

export default UserTab;
