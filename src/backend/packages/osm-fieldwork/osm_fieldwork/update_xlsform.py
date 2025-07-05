#!/usr/bin/python3

# Copyright (c) Humanitarian OpenStreetMap Team
#
# This file is part of OSM-Fieldwork.
#
#     This is free software: you can redistribute it and/or modify
#     it under the terms of the GNU General Public License as published by
#     the Free Software Foundation, either version 3 of the License, or
#     (at your option) any later version.
#
#     This is distributed in the hope that it will be useful,
#     but WITHOUT ANY WARRANTY; without even the implied warranty of
#     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#     GNU General Public License for more details.
#
#     You should have received a copy of the GNU General Public License
#     along with OSM-Fieldwork.  If not, see <https:#www.gnu.org/licenses/>.
#

"""Update an existing XLSForm with additional fields useful for field mapping."""

import argparse
import asyncio
import logging
import re
import sys
from datetime import datetime
from io import BytesIO
from pathlib import Path
from typing import Optional
from uuid import uuid4

import pandas as pd
from python_calamine.pandas import pandas_monkeypatch

from osm_fieldwork.enums import DbGeomType
from osm_fieldwork.form_components.choice_fields import choices_df
from osm_fieldwork.form_components.mandatory_fields import (
    meta_df,
    create_survey_df,
    photo_collection_df,
    create_entity_df,
)
from osm_fieldwork.form_components.digitisation_fields import (
    digitisation_df, 
    digitisation_choices_df,
)
from osm_fieldwork.form_components.translations import INCLUDED_LANGUAGES, add_label_translations
from osm_fieldwork.xlsforms import xlsforms_path

log = logging.getLogger(__name__)

# Monkeypatch pandas to add calamine driver
pandas_monkeypatch()

# Constants
FEATURE_COLUMN = "feature"
NAME_COLUMN = "name"
TYPE_COLUMN = "type"

def standardize_xlsform_sheets(xlsform: dict) -> dict:
    """Standardizes column headers in both the 'survey' and 'choices' sheets of an XLSForm.

    - Strips spaces and lowercases all column headers.
    - Fixes formatting for columns with '::' (e.g., multilingual labels).

    Args:
        xlsform (dict): A dictionary with keys 'survey' and 'choices', each containing a DataFrame.

    Returns:
        dict: The updated XLSForm dictionary with standardized column headers.
    """

    def standardize_language_columns(df):
        """Standardize existing language columns.

        :param df: Original DataFrame with existing translations.
        :param DEFAULT_LANGAUGES: List of DEFAULT_LANGAUGES with their short codes, e.g., {"english": "en", "french": "fr"}.
        :param base_columns: List of base columns to check (e.g., 'label', 'hint', 'required_message').
        :return: Updated DataFrame with standardized and complete language columns.
        """
        base_columns = ["label", "hint", "required_message"]
        df.columns = df.columns.str.lower()
        existing_columns = df.columns.tolist()

        # Map existing columns and standardize their names
        for col in existing_columns:
            standardized_col = col
            for base_col in base_columns:
                if col.startswith(f"{base_col}::"):
                    match = re.match(rf"{base_col}::\s*(\w+)", col)
                    if match:
                        lang_name = match.group(1)
                        if lang_name in INCLUDED_LANGUAGES:
                            standardized_col = f"{base_col}::{lang_name}({INCLUDED_LANGUAGES[lang_name]})"

                elif col == base_col:  # if only label,hint or required_message then add '::english(en)'
                    standardized_col = f"{base_col}::english(en)"

                if col != standardized_col:
                    df.rename(columns={col: standardized_col}, inplace=True)
        return df

    def filter_df_empty_rows(df: pd.DataFrame, column: str = NAME_COLUMN):
        """Remove rows with None values in the specified column.

        NOTE We retain 'end group' and 'end group' rows even if they have no name.
        NOTE A generic df.dropna(how="all") would not catch accidental spaces etc.
        """
        if column in df.columns:
            # Only retain 'begin group' and 'end group' if 'type' column exists
            if "type" in df.columns:
                return df[(df[column].notna()) | (df["type"].isin(["begin group", "end group", "begin_group", "end_group"]))]
            else:
                return df[df[column].notna()]
        return df

    for sheet_name, sheet_df in xlsform.items():
        if sheet_df.empty:
            continue
        # standardize the language columns
        sheet_df = standardize_language_columns(sheet_df)
        sheet_df = filter_df_empty_rows(sheet_df)
        xlsform[sheet_name] = sheet_df

    return xlsform


def normalize_with_meta(row, meta_df):
    """Replace metadata in user_question_df with metadata from meta_df of mandatory fields if exists."""
    matching_meta = meta_df[meta_df["type"] == row[TYPE_COLUMN]]
    if not matching_meta.empty:
        for col in matching_meta.columns:
            row[col] = matching_meta.iloc[0][col]
    return row


def merge_dataframes(
        mandatory_df: pd.DataFrame, 
        user_question_df: pd.DataFrame, 
        digitisation_df: Optional[pd.DataFrame] = None,
        photo_collection_df: Optional[pd.DataFrame] = None,
        need_verification: Optional[bool] = True,
    ) -> pd.DataFrame:
    """
    Merge multiple Pandas dataframes together, removing duplicate fields.
    
    Arguments:
        mandatory_df: DataFrame containing required fields
        user_question_df: DataFrame containing user-specified questions
        digitisation_df: Optional DataFrame with digitisation fields
        photo_collection_df: Optional DataFrame with photo collection fields
        need_verification: Include geom verifiction questions
    
    Returns:
        pd.DataFrame: Merged DataFrame with duplicates removed
    """
    # If list_name present, use simpler merge logic
    if "list_name" in user_question_df.columns:
        frames = [mandatory_df, user_question_df]
        if digitisation_df is not None:
            frames.append(digitisation_df)
        if photo_collection_df is not None:
            frames.append(photo_collection_df)
        merged_df = pd.concat(frames, ignore_index=True)
        # NOTE here we remove duplicate PAIRS based on `list_name` and the name column
        return merged_df.drop_duplicates(subset=["list_name", NAME_COLUMN], ignore_index=True)
    
    # Normalize user questions if meta_df provided
    if meta_df is not None:
        user_question_df = user_question_df.apply(
            lambda row: normalize_with_meta(row, meta_df), 
            axis=1
        )
    
    # NOTE filter out 'end group' from duplicate check as they have empty NAME_COLUMN
    is_end_group = user_question_df["type"].isin(["end group", "end_group"])
    
    # Find duplicate fields
    digitisation_names = set() if digitisation_df is None else set(digitisation_df[NAME_COLUMN])
    photo_collection_names = set() if photo_collection_df is None else set(photo_collection_df[NAME_COLUMN])
    all_existing_names = set(mandatory_df[NAME_COLUMN]).union(digitisation_names).union(photo_collection_names)
    duplicate_fields = set(user_question_df[NAME_COLUMN]).intersection(all_existing_names)
    
    # Filter out duplicates but keep end group rows
    user_question_df_filtered = user_question_df[
        (~user_question_df[NAME_COLUMN].isin(duplicate_fields)) | is_end_group
    ]
    
    # We wrap the survey question in a group to easily disable all questions if the
    # feature does not exist. If we don't have the `feature_exists` question, then
    # wrapping in the group is unnecessary (all groups are flattened in processing anyway)
    if need_verification:
        survey_group = {
            "begin": (
                pd.DataFrame(
                    add_label_translations({
                        "type": ["begin group"],
                        "name": ["survey_questions"],
                        # Status 3 means collecting new feature
                        "relevant": "(${feature_exists} = 'yes') or (${status} = '3')",
                    })
                )
            ),
            "end": pd.DataFrame({"type": ["end group"]}
        )}

    else:
        # Do not include the survey group wrapper (empty dataframes)
        survey_group = {"begin": pd.DataFrame(), "end": pd.DataFrame()}

    
    frames = [
        mandatory_df,
        survey_group["begin"],
        user_question_df_filtered,
        survey_group["end"],
    ]
    
    if digitisation_df is not None:
        frames.append(digitisation_df)
    if photo_collection_df is not None:
        frames.append(photo_collection_df)
    
    return pd.concat(frames, ignore_index=True)


def append_select_one_from_file_row(df: pd.DataFrame, entity_name: str) -> pd.DataFrame:
    """Add a new select_one_from_file question to reference an Entity."""
    # Find the row index where name column = 'feature'
    select_one_from_file_index = df.index[df[NAME_COLUMN] == FEATURE_COLUMN].tolist()
    if not select_one_from_file_index:
        raise ValueError(f"Row with '{NAME_COLUMN}' == '{FEATURE_COLUMN}' not found in survey sheet.")

    # Find the row index after 'feature' row
    row_index_to_split_on = select_one_from_file_index[0] + 1

    additional_row = pd.DataFrame(
        {
            "type": [f"select_one_from_file {entity_name}.csv"],
            "name": [entity_name],
            "appearance": ["map"],
            "label::english(en)": [entity_name],
            "label::swahili(sw)": [entity_name],
            "label::french(fr)": [entity_name],
            "label::spanish(es)": [entity_name],
        }
    )

    # Prepare the row for calculating coordinates based on the additional entity
    coordinates_row = pd.DataFrame(
        {
            "type": ["calculate"],
            "name": [f"{entity_name}_geom"],
            "calculation": [f"instance('{entity_name}')/root/item[name=${{{entity_name}}}]/geometry"],
            "label::english(en)": [f"{entity_name}_geom"],  # translations not needed, calculated field
        }
    )
    # Insert the new row into the DataFrame
    top_df = df.iloc[:row_index_to_split_on]
    bottom_df = df.iloc[row_index_to_split_on:]
    return pd.concat([top_df, additional_row, coordinates_row, bottom_df], ignore_index=True)


async def append_field_mapping_fields(
    custom_form: BytesIO,
    form_name: str = f"fmtm_{uuid4()}",
    additional_entities: Optional[list[str]] = None,
    new_geom_type: DbGeomType = DbGeomType.POINT,
    need_verification_fields: bool = True,
    use_odk_collect: bool = False,
) -> tuple[str, BytesIO]:
    """Append mandatory fields to the XLSForm for use in Field-TM.

    Args:
        custom_form (BytesIO): The XLSForm data uploaded, wrapped in BytesIO.
        form_name (str): The friendly form name in ODK web view.
        additional_entities (list[str], optional): Add extra select_one_from_file fields to
            reference additional Entity lists (sets of geometries). Defaults to None.
        new_geom_type (DbGeomType): The type of geometry required when collecting
            new geometry data: point, line, polygon. Defaults to DbGeomType.POINT.
        need_verification_fields (bool): Whether to include verification fields.
            Defaults to True.
        use_odk_collect (bool): Whether to use ODK Collect-specific components.
            Defaults to False.

    Returns:
        tuple[str, BytesIO]: The xFormId and the updated XLSForm wrapped in BytesIO.
        
    Raises:
        ValueError: If required sheets are missing from the XLSForm.
    """
    log.info("Appending field mapping questions to XLSForm")

    custom_sheets = pd.read_excel(custom_form, sheet_name=None, engine="calamine")
    if "survey" not in custom_sheets:
        msg = "Survey sheet is required in XLSForm!"
        log.error(msg)
        raise ValueError(msg)
    
    custom_sheets = standardize_xlsform_sheets(custom_sheets)

    # Select appropriate form components based on target platform
    form_components = _get_form_components(use_odk_collect, new_geom_type, need_verification_fields)
    
    # Process survey sheet
    custom_sheets["survey"] = _process_survey_sheet(
        custom_sheets.get("survey"),
        form_components["survey_df"],
        form_components["digitisation_df"] if need_verification_fields else None,
        form_components["photo_collection_df"],
        need_verification=need_verification_fields,
    )
    
    # Process choices sheet
    custom_sheets["choices"] = _process_choices_sheet(
        custom_sheets.get("choices"), 
        form_components["choices_df"],
        form_components["digitisation_choices_df"],
    )

    # Process entities and settings sheets
    custom_sheets["entities"] = form_components["entities_df"]
    _validate_required_sheet(custom_sheets, "entities")
    
    # Configure form settings
    xform_id = _configure_form_settings(custom_sheets, form_name)
    
    # Handle additional entities if specified
    if additional_entities:
        custom_sheets["survey"] = _add_additional_entities(custom_sheets["survey"], additional_entities)
    
    output = BytesIO()
    with pd.ExcelWriter(output, engine="openpyxl") as writer:
        for sheet_name, df in custom_sheets.items():
            df.to_excel(writer, sheet_name=sheet_name, index=False)
    output.seek(0)
    return (xform_id, output)


def _get_form_components(
        use_odk_collect: bool,
        new_geom_type: DbGeomType,
        need_verification_fields: bool
    ) -> dict:
    """Select appropriate form components based on target platform."""
    if use_odk_collect:
        # Here we modify digitisation_df to include the `new_feature` field
        # NOTE we set digitisation_correct to 'yes' if the user is drawing a new geometry
        digitisation_correct_col = digitisation_df["name"] == "digitisation_correct"
        digitisation_df.loc[digitisation_correct_col, "calculation"] = "once(if(${new_feature} != '', 'yes', ''))"
        digitisation_df.loc[digitisation_correct_col, "read_only"] = "${new_feature} != ''"

    return {
        "survey_df": create_survey_df(use_odk_collect, new_geom_type, need_verification_fields),
        "choices_df": choices_df,
        "digitisation_df": digitisation_df,
        "photo_collection_df": photo_collection_df,
        "digitisation_choices_df": digitisation_choices_df,
        "entities_df": create_entity_df(use_odk_collect)
    }


def _process_survey_sheet(
        existing_survey: pd.DataFrame, 
        survey_df: pd.DataFrame, 
        digitisation_df: pd.DataFrame,
        photo_collection_df: pd.DataFrame,
        need_verification: Optional[bool] = True,
    ) -> pd.DataFrame:
    """Process and merge survey sheets."""
    log.debug("Merging survey sheet XLSForm data")
    return merge_dataframes(
        survey_df,
        existing_survey,
        digitisation_df=digitisation_df,
        photo_collection_df=photo_collection_df,
        need_verification=need_verification,
    )


def _process_choices_sheet(
        existing_choices: pd.DataFrame, 
        choices_df: pd.DataFrame, 
        digitisation_choices_df: pd.DataFrame,
    ) -> pd.DataFrame:
    """Process and merge choices sheets."""
    log.debug("Merging choices sheet XLSForm data")
    # Ensure the 'choices' sheet exists with required columns
    if existing_choices is None:
        existing_choices = pd.DataFrame(columns=["list_name", "name", "label::english(en)"])
    
    return merge_dataframes(
        choices_df,
        existing_choices,
        digitisation_df=digitisation_choices_df,
    )


def _validate_required_sheet(
        custom_sheets: dict, sheet_name: str
    ) -> None:
    """Validate that a required sheet exists."""
    if sheet_name not in custom_sheets:
        msg = f"{sheet_name} sheet is required in XLSForm!"
        log.error(msg)
        raise ValueError(msg)


def _configure_form_settings(custom_sheets: dict, form_name: str) -> str:
    """Configure form settings and extract/set form ID.
    
    Args:
        custom_sheets: Dictionary containing dataframes for each sheet
        form_name: Name of the form to be used as form_title
        
    Returns:
        str: The form ID (xform_id)
    """
    current_datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    # Check if settings sheet exists and create if needed
    if "settings" not in custom_sheets or custom_sheets["settings"].empty:
        xform_id = str(uuid4())
        custom_sheets["settings"] = pd.DataFrame([{
            "form_id": xform_id,
            "version": current_datetime,
            "form_title": form_name,
            "allow_choice_duplicates": "yes",
            "default_language": "en"
        }])
        
        log.debug(f"Created default settings with form_id: {xform_id}")
        return xform_id
    
    # Work with existing settings
    settings = custom_sheets["settings"]
    
    # Extract existing form id if present, else set to random uuid
    xform_id = settings["form_id"].iloc[0] if "form_id" in settings else str(uuid4())
    log.debug(f"Using form_id: {xform_id}")

    # Update settings
    log.debug(f"Setting xFormId = {xform_id} | version = {current_datetime} | form_name = {form_name}")
    
    settings["version"] = current_datetime
    settings["form_id"] = xform_id
    settings["form_title"] = form_name
    
    if "default_language" not in settings:
        settings["default_language"] = "en"
    
    return xform_id


def _add_additional_entities(
        survey_df: pd.DataFrame, 
        additional_entities: list[str]
    ) -> pd.DataFrame:
    """Add additional entity references to the survey sheet."""
    log.debug("Adding additional entity list reference to XLSForm")
    result_df = survey_df.copy()
    
    for entity_name in additional_entities:
        result_df = append_select_one_from_file_row(result_df, entity_name)
        
    return result_df


async def main():
    """Used for the `fmtm_xlsform` CLI command."""
    def str2bool(v):
        if isinstance(v, bool):
            return v
        if v.lower() in ('yes', 'true', 't', '1'):
            return True
        elif v.lower() in ('no', 'false', 'f', '0'):
            return False
        else:
            raise argparse.ArgumentTypeError('Boolean value expected.')

    parser = argparse.ArgumentParser(description="Append field mapping fields to XLSForm")
    parser.add_argument("-v", "--verbose", action="store_true", help="verbose output")
    parser.add_argument("-i", "--input", help="Input XLSForm file")
    parser.add_argument("-c", "--category", help="A category of demo form to use instead")
    parser.add_argument("-o", "--output", help="Output merged XLSForm filename")
    parser.add_argument("-a", "--additional-dataset-names", help="Names of additional entity lists to append")
    parser.add_argument(
        "-n",
        "--new-geom-type",
        type=DbGeomType,
        choices=list(DbGeomType),
        help="The type of new geometry",
        default=DbGeomType.POINT,
    )
    parser.add_argument(
        "-vr",
        "--need-verification-fields",
        type=str2bool,
        nargs='?',
        const=True,
        default=True,
        help="Requirement of verification questions (true/false)",
    )
    parser.add_argument(
        "-odk",
        "--use-odk-collect",
        type=str2bool,
        nargs='?',
        const=True,
        default=False,
        help="Use of ODK Collect (true/false)",
    )
    args = parser.parse_args()

    # If verbose, dump to the terminal
    if args.verbose is not None:
        logging.basicConfig(
            level=logging.DEBUG,
            format=("%(threadName)10s - %(name)s - %(levelname)s - %(message)s"),
            datefmt="%y-%m-%d %H:%M:%S",
            stream=sys.stdout,
        )

    if not args.output:
        log.error("You must provide an output file with the '-o' flag")
        parser.print_help()

    if args.input:
        input_file = Path(args.input)
    elif args.category:
        input_file = Path(f"{xlsforms_path}/{args.category}.yaml")
    else:
        log.error("Must choose one of '-i' for file input, or '-c' for category selection")
        parser.print_help()
        sys.exit(1)

    if not input_file.exists():
        log.error(f"The file does not exist: {str(input_file)}")
        sys.exit(1)

    with open(input_file, "rb") as file_handle:
        input_xlsform = BytesIO(file_handle.read())

    form_id, form_bytes = await append_field_mapping_fields(
        custom_form=input_xlsform,
        form_name=f"fmtm_{uuid4()}",
        additional_entities=args.additional_dataset_names,
        new_geom_type=args.new_geom_type,
        need_verification_fields=args.need_verification_fields,
        use_odk_collect=args.use_odk_collect,
    )

    log.info(f"Form ({form_id}) created successfully")
    with open(args.output, "wb") as file_handle:
        file_handle.write(form_bytes.getvalue())


if __name__ == "__main__":
    """Wrap for running the file directly."""
    asyncio.run(main())
