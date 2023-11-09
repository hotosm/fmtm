from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
from apscheduler.schedulers.asyncio import AsyncIOScheduler

from .config import settings

jobstore = SQLAlchemyJobStore(url=str(settings.FMTM_DB_URL))
scheduler = AsyncIOScheduler()
scheduler.add_jobstore(jobstore)
