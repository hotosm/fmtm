import React, { useState } from 'react';
import AssetModules from '../../shared/AssetModules.js';
import { CustomSelect } from '../../components/common/Select.js';
import windowDimention from '../../hooks/WindowDimension';
import Table, { TableHeader } from '../../components/common/CustomTable';
import { fontFamily } from '@mui/system';

const SubmissionsTable = () => {
  const [showFilter, setShowFilter] = useState(true);
  const { windowSize } = windowDimention();
  const items = [{ name: 'haha' }];

  const TableFilter = () => (
    <div className="fmtm-flex fmtm-items-center fmtm-justify-between fmtm-flex-col sm:fmtm-flex-row fmtm-gap-4">
      <div
        className={`fmtm-bg-white ${
          windowSize.width < 2000 ? 'fmtm-w-full md:fmtm-w-fit' : 'fmtm-w-fit'
        } fmtm-flex xl:fmtm-items-end fmtm-gap-2 xl:fmtm-gap-8 fmtm-px-4 fmtm-rounded-xl fmtm-relative fmtm-pr-6 fmtm-flex-col xl:fmtm-flex-row fmtm-py-2 fmtm-pt-3 xl:fmtm-py-2  fmtm-my-2`}
      >
        <div className="fmtm-flex fmtm-justify-between fmtm-items-center fmtm-gap-8">
          <div className="fmtm-flex fmtm-items-center fmtm-gap-2 fmtm-mb-1 fmtm-relative fmtm-w-fit">
            <div>
              <AssetModules.FilterAltOutlinedIcon className="fmtm-text-grey-700" />
            </div>
            <p className="fmtm-text-sm fmtm-mt-1 fmtm-text-grey-700 fmtm-font-bold">FILTER</p>
            <div className="fmtm-absolute -fmtm-right-3 -fmtm-top-2 fmtm-w-4 fmtm-h-4 fmtm-rounded-full  fmtm-bg-primaryRed fmtm-flex fmtm-justify-center fmtm-items-center">
              <p className=" fmtm-text-xs fmtm-text-white">2</p>
            </div>
          </div>
          <button className="fmtm-w-fit fmtm-text-sm fmtm-text-grey-700 fmtm-font-bold   hover:fmtm-text-red-700 fmtm-duration-150 fmtm-truncate fmtm-block xl:fmtm-hidden">
            CLEAR ALL
          </button>
        </div>
        {showFilter && (
          <div
            className={`fmtm-grid ${
              windowSize.width < 500 ? 'fmtm-grid-cols-1' : 'fmtm-grid-cols-2 lg:fmtm-grid-cols-4'
            } fmtm-gap-4`}
          >
            <div className={`${windowSize.width < 500 ? 'fmtm-w-full' : 'fmtm-w-[11rem]'}`}>
              <CustomSelect
                title="Task Id"
                placeholder="Select"
                data={[]}
                dataKey="value"
                value={''}
                valueKey="value"
                label="label"
                onValueChange={() => {}}
                errorMsg=""
                className="fmtm-text-grey-700 fmtm-text-sm !fmtm-mb-0"
              />
            </div>
            <div className={`${windowSize.width < 500 ? 'fmtm-w-full' : 'fmtm-w-[11rem]'}`}>
              <CustomSelect
                title="Submitted By"
                placeholder="Select"
                data={[]}
                dataKey="value"
                value={''}
                valueKey="value"
                label="label"
                onValueChange={() => {}}
                errorMsg=""
                className="fmtm-text-grey-700 fmtm-text-sm !fmtm-mb-0"
              />
            </div>
            <div className={`${windowSize.width < 500 ? 'fmtm-w-full' : 'fmtm-w-[11rem]'}`}>
              <CustomSelect
                title="Review State"
                placeholder="Select"
                data={[]}
                dataKey="value"
                value={''}
                valueKey="value"
                label="label"
                onValueChange={() => {}}
                errorMsg=""
                className="fmtm-text-grey-700 fmtm-text-sm !fmtm-mb-0"
              />
            </div>
            <div className={`${windowSize.width < 500 ? 'fmtm-w-full' : 'fmtm-w-[11rem]'}`}>
              <CustomSelect
                title="Submitted Date"
                placeholder="Select"
                data={[]}
                dataKey="value"
                value={''}
                valueKey="value"
                label="label"
                onValueChange={() => {}}
                errorMsg=""
                className="fmtm-text-grey-700 fmtm-text-sm !fmtm-mb-0"
              />
            </div>
          </div>
        )}
        <button
          className={`fmtm-w-fit fmtm-text-sm fmtm-text-grey-700 fmtm-font-bold fmtm-mb-1  hover:fmtm-text-red-700 fmtm-duration-150 fmtm-truncate fmtm-hidden xl:fmtm-block`}
        >
          CLEAR ALL
        </button>
        <div
          className={`fmtm-group fmtm-absolute -fmtm-right-3 ${
            showFilter
              ? 'fmtm-top-[45%] sm:fmtm-top-20 lg:fmtm-top-9 xl:fmtm-top-5'
              : 'fmtm-top-2 xl:fmtm-top-1 fmtm-rotate-180'
          } fmtm-rounded-full  fmtm-w-7 fmtm-h-7 fmtm-bg-white fmtm-border-[1px] fmtm-border-gray-300 fmtm-flex fmtm-justify-center fmtm-items-center fmtm-pl-2 hover:fmtm-border-primaryRed fmtm-duration-150`}
          onClick={() => setShowFilter(!showFilter)}
        >
          <AssetModules.ArrowBackIosIcon
            className="fmtm-text-grey-700 group-hover:fmtm-text-primaryRed fmtm-duration-150"
            style={{ fontSize: '18px' }}
          />
        </div>
      </div>
      <div className="fmtm-w-full fmtm-flex fmtm-justify-end sm:fmtm-w-fit">
        <button className="fmtm-px-4 fmtm-py-1 fmtm-bg-primaryRed fmtm-flex fmtm-items-center fmtm-w-fit fmtm-rounded-lg fmtm-gap-2 hover:fmtm-bg-red-700 fmtm-duration-150">
          <AssetModules.ReplayIcon className="fmtm-text-white" style={{ fontSize: '18px' }} />{' '}
          <p className="fmtm-text-white fmtm-pt-1">Refresh</p>
        </button>
      </div>
    </div>
  );
  return (
    <div className="fmtm-font-archivo">
      <TableFilter />
      <Table data={items} flag="dashboard" onRowClick={() => {}} isLoading={false}>
        <TableHeader
          dataField="SN"
          headerClassName="snHeader"
          rowClassName="snRow"
          dataFormat={(row, _, index) => <span>{index + 1}</span>}
        />
        <TableHeader
          dataField="Submitted By"
          headerClassName="codeHeader"
          rowClassName="codeRow"
          dataFormat={(row) => (
            <div className="fmtm-w-[7rem] fmtm-overflow-hidden fmtm-truncate" title={row?.name}>
              <span className="fmtm-text-[15px]">{row?.name}</span>
            </div>
          )}
        />
        <TableHeader
          dataField="Name"
          headerClassName="codeHeader"
          rowClassName="codeRow"
          dataFormat={(row) => (
            <div className="fmtm-w-[7rem] fmtm-overflow-hidden fmtm-truncate" title={row?.name}>
              <span className="fmtm-text-[15px]">{row?.name}</span>
            </div>
          )}
        />
        <TableHeader
          dataField="Age"
          headerClassName="codeHeader"
          rowClassName="codeRow"
          dataFormat={(row) => (
            <div className="fmtm-w-[7rem] fmtm-overflow-hidden fmtm-truncate" title={row?.name}>
              <span className="fmtm-text-[15px]">{row?.name}</span>
            </div>
          )}
        />
        <TableHeader
          dataField="Building Details"
          headerClassName="codeHeader"
          rowClassName="codeRow"
          dataFormat={(row) => (
            <div className="fmtm-w-[7rem] fmtm-overflow-hidden fmtm-truncate" title={row?.name}>
              <span className="fmtm-text-[15px]">{row?.name}</span>
            </div>
          )}
        />
        <TableHeader
          dataField="Building GPS Location specific to gate"
          headerClassName="codeHeader"
          rowClassName="codeRow"
          dataFormat={(row) => (
            <div className="fmtm-w-[7rem] fmtm-max-w-[7rem]fmtm-overflow-hidden fmtm-truncate" title={row?.name}>
              <span className="fmtm-text-[15px]">{row?.name}</span>
            </div>
          )}
        />
        <TableHeader
          dataField="Type"
          headerClassName="codeHeader"
          rowClassName="codeRow"
          dataFormat={(row) => (
            <div className="fmtm-w-[7rem] fmtm-overflow-hidden fmtm-truncate" title={row?.name}>
              <span className="fmtm-text-[15px]">{row?.name}</span>
            </div>
          )}
        />
        <TableHeader
          dataField="Number of Storey"
          headerClassName="censusHeader"
          rowClassName="censusRow"
          dataFormat={(row) => (
            <div className="fmtm-w-[7rem] fmtm-overflow-hidden fmtm-truncate" title={row?.name}>
              <span className="fmtm-text-[15px]">{row?.name}</span>
            </div>
          )}
        />
        <TableHeader
          dataField="Building Use"
          headerClassName="censusHeader"
          rowClassName="censusRow"
          dataFormat={(row) => (
            <div className="fmtm-w-[7rem] fmtm-overflow-hidden fmtm-truncate" title={row?.name}>
              <span className="fmtm-text-[15px]">{row?.name}</span>
            </div>
          )}
        />
        <TableHeader
          dataField="Status"
          headerClassName="censusHeader"
          rowClassName="censusRow"
          dataFormat={(row) => (
            <div className="fmtm-w-[7rem] fmtm-overflow-hidden fmtm-truncate" title={row?.name}>
              <span className="fmtm-text-[15px]">{row?.name}</span>
            </div>
          )}
        />
        <TableHeader
          dataField="Actions"
          headerClassName="updatedHeader"
          rowClassName="updatedRow"
          dataFormat={(row) => (
            <div className="fmtm-w-[7rem] fmtm-overflow-hidden fmtm-truncate fmtm-text-center">
              <AssetModules.VisibilityOutlinedIcon className="fmtm-text-[#545454]" />{' '}
              <span className="fmtm-text-primaryRed fmtm-border-[1px] fmtm-border-primaryRed fmtm-mx-1"></span>{' '}
              <AssetModules.CheckOutlinedIcon className="fmtm-text-[#545454]" />{' '}
              <span className="fmtm-text-primaryRed fmtm-border-[1px] fmtm-border-primaryRed fmtm-mx-1"></span>{' '}
              <AssetModules.DeleteIcon className="fmtm-text-[#545454]" />
            </div>
          )}
        />
      </Table>
      <div
        style={{ fontFamily: 'BarlowMedium' }}
        className="fmtm-flex fmtm-items-center fmtm-text-sm fmtm-gap-4 fmtm-justify-end fmtm-mt-2"
      >
        <p>1 - 7 of 20</p>
        <div className="fmtm-flex fmtm-gap-2 fmtm-mb-1">
          <div>
            <AssetModules.ArrowLeftIcon className="fmtm-text-[#545454]" />
          </div>
          <div>
            <AssetModules.ArrowRightIcon className="fmtm-text-[#545454]" />
          </div>
        </div>
        <p>Jump to</p>
        <input
          type="text"
          className="fmtm-border-[1px] fmtm-border-[#E7E2E2] fmtm-rounded-sm fmtm-w-11 fmtm-outline-none"
        />
      </div>
    </div>
  );
};

export default SubmissionsTable;
