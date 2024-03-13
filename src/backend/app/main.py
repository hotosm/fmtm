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
"""Entrypoint for FastAPI app."""

import json
import logging
import sys
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse, Response
from loguru import logger as log
from osm_fieldwork.xlsforms import xlsforms_path
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.__version__ import __version__
from app.auth import auth_routes
from app.central import central_routes
from app.config import settings
from app.db.database import get_db
from app.helpers import helper_routes
from app.models.enums import HTTPStatus
from app.organisations import organisation_routes
from app.organisations.organisation_crud import init_admin_org
from app.projects import project_routes
from app.projects.project_crud import read_xlsforms
from app.submissions import submission_routes
from app.tasks import tasks_routes
from app.users import user_routes


def get_api() -> FastAPI:
    """Return the FastAPI app, configured for the environment.

    Add endpoint profiler or monitoring setup based on environment.
    """
    api = get_application()
    # Add endpoint profiler to check for bottlenecks
    if settings.DEBUG:
        add_endpoint_profiler(api)
    # Add monitoring if flag set
    if settings.otel_exporter_otpl_endpoint:
        set_otel_tracer(api)
        # set_otel_logger()
        instrument_app_otel(api)
    return api


@asynccontextmanager
async def lifespan(app: FastAPI):
    """FastAPI startup/shutdown event."""
    log.debug("Starting up FastAPI server.")
    db_conn = next(get_db())
    log.debug("Initialising admin org and user in DB.")
    await init_admin_org(db_conn)
    log.debug("Reading XLSForms from DB.")
    await read_xlsforms(db_conn, xlsforms_path)

    yield

    # Shutdown events
    log.debug("Shutting down FastAPI server.")


def get_application() -> FastAPI:
    """Get the FastAPI app instance, with settings."""
    _app = FastAPI(
        title=settings.APP_NAME,
        description="HOTOSM Field Tasking Manager",
        version=__version__,
        license_info={
            "name": "GPL-3.0-only",
            "url": "https://raw.githubusercontent.com/hotosm/fmtm/main/LICENSE.md",
        },
        debug=settings.DEBUG,
        lifespan=lifespan,
        root_path=settings.API_PREFIX,
    )

    # Set custom logger
    _app.logger = get_logger()

    _app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.EXTRA_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["Content-Disposition"],
    )

    _app.include_router(user_routes.router)
    _app.include_router(project_routes.router)
    _app.include_router(tasks_routes.router)
    _app.include_router(central_routes.router)
    _app.include_router(auth_routes.router)
    _app.include_router(submission_routes.router)
    _app.include_router(organisation_routes.router)
    _app.include_router(helper_routes.router)

    return _app


class InterceptHandler(logging.Handler):
    """Intercept python standard lib logging."""

    def emit(self, record):
        """Retrieve context where the logging call occurred.

        This happens to be in the 6th frame upward.
        """
        logger_opt = log.opt(depth=6, exception=record.exc_info)
        logger_opt.log(record.levelno, record.getMessage())


def get_logger():
    """Override FastAPI logger with custom loguru."""
    # Hook all other loggers into ours
    logger_name_list = [name for name in logging.root.manager.loggerDict]
    for logger_name in logger_name_list:
        logging.getLogger(logger_name).setLevel(10)
        logging.getLogger(logger_name).handlers = []
        if logger_name == "sqlalchemy":
            # Don't hook sqlalchemy, very verbose
            continue
        if logger_name == "urllib3":
            # Don't hook urllib3, called on each OTEL trace
            continue
        if "." not in logger_name:
            logging.getLogger(logger_name).addHandler(InterceptHandler())

    log.remove()
    log.add(
        sys.stderr,
        level=settings.LOG_LEVEL,
        format=(
            "{time:YYYY-MM-DD HH:mm:ss.SSS} | {level: <8} "
            "| {name}:{function}:{line} | {message}"
        ),
        enqueue=True,  # Run async / non-blocking
        colorize=True,
        backtrace=True,  # More detailed tracebacks
        catch=True,  # Prevent app crashes
    )

    # Only log to file in production
    if not settings.DEBUG:
        log.add(
            "/opt/logs/fmtm.json",
            level=settings.LOG_LEVEL,
            enqueue=True,
            serialize=True,  # JSON format
            rotation="00:00",  # New file at midnight
            retention="10 days",
            # format=log_json_format, # JSON format func
        )


def add_endpoint_profiler(app: FastAPI):
    """Add endpoint profiler if DEBUG is enabled."""
    from pyinstrument import Profiler

    @app.middleware("http")
    async def profile_request(request: Request, call_next):
        """Calculate the execution time for routes."""
        profiling = request.query_params.get("profile", False)
        if profiling:
            profiler = Profiler(interval=0.001, async_mode="enabled")
            profiler.start()
            await call_next(request)
            profiler.stop()
            return HTMLResponse(profiler.output_html())
        else:
            return await call_next(request)


def set_otel_tracer(app: FastAPI):
    """Add OpenTelemetry tracing only if environment variables configured."""
    from opentelemetry import trace
    from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter

    # from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
    from opentelemetry.sdk.resources import Resource
    from opentelemetry.sdk.trace import TracerProvider
    from opentelemetry.sdk.trace.export import (
        BatchSpanProcessor,
    )

    log.info(
        "Adding OpenTelemetry tracing for url: "
        f"{settings.otel_exporter_otpl_endpoint}"
    )

    trace.set_tracer_provider(
        TracerProvider(
            resource=Resource.create({}),
        ),
    )

    # from opentelemetry.context import (
    #     Context,
    # )
    # from opentelemetry.sdk.trace import Span
    # class CustomBatchSpanProcessor(BatchSpanProcessor):
    #     def on_start(self, span: Span, parent_context: Optional[Context] = None):
    #         """Startup for Span, override to reduce verbosity of attributes."""
    #         span.set_attributes({
    #             "http.host": "",
    #             "net.host.port": "",
    #             "http.flavor": "",
    #             "http.url": "",
    #             "http.server_name": "",
    #         })

    # Console log processor (for debugging)
    # SimpleSpanProcessor(ConsoleSpanExporter()),
    span_processor = BatchSpanProcessor(
        OTLPSpanExporter(
            endpoint=settings.otel_exporter_otpl_endpoint,
        )
    )
    trace.get_tracer_provider().add_span_processor(
        span_processor,
    )

    # Ensure the HTTPException text is included in attributes
    @app.exception_handler(HTTPException)
    async def http_exception_handler(request, exc):
        current_span = trace.get_current_span()
        current_span.set_attributes(
            {
                # "span_status": "ERROR",
                "http.status_text": str(exc.detail),
                # "otel.status_description": f"{exc.status_code} / {str(exc.detail)}",
                # "otel.status_code": "ERROR"
            }
        )
        # current_span.add_event("Test")
        current_span.record_exception(exc)
        return JSONResponse(
            status_code=exc.status_code, content={"detail": str(exc.detail)}
        )


def set_otel_logger():
    """Add OpenTelemetry logging only if environment variables configured.

    FIXME not quite functional yet.
    FIXME requires better interop with loguru.
    FIXME https://github.com/Delgan/loguru/issues/674
    FIXME https://github.com/open-telemetry/opentelemetry-python/issues/3615
    FIXME Details: https://opentelemetry-python-contrib.readthedocs.io
                    /en/latest/instrumentation/logging/logging.html
    """
    from opentelemetry._logs import set_logger_provider
    from opentelemetry.exporter.otlp.proto.grpc._log_exporter import OTLPLogExporter
    from opentelemetry.instrumentation.logging import LoggingInstrumentor
    from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
    from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
    from opentelemetry.sdk.resources import Resource

    log.info(
        "Adding OpenTelemetry logging for url: "
        f"{settings.otel_exporter_otpl_endpoint}"
    )

    class FormattedLoggingHandler(LoggingHandler):
        def emit(self, record: logging.LogRecord) -> None:
            msg = self.format(record)
            record.msg = msg
            record.args = None
            self._logger.emit(self._translate(record))

    logger_provider = LoggerProvider(resource=Resource.create({}))
    set_logger_provider(logger_provider)
    otlp_log_exporter = OTLPLogExporter()
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(otlp_log_exporter))

    otel_log_handler = FormattedLoggingHandler(logger_provider=logger_provider)

    # This has to be called first before logger.getLogger().addHandler()
    # so that it can call logging.basicConfig first to set the logging format
    # based on the environment variable OTEL_PYTHON_LOG_FORMAT
    LoggingInstrumentor().instrument()
    log_formatter = logging.Formatter(
        "%(asctime)s.%(msecs)03d [%(levelname)s] %(name)s | "
        "%(funcName)s:%(lineno)d | %(message)s",
        None,
    )
    otel_log_handler.setFormatter(log_formatter)
    logging.getLogger().addHandler(otel_log_handler)


def instrument_app_otel(app: FastAPI):
    """Add OpenTelemetry FastAPI instrumentation.

    Only used if environment variables configured.
    """
    from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
    from opentelemetry.instrumentation.psycopg2 import Psycopg2Instrumentor
    from opentelemetry.instrumentation.requests import RequestsInstrumentor

    FastAPIInstrumentor.instrument_app(app)
    Psycopg2Instrumentor().instrument(enable_commenter=True, commenter_options={})
    RequestsInstrumentor().instrument()


# NOTE the application below

api = get_api()


@api.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Exception handler for more descriptive logging and traces."""
    status_code = 500
    errors = []
    for error in exc.errors():
        # TODO Handle this properly
        if error["msg"] in ["Invalid input", "field required"]:
            status_code = HTTPStatus.UNPROCESSABLE_ENTITY
        else:
            status_code = HTTPStatus.BAD_REQUEST
        errors.append(
            {
                "loc": error["loc"],
                "msg": error["msg"],
                "error": error["msg"] + str([x for x in error["loc"]]),
            }
        )
    return JSONResponse(status_code=status_code, content={"errors": errors})


@api.get("/")
async def home():
    """Redirect home to docs."""
    return RedirectResponse("/docs")


@api.get("/__version__")
async def deployment_details():
    """Mozilla Dockerflow Spec: source, version, commit, and link to CI build."""
    details = {}

    version_path = Path("/opt/version.json")
    if version_path.exists():
        with open(version_path, "r") as version_file:
            details = json.load(version_file)
    commit = details.get("commit", "commit key was not found in file!")
    build = details.get("build", "build key was not found in file!")

    return JSONResponse(
        status_code=HTTPStatus.OK,
        content={
            "source": "https://github.com/hotosm/fmtm",
            "version": __version__,
            "commit": commit or "/app/version.json not found",
            "build": build or "/app/version.json not found",
        },
    )


@api.get("/__heartbeat__")
async def heartbeat_plus_db(db: Session = Depends(get_db)):
    """Heartbeat that checks that API and DB are both up and running."""
    try:
        db.execute(text("SELECT 1"))
        return Response(status_code=HTTPStatus.OK)
    except Exception as e:
        log.warning(e)
        log.warning("Server failed __heartbeat__ database connection check")
        return JSONResponse(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR, content={"error": str(e)}
        )


@api.get("/__lbheartbeat__")
async def simple_heartbeat():
    """Simple ping/pong API response."""
    return Response(status_code=HTTPStatus.OK)
