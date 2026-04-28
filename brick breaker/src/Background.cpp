#include "Background.h"

Background::Background(int x, int y, int w, int h, Graphics& gfx,string str): Object::Object(x,y,w,h,gfx){
        SDL_Surface* Surface = IMG_Load(str.c_str());
        if (!Surface) {
            std::cerr << "Unable to load image! IMG_Error: " << IMG_GetError() << std::endl;
        }
        texture = SDL_CreateTextureFromSurface(gfx.getRenderer(), Surface);
        SDL_FreeSurface(Surface);
        if (!texture) {
            std::cerr << "Unable to create texture from surface! SDL_Error: " << SDL_GetError() << std::endl;
        }
}
void Background::updateImg(string str){
        SDL_Surface* Surface = IMG_Load(str.c_str());
        if (!Surface) {
            std::cerr << "Unable to load image! IMG_Error: " << IMG_GetError() << std::endl;
        }
        texture = SDL_CreateTextureFromSurface(gfx.getRenderer(), Surface);
        SDL_FreeSurface(Surface);
        if (!texture) {
            std::cerr << "Unable to create texture from surface! SDL_Error: " << SDL_GetError() << std::endl;
        }
}
void Background::setWidth(int t){
    w=t;
    if(w<0)
        w=0;
    if(w>210)
        w=210;
}

void Background::show(){
    SDL_Rect scr={x,y,w,h};
    SDL_RenderCopy(gfx.getRenderer(),texture,nullptr,&scr);
}

