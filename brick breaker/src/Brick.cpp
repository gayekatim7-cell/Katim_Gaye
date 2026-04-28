#include "Brick.h"

Brick::Brick(int x, int y, int w, int h, Graphics& gfx,string str):Object::Object(x,y,w,h,gfx),pow(1)
{
        SDL_Surface* Surface = IMG_Load(str.c_str());
        if (!Surface) {
            std::cerr << "Unable to load image! IMG_Error: " << IMG_GetError() << std::endl;
        }
        texture = SDL_CreateTextureFromSurface(gfx.getRenderer(), Surface);
        SDL_FreeSurface(Surface);
        if (!texture) {
            std::cerr << "Unable to create texture from surface! SDL_Error: " << SDL_GetError() << std::endl;
        }
        destr=Mix_LoadWAV("C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\break.wav");
        if (!destr) {
           cerr << "Failed to load sound! " << Mix_GetError() << std::endl;
        }
}
Brick::Brick(int x, int y, int w, int h, Graphics& gfx):Object::Object(x,y,w,h,gfx),pow(1)
{
        SDL_Surface* Surface = IMG_Load("C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\brick1.png");
        if (!Surface) {
            std::cerr << "Unable to load image! IMG_Error: " << IMG_GetError() << std::endl;
        }
        texture = SDL_CreateTextureFromSurface(gfx.getRenderer(), Surface);
        SDL_FreeSurface(Surface);
        if (!texture) {
            std::cerr << "Unable to create texture from surface! SDL_Error: " << SDL_GetError() << std::endl;
        }
        destr=Mix_LoadWAV("C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\break.wav");
        if (!destr) {
           cerr << "Failed to load sound! " << Mix_GetError() << std::endl;
        }
}
SDL_Rect Brick::getRect(){
    if(pow==0){
        SDL_Rect rect={-1,-1,-1,-1};
        return rect;
    }
    return Object::getRect();
}
void Brick::show(){
    SDL_Rect scr={x,y,w,h};
    if(pow>0)
       SDL_RenderCopy(gfx.getRenderer(),texture,nullptr,&scr);

}
void Brick::reform(){
    pow=1;
}
bool Brick::status(){
    return pow;
}
void Brick::destroy(){
        Mix_PlayChannel(-1, destr, 0);
        pow=0;
}
Brick::~Brick(){
    Mix_FreeChunk(destr);
}

