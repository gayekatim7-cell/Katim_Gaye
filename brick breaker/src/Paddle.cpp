#include "Paddle.h"

Paddle::Paddle(Graphics &gfx):Object(170,550,60,7,gfx),vx(2)
{
    SDL_Surface* Surface = IMG_Load("C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\paddle.png");
        if (!Surface) {
            std::cerr << "Unable to load image! IMG_Error: " << IMG_GetError() << std::endl;
        }
        texture = SDL_CreateTextureFromSurface(gfx.getRenderer(), Surface);
        SDL_FreeSurface(Surface);
        if (!texture) {
            std::cerr << "Unable to create texture from surface! SDL_Error: " << SDL_GetError() << std::endl;
        }
}
void Paddle::show(){
    SDL_Rect scr={x,y,w,h};
       SDL_RenderCopy(gfx.getRenderer(),texture,nullptr,&scr);

}
void Paddle::reposition(){
    x=170;
    y=550;
    w=60;
    h=7;
    vx=2;
}
void Paddle::updateMovement() {
    const Uint8* state = SDL_GetKeyboardState(NULL);

    if (state[SDL_SCANCODE_LEFT]) {
        if (x > 20)
            x -= vx;
    }

    if (state[SDL_SCANCODE_RIGHT]) {
        if (x + w < 380)
            x += vx;
    }
}


