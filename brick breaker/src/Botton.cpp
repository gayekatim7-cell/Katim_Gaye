#include "Botton.h"

Botton::Botton(int x, int y, int w, int h, Graphics& gfx,string str): Object::Object(x,y,w,h,gfx){
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
void Botton::contract(){
    contracted=true;
}
void Botton::relax(){
    contracted=false;
}
//void Botton::HandleEvent(const SDL_Event &event){
//
//}
void Botton::show(){
    SDL_Rect scr={x,y,w,h};
    if(contracted){
        scr.h=h-10;
        scr.w=w-10;
        scr.x=x+10;
        scr.y=y+10;
    }
    SDL_RenderCopy(gfx.getRenderer(),texture,nullptr,&scr);

}

