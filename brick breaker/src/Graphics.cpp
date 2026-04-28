#include "Graphics.h"
#include"EventHandler.h"
Graphics::Graphics() : window(nullptr), renderer(nullptr), isRunning(false) {}

Graphics::~Graphics() {
    cleanup();
}
bool Graphics::checkCollision(const SDL_Rect& rect1, const SDL_Rect& rect2) {
    if (rect1.x + rect1.w > rect2.x &&
        rect1.x < rect2.x + rect2.w &&
        rect1.y + rect1.h > rect2.y &&
        rect1.y < rect2.y + rect2.h) {
        return true;
    }
    return false;
}
bool Graphics::checkCollision(const SDL_Rect& rect1, const SDL_Rect& rect2, string& collisionSide) {
    if (rect1.x + rect1.w > rect2.x &&
        rect1.x < rect2.x + rect2.w &&
        rect1.y + rect1.h > rect2.y &&
        rect1.y < rect2.y + rect2.h) {

        int overlapX = min(rect1.x + rect1.w, rect2.x + rect2.w) - max(rect1.x, rect2.x);
        int overlapY = min(rect1.y + rect1.h, rect2.y + rect2.h) - max(rect1.y, rect2.y);

        collisionSide = (overlapX > overlapY) ? "vertical" : "horizontal";
        return true;
    }
    return false;
}
bool Graphics::init(const char* title, int width, int height) {
    if (SDL_Init(SDL_INIT_VIDEO) != 0) {
        std::cerr << "SDL Init Failed: " << SDL_GetError() << std::endl;
        return false;
    }
    if (TTF_Init() == -1) {
      std::cerr << "Failed to initialize SDL_ttf: " << TTF_GetError() << std::endl;
      return false;
    }
    if (Mix_OpenAudio(44100, MIX_DEFAULT_FORMAT, 2, 2048) < 0) {
    std::cerr << "SDL_mixer could not initialize! Error: " << Mix_GetError() << std::endl;
}

    if (IMG_Init(IMG_INIT_PNG) == 0) {
        std::cerr << "SDL_image could not initialize! IMG_Error: " << IMG_GetError() << std::endl;
        return -1;
    }
    window = SDL_CreateWindow(title, SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED, width, height, SDL_WINDOW_SHOWN);
    if (!window) {
        std::cerr << "Window Creation Failed: " << SDL_GetError() << std::endl;
        return false;
    }

    renderer = SDL_CreateRenderer(window, -1, SDL_RENDERER_ACCELERATED);
    if (!renderer) {
        std::cerr << "Renderer Creation Failed: " << SDL_GetError() << std::endl;
        return false;
    }
    isRunning = true;
    return true;
}
void Graphics::close(){
    isRunning=false;
}
void Graphics::AddHandler(EventHandler* handler){
    handlers.push_back(handler);
}
void Graphics::pollEvents() {
    SDL_Event event;
    while (SDL_PollEvent(&event)) {
        if (event.type == SDL_QUIT) {
            isRunning = false;
        }
        for(auto handler: handlers){
            handler->HandleEvent(event);
        }
    }
}

void Graphics::setColor(Uint8 r, Uint8 g, Uint8 b, Uint8 a) {
    SDL_SetRenderDrawColor(renderer, r, g, b, a);
}

void Graphics::render() {
    SDL_RenderPresent(renderer);
}
void Graphics::clear(){
    SDL_RenderClear(renderer);
}
void Graphics::cleanup() {
    if (renderer) {
        SDL_DestroyRenderer(renderer);
        renderer = nullptr;
    }
    if (window) {
        SDL_DestroyWindow(window);
        window = nullptr;
    }
    TTF_Quit();
    SDL_Quit();
    Mix_CloseAudio();
}

bool Graphics::running() const {
    return isRunning;
}

SDL_Renderer* Graphics::getRenderer(){return renderer;}


