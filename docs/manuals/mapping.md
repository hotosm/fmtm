# Mapper Frontend Documentation

The **Mapper's page** was developed to provide a simpler, more intuitive
mapping experience.

## Part (A): Setup For Mapping

### Step 1: Install The Custom ODK Collect Mobile App

- The first time you load the project, you should be prompted to download
  the custom `.apk` from the upper right corner of your browser window
  usually represented by three horizontal lines (☰).

- Once downloaded, you should install the custom ODK Collect application.
  For installation, locate the downloaded ODK APK file usually found on
  downloads section of your file manager and tap install.

!!! tip

      If you already have ODK Collect installed, you may have to uninstall
      it first.

      You may have to enable installing from unknown sources in your device
      settings too.

### Step 2: Add metadata on odk application(Optional)

The metadata like username, email, phone number and device ID can be added
on odk from settings. This addition allows FMTM to track submission by
username and filter data by mapppers.

- Go to settings of odk project.
- Click on User and device identity.
- Click on form metadata and add username, phone number and email address.
  **Note:** The username may be prepopulated with the osm username of
  FMTM. Please confirm or update the username if necessary

### Step 3: Access the Mapper Frontend

- **Option 1:** Click the **Start Mapping** button on the project cards of
  explore project page.
- **Option 2:** Click the **Start Mapping** button on the project details page.
- **Option 3:** Go to `https://fmtm.hotosm.org/mapnow/<project_id>` to open
  the Mapper Frontend for a specific project.

!!! note

      This functionality is designed for mappers in the field, so it is
      recommended to use a mobile device to access it. Furthermore, mappers
      are encouraged to use Chrome based browser for field mapping activity.

### Step 4: Configure ODK Collect (once only)

- **Option 1:** Scan the QR code displayed on the Mapper Frontend using
  the custom ODK Collect mobile application.

- **Option 2:** Download the QR code and import it into ODK Collect to
  load the project. Follow the steps below:

  1. Open ODK Collect.
  2. Click the project name in the top right corner.
  3. Tap the **menu** icon (three horizontal dots).
  4. Select **Import QR Code**.
  5. Browse to the downloaded QR image and load the project.

If you missed the QR code pop-up, You can get the it anytime from
QR code tab on bottom navigation bar of the mapper's page.

!!! tip

      For a demonstration of the process above, click the **i** info icon
      on the QR Code tab of the mapper frontend.

### Step 5: Load Imagery (optional)

- You can load the reference base imagery by clicking on offline mode option
  (second tab on bottom navigation bar).
- Choose the layer you want to load and click on **Show on Map** to visualise
  the layer on map.
- The layer can also be stored for offline mapping by clicking
  **Store Offline**.

## Part (B): Mapping Features

### Select An Existing Feature

In most cases we are submitting a survey about a feature that already exists.

- Click on a task area: the features within will be displayed.
- Now click on a feature you wish to map: a popup will appear.
- Now click 'Map Feature In ODK': ODK Collect will open, with the
  feature pre-selected in the survey (no need to open the ODK map!).
- Complete the survey and submit.

!!! note

      You may manually click 'Start Mapping' for a task area.

      However, the task will be automatically locked for you
      if you map a feature within the task area.

### Mapping A New Feature

Sometimes the feature does not exist on the map yet!

- Click on a task area: a popup will display.
- At the top right, there is a button **Map New Feature**.
- Click on the map to create a new geometry.
- ODK Collect will be opened automatically to fill out the survey
  data for the newly created feature.

### Repeat The Process

- Once the form is submitted, you have to get back to FMTM and select the
  another feature for mapping.
- You also also have to click the **Sync Status** button to see the feature
  turn green.
- Select another feature to map (repeat from step 5)!

!!! note

      You need internet access to update the feature status.

      In a future release, this process will be handled seamlessly
      without user interaction.

## Upcoming improvements

Refer the milestone: <https://github.com/hotosm/fmtm/milestone/50>
