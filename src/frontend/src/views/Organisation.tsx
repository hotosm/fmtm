import React, { useEffect, useState } from 'react';
import CoreModules from '@/shared/CoreModules';
import AssetModules from '@/shared/AssetModules';
import environment from '@/environment';
import { OrganisationDataService } from '@/api/OrganisationService';
import { user_roles } from '@/types/enums';

const Organisation = () => {
  const cardStyle = {
    padding: 2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'pointer',
    gap: 5,
  };

  const url = 'https://fmtm.naxa.com.np/d907cf67fe587072a592.png';

  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [verifiedTab, setVerifiedTab] = useState<boolean>(false);
  const token = CoreModules.useAppSelector((state) => state.login.loginToken);

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  const dispatch = CoreModules.useAppDispatch();

  const oraganizationData: any = CoreModules.useAppSelector((state) => state.organisation.oraganizationData);
  const filteredCardData = oraganizationData?.filter((data) =>
    data.name.toLowerCase().includes(searchKeyword.toLowerCase()),
  );

  useEffect(() => {
    dispatch(OrganisationDataService(`${import.meta.env.VITE_API_URL}/organisation/`));
  }, []);

  return (
    <CoreModules.Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        background: '#f0efef',
        flex: 1,
        gap: 2,
      }}
      className="fmtm-p-5"
    >
      <div className="fmtm-flex fmtm-flex-col md:fmtm-flex-row md:fmtm-justify-between md:fmtm-items-center">
        <CoreModules.Box>
          <CoreModules.Tabs>
            <CoreModules.Tab
              label="All"
              sx={{
                background: activeTab === 0 ? 'grey' : 'white',
                color: activeTab === 0 ? 'white' : 'grey',
                minWidth: 'fit-content',
                width: 'auto',
                '&:hover': { backgroundColor: '#999797', color: 'white' },
                fontSize: ['14px', '16px', '16px'],
                minHeight: ['26px', '36px', '36px'],
                height: ['30px', '36px', '36px'],
                px: ['12px', '16px', '16px'],
              }}
              className="fmtm-duration-150"
              onClick={() => setActiveTab(0)}
            />
            <CoreModules.Tab
              label="My Organizations"
              sx={{
                background: activeTab === 1 ? 'grey' : 'white',
                color: activeTab === 1 ? 'white' : 'grey',
                marginLeft: ['8px', '12px', '12px'],
                minWidth: 'fit-content',
                width: 'auto',
                '&:hover': { backgroundColor: '#999797', color: 'white' },
                fontSize: ['14px', '16px', '16px'],
                minHeight: ['26px', '36px', '36px'],
                height: ['30px', '36px', '36px'],
                px: ['12px', '16px', '16px'],
              }}
              className="fmtm-duration-150"
              onClick={() => setActiveTab(1)}
            />
            <CoreModules.Link to={'/create-organization'}>
              <CoreModules.Button
                variant="outlined"
                color="error"
                startIcon={<AssetModules.AddIcon />}
                sx={{
                  marginLeft: ['8px', '12px', '12px'],
                  minWidth: 'fit-content',
                  width: 'auto',
                  fontWeight: 'bold',
                  minHeight: ['26px', '36px', '36px'],
                  height: ['30px', '36px', '36px'],
                  px: ['12px', '16px', '16px'],
                }}
              >
                New
              </CoreModules.Button>
            </CoreModules.Link>
          </CoreModules.Tabs>
        </CoreModules.Box>
        {token !== null && token['role'] && token['role'] === user_roles.ADMIN && (
          <CoreModules.Box>
            <CoreModules.Tabs>
              <CoreModules.Tab
                label="To be Verified"
                sx={{
                  background: !verifiedTab ? 'grey' : 'white',
                  color: !verifiedTab ? 'white' : 'grey',
                  minWidth: 'fit-content',
                  width: 'auto',
                  '&:hover': { backgroundColor: '#999797', color: 'white' },
                  fontSize: ['14px', '16px', '16px'],
                  minHeight: ['26px', '36px', '36px'],
                  height: ['30px', '36px', '36px'],
                  px: ['12px', '16px', '16px'],
                }}
                className="fmtm-duration-150"
                onClick={() => setVerifiedTab(false)}
              />
              <CoreModules.Tab
                label="Verified"
                sx={{
                  background: verifiedTab ? 'grey' : 'white',
                  color: verifiedTab ? 'white' : 'grey',
                  marginLeft: ['8px', '12px', '12px'],
                  minWidth: 'fit-content',
                  width: 'auto',
                  '&:hover': { backgroundColor: '#999797', color: 'white' },
                  fontSize: ['14px', '16px', '16px'],
                  minHeight: ['26px', '36px', '36px'],
                  height: ['30px', '36px', '36px'],
                  px: ['12px', '16px', '16px'],
                }}
                className="fmtm-duration-150"
                onClick={() => setVerifiedTab(true)}
              />
            </CoreModules.Tabs>
          </CoreModules.Box>
        )}
      </div>
      <CoreModules.Box>
        <CoreModules.TextField
          variant="outlined"
          size="small"
          placeholder="Search organization"
          value={searchKeyword}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <CoreModules.InputAdornment position="start">
                <AssetModules.SearchIcon />
              </CoreModules.InputAdornment>
            ),
          }}
          className="fmtm-min-w-[14rem] lg:fmtm-w-[20%]"
        />
      </CoreModules.Box>
      <div>
        <p className="fmtm-text-[#9B9999]">
          Showing {filteredCardData?.length} of {oraganizationData?.length} organizations
        </p>
      </div>
      <CoreModules.Box className="fmtm-grid fmtm-grid-cols-1 md:fmtm-grid-cols-2 fmtm-gap-5">
        {filteredCardData?.map((data, index) => (
          <CoreModules.Card key={index} sx={cardStyle}>
            <CoreModules.CardMedia
              component="img"
              src={data.logo ? data.logo : 'http://localhost:7051/d907cf67fe587072a592.png'}
              sx={{ width: '150px' }}
            />
            <CoreModules.Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <CoreModules.Typography
                variant="subtitle1"
                sx={{ textTransform: 'uppercase' }}
                className="fmtm-line-clamp-1"
                title={data.name}
              >
                {data.name}
              </CoreModules.Typography>
              <CoreModules.Typography
                variant="subtitle3"
                title={data.description}
                className="fmtm-max-h-[4.5em] fmtm-line-clamp-2"
              >
                {data.description}
              </CoreModules.Typography>
              <CoreModules.Link to={data.url} target="_blank" style={{ textDecoration: 'none' }}>
                <CoreModules.Avatar alt={data.title} src={data.logo} sx={{ height: '25px', width: '25px' }}>
                  {!data.logo || data.logo === 'string' ? data.name[0] : url}
                </CoreModules.Avatar>
              </CoreModules.Link>
            </CoreModules.Box>
          </CoreModules.Card>
        ))}
      </CoreModules.Box>
    </CoreModules.Box>
  );
};

export default Organisation;
