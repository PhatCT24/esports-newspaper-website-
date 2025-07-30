from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from starlette.responses import Response

from src.config import settings
from src.auth.router import router as auth_router
from src.posts.router import router as posts_router

class NoCacheStaticFiles(StaticFiles):
    async def get_response(self, path, scope):
        response: Response = await super().get_response(path, scope)
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
        return response

app = FastAPI()

app.mount("/fe-script", NoCacheStaticFiles(directory="templates/fe-script"), name="fe-script")
app.mount("/css", NoCacheStaticFiles(directory="templates/css"), name="css")
app.mount("/asset", NoCacheStaticFiles(directory="templates/asset"), name="asset")
app.mount("/uploads", NoCacheStaticFiles(directory="uploads"), name="uploads") 
app.mount("/html", NoCacheStaticFiles(directory="templates/html"), name="html")

origins = {
    settings.CLIENT_ORIGIN,
}

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*'],
)

templates = Jinja2Templates(directory="templates/html")

@app.get("/", response_class=HTMLResponse)
async def homepage(request: Request):
    return templates.TemplateResponse("homepage.html", {"request": request})


app.include_router(auth_router, prefix='/auth', tags=['auth'])
app.include_router(posts_router, prefix='/posts', tags=['posts'])

@app.get("/otp", response_class=HTMLResponse)
async def otp_page(request: Request):
    return templates.TemplateResponse("otp.html", {"request": request})
