import React from 'react';

type sectionType = 'Project Details' | 'Upload Area' | 'Upload Survey' | 'Map Features' | 'Split Tasks';

const ProjectDetails = () => (
  <div className="fmtm-text-gray-500 lg:fmtm-flex lg:fmtm-flex-col lg:fmtm-gap-3">
    <span>
      Fill in your project basic information such as name, description, hashtag, etc. This captures essential
      information about your project.
    </span>
    <span>To complete the first step, you will need the login credentials of ODK Central Server.</span>{' '}
    <div>
      <a
        href="https://docs.getodk.org/central-install-digital-ocean/"
        className="fmtm-text-blue-600 hover:fmtm-text-blue-700 fmtm-cursor-pointer fmtm-w-fit"
        target="_"
      >
        Here{' '}
      </a>
      <span>are the instructions for setting up a Central ODK Server on Digital Ocean, if you haven’t already.</span>
    </div>
    <div>
      You can use the 'Custom TMS URL' option to integrate high-resolution aerial imagery like OpenAerialMap{' '}
      <a
        href="https://openaerialmap.org/"
        className="fmtm-text-blue-600 hover:fmtm-text-blue-700 fmtm-cursor-pointer fmtm-w-fit"
        target="_"
      >
        (OAM)
      </a>
      . Simply obtain the TMS URL and paste it into the custom TMS field. More details:{' '}
      <a
        href="https://docs.openaerialmap.org/"
        className="fmtm-text-blue-600 hover:fmtm-text-blue-700 fmtm-cursor-pointer fmtm-w-fit"
        target="_"
      >
        OpenAerialMap Documentation
      </a>
      .
    </div>
  </div>
);

const UploadArea = () => (
  <div className="fmtm-text-gray-500 lg:fmtm-flex lg:fmtm-flex-col lg:fmtm-gap-3">
    <span>You can choose to upload the AOI. Note: The file upload only supports .geojson format. </span>
    <div>
      <p>You may also draw a freehand polygon on map interface.</p> <p>Click on the reset button to redraw the AOI.</p>
    </div>
    <span>The total area of the AOI is also calculated and displayed on the screen.</span>
    <span>
      <b>Note:</b> The uploaded geojson should be in EPSG:4326 coordinate system.
    </span>
  </div>
);

const UploadSurvey = () => (
  <div className="fmtm-text-gray-500 lg:fmtm-flex lg:fmtm-flex-col lg:fmtm-gap-3">
    <span>
      You may choose a pre-configured form, or upload a custom XLS form. Click{' '}
      <a
        href="https://hotosm.github.io/osm-fieldwork/about/xlsforms/"
        target="_"
        className="fmtm-text-blue-600 hover:fmtm-text-blue-700 fmtm-cursor-pointer"
      >
        here
      </a>{' '}
      to learn more about XLSForm building.{' '}
    </span>
    <span>
      For creating a custom XLS form, there are few essential fields that must be present for FMTM to function. You may
      either download the sample XLS file and modify all fields that are not hidden, or edit the sample form
      interactively in the browser.
    </span>
    <span>
      <b>Note:</b> Additional questions will be incorporated into your custom form to assess the digitization status.
    </span>
  </div>
);

const MapFeature = () => (
  <div className="fmtm-text-gray-500 lg:fmtm-flex lg:fmtm-flex-col lg:fmtm-gap-3">
    <span>You may either choose to use OSM data, or upload your own data for the mapping project.</span>
    <span> The relevant map features that exist on OSM are imported based on the select map area.</span>{' '}
    <span>
      You can use these map features to use the 'select from map' functionality from ODK that allows you to select the
      feature to collect data for.
    </span>{' '}
    <span>
      Additional datasets might be important if your survey consists of more than one feature to select. For example,
      selecting a building as the primary feature, with an associated road, or nearby hospital. In this case, the roads
      or hospital features would be uploaded separately. Note that these features will not be factored in when dividing
      the primary features into task areas.
    </span>
  </div>
);

const SplitTasks = () => (
  <div className="fmtm-text-gray-500 lg:fmtm-flex lg:fmtm-flex-col lg:fmtm-gap-3">
    <span>You may choose how to divide an area into tasks for field mapping</span>
    <span>Divide area on squares split the AOI into squares based on user’s input in dimensions</span>
    <span>Choose area as task creates the number of tasks based on number of polygons in AOI</span>
    <span>
      Task splitting algorithm splits an entire AOI into smallers tasks based on linear networks (road, river) followed
      by taking into account the input of number of average buildings per task
    </span>
  </div>
);

const getDescription = (section: sectionType): React.JSX.Element => {
  switch (section) {
    case 'Project Details':
      return <ProjectDetails />;
    case 'Upload Area':
      return <UploadArea />;
    case 'Upload Survey':
      return <UploadSurvey />;
    case 'Map Features':
      return <MapFeature />;
    case 'Split Tasks':
      return <SplitTasks />;
    default:
      return <></>;
  }
};

const Description = ({ section }: { section: sectionType }) => {
  return (
    <div className="fmtm-bg-white lg:fmtm-w-[20%] xl:fmtm-w-[17%] fmtm-px-5 fmtm-py-6 lg:fmtm-h-full lg:fmtm-overflow-y-scroll lg:scrollbar">
      {' '}
      <h6 className="fmtm-text-xl fmtm-font-[600] fmtm-pb-2 lg:fmtm-pb-6">{section}</h6>
      {getDescription(section)}
    </div>
  );
};

export default Description;
