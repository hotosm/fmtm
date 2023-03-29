# Copyright (c) 2022, 2023 Humanitarian OpenStreetMap Team
#
# This file is part of FMTM.
#
#     FMTM is free software: you can redistribute it and/or modify
#     it under the terms of the GNU General Public License as published by
#     the Free Software Foundation, either version 3 of the License, or
#     (at your option) any later version.
#
#     FMTM is distributed in the hope that it will be useful,
#     but WITHOUT ANY WARRANTY; without even the implied warranty of
#     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#     GNU General Public License for more details.
#
#     You should have received a copy of the GNU General Public License
#     along with FMTM.  If not, see <https:#www.gnu.org/licenses/>.
#

''' Importing necessary libraries from SQLAlchemy for database operations '''
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

''' Importing database configuration settings '''
from ..config import settings

''' Setting up the database URL using configuration settings '''
SQLALCHEMY_DATABASE_URL = settings.DB_URL

''' Creating a SQLAlchemy database engine object that will be used to connect to the database '''
engine = create_engine(SQLALCHEMY_DATABASE_URL)

''' Creating a SQLAlchemy session factory object that will be used to create new database sessions '''
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

''' Creating a SQLAlchemy declarative base object that will be used to define database models '''
Base = declarative_base()

''' Retrieving the metadata associated with the declarative base object '''
FmtmMetadata = Base.metadata

''' Defining a function to get a database session from the session factory '''
def get_db():
    ''' Creating a new database session '''
    db = SessionLocal()
    try:
        ''' Yielding the session to the calling function for use in database operations '''
        yield db
    finally:
        ''' Closing the session after the calling function is done with it '''
        db.close()

