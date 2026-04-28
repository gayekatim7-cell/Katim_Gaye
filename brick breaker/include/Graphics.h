#ifndef GRAPHICS_H
#define GRAPHICS_H

#include <SDL2/SDL.h>
#include <SDL2/SDL_image.h>
#include<SDL2/SDL_ttf.h>
#include<SDL2/SDL_mixer.h>
#include <iostream>
#include<string>
#include<vector>
#include<fstream>
class EventHandler;
using namespace std;
class Graphics {
public:
    Graphics();
    ~Graphics();

    bool init(const char* title, int width, int height);
    void pollEvents();
    bool checkCollision(const SDL_Rect& rect1, const SDL_Rect& rect2);
    bool checkCollision(const SDL_Rect& rect1, const SDL_Rect& rect2, string& collisionSide);
    void setColor(Uint8 r, Uint8 g, Uint8 b, Uint8 a);
    void close();
    void render();
    void cleanup();
    void clear();
    void AddHandler(EventHandler* handler);
    bool running() const;
    SDL_Renderer* getRenderer();

private:
    SDL_Window* window;
    SDL_Renderer* renderer;
    bool isRunning;
    vector<EventHandler*> handlers;
};

#endif

