# ODKConvert

**Whats the ODKConvert?**

ODKConvert is a command-line tool that allows you to convert Open Data Kit (ODK) data files to OpenStreetMap (OSM) XML format. It is part of the Field Mapping Tools for Mapping (FMTM) project and is used to handle all communication with ODK Central.

# Here is a step-by-step guide on how to use ODKConvert:

1. **Install ODKConvert:**
ODKConvert is a Python package and can be installed using pip. If you don't have pip installed, you can install it using your system's package manager. Once pip is installed, run the following command to install ODKConvert:

    ``` pip install odkconvert ```


2. **Set up your environment:**
Before you can use ODKConvert, you need to set up your environment. This includes creating a configuration file and setting up your ODK Central credentials.
To create a configuration file, run the following command:

    ``` odkconvert init ```

This will create a configuration file in your home directory called ```.odkconvert.yaml```. You can edit this file to configure your environment.

To set up your ODK Central credentials, you can either specify them in the configuration file or pass them as command-line arguments when running ODKConvert. Here's an example of how to pass them as command-line arguments:

```odkconvert --username <your_username> --password <your_password> ...```

3. **Convert your ODK data files:**
Once you have set up your environment, you can use ODKConvert to convert your ODK data files. To do this, run the following command:

    ```odkconvert convert --format geojson <input_file> <output_file>```

    This will convert your data to GeoJSON format.


And that's it! With these simple steps, you can use ODKConvert to convert your ODK data files to OSM XML format, or any other supported format. If you need more information on how to use ODKConvert or the FMTM project, you can refer to the documentation at https://docs.fmtm.info/.
