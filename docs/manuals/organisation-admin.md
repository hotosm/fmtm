# Steps To Create A Project In FMTM

Go to [fmtm]

1. - Setting up your field mapping project needs following the steps below;
   - Login to fmtm first to see the option of creating the project.

   ![image](https://github.com/user-attachments/assets/6bf8604b-d44c-4488-a8c6-5312fb75a975)

   - If you are not logged in, the option of create a new project is
     not visible not visible.
   - Start by filling in the project basic information such as the name,
     description,
     hashtag, etc. This captures essential information about your project.
   - Finally click Next to proceed.

   ![image](https://github.com/user-attachments/assets/c65c4ae2-d9be-4e45-ac71-a8b5653baba3)

2. - You can draw a freehand polygon on a map interface or you can upload
     the AOI file.
   - Click on Upload file button to upload the AOI file. The file is only
     supported by Geojson format.
   - Review the displayed map that corresponds to your selected area and
     click on "Next".

   ![image](https://github.com/user-attachments/assets/64aeda34-c682-4fdc-8c2f-1fd83e29c61f)

3. - You need to upload a survey that you are going to work on.
   - You may choose to upload a pre-Configured XLSForm or browse the forms.
   - Click the UploadXLSForm if you are uploading the file or download forms
     by clicking Download form.
   - Finally click Next to proceed.

   ![image](https://github.com/user-attachments/assets/cdf1e050-42ec-4149-bf97-0d841bc5117f)

4. - In mapping data we you shall choose the geometry to use by clicking in
     the button under
     the heading, what type of geometry
   - If you want to upload your own, click in Upload custom mapdata or else
     go with the default
     one of fetch data from OSM
   - You can also upload additional map feature to have multiple feature
     selection supported.

   ![image](https://github.com/user-attachments/assets/8df7c0fc-9a14-4d2d-bfdf-9fb8d9e92b89)

5. - The final step is task splitting which can be performed on three
     different ways. you
     can split the task on square of size you want.
   - The second option is to choose area as task where you can use single
     polygon as a task. And the task splitting algorithm which splits
     the tasks with average number of features which is provided by project
     creator.
   - The task splitting may take few seconds to few minutes considering
     the feature count and size of AOI. Click on "Submit" to create project.

   ![image](https://github.com/user-attachments/assets/7eeaf7ed-c13d-4444-aeeb-d71aed4fee8e)

## Guidelines / Common Questions

### Defining the Project Boundary

- Confirm the exact area for the survey before creating the project,
  as the project boundary cannot be edited once the project is created.

#### Preparing Map Features

- Ensure you have the map features ready for the area you plan to
  survey before starting project creation.
- The files should be in GeoJSON format, use the WGS coordinate
  system with EPSG 4326, and must not include a Z-coordinate.
  The map feature file should follow the osm tags structure.
- Below is a sample of the required file structure:

  ```json
  {
     "type": "Feature",
     "properties": { "full_id": "r9517874",
        "osm_id": "9517874",
        "osm_type": "relation"
        "tags": {"building": "yes"},
        "type": "multipolygon",
        "name": "",
        "building:levels": "" },
     "geometry": { "type": "MultiPolygon", "coordinates": [ [ [
        [ -3.9618848, 5.3041323 ],
        [ -3.9615121, 5.3041457 ],
        [ -3.9615028, 5.3038906 ],
        [ -3.9618755, 5.3038772 ],
        [ -3.9618848, 5.3041323 ]
     ],
     [
        [ -3.9620167, 5.3042236 ],
        [ -3.9620143, 5.3041258 ],
        [ -3.9619839, 5.3041266 ],
        [ -3.9619757, 5.3037882 ],
        [ -3.9614038, 5.3038019 ],
        [ -3.9614144, 5.3042381 ],
        [ -3.9620167, 5.3042236 ]
     ] ] ] }
  },
  ```

- You may download features from OpenStreetMap (OSM) by clicking on
  Fetch data from osm with FMTM project creation; however, note that
  FMTM is not responsible for the data quality of features extracted
  from OSM.
- Currently, available types of survey features are Buildings and
  Healthcare only. We plan to add more types of features moving ahead.
- Project managers can also upload supporting map features. Note that
  these secondary features can’t be surveyed but selected for respective
  primary features.

#### XLS Form Preparation

- Be prepared with the XLS form for the project.
- If updates are required to the form, you can edit the XLS form even
  after the project is created.
- Note that a few fields in the beginning and end of the form will be
  injected to ask for some feature verification.
- So project managers are requested to fill up the form through odk
  or download the form after the project is created to know about the
  field injected. You can also get the fields injected from our documentation

  ![Here](https://docs.fmtm.dev/manuals/xlsform-design/#injected-fields-in-the-fmtm-xls-form)

  Also read carefully the overview in the left section of each step to
  understand the details
  of the functionalities.

#### Uploading Custom Imagery

- If you have custom imagery that you want to use as basemap during field
  mapping activity, then you have to add the TMS link of that imagery
  during the first step of project creation.

- Click on _I would like to include my own imagery layer for reference_
  in the first step to add TMS URL. You can get URL by uploading it in
  openaerialmap.

#### ODK Central Credentials

- To store your submissions in ODK Central, you need to have valid
  ODK Central credentials. You can obtain these by hosting your own
  ODK Central server. If you don’t have access to a personal ODK Central
  server, you can use HOT’s server by selecting HOT as your organization.
