import logging
import multiprocessing
import uvicorn
from settings import Settings, settings
from pythonosc import osc_server
from routers import coyote, osc_server
from fastapi import BackgroundTasks, FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.include_router(coyote.router)
app.include_router(osc_server.router)
app.mount("/", StaticFiles(directory="frontend\\out", html=True), name="frontend")


@app.on_event("startup")
async def app_startup():
    logging.basicConfig(level=logging.INFO)


@app.on_event("shutdown")
async def app_shutdown():
    await coyote.stop_coyote()


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/settings")
async def get_settings() -> Settings:
    return settings


import webview


def run_webview():
    webview.create_window(
        "OSC Toys", "http://localhost:38080/index.html", width=1920, height=1080
    )
    webview.start(http_port=38080)


if __name__ == "__main__":
    process = multiprocessing.Process(target=run_webview)
    process.start()
    uvicorn.run(app, port=38080)
