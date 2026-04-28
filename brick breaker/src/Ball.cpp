#include "Ball.h"
#include"cstdlib"
Ball::Ball(Graphics &gfx):Object(196,544,8,8,gfx),vx(1),vy(2)
{
        SDL_Surface* Surface = IMG_Load("C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\ball.png");
        if (!Surface) {
            std::cerr << "Unable to load image! IMG_Error: " << IMG_GetError() << std::endl;
        }
        texture = SDL_CreateTextureFromSurface(gfx.getRenderer(), Surface);
        SDL_FreeSurface(Surface);
        if (!texture) {
            std::cerr << "Unable to create texture from surface! SDL_Error: " << SDL_GetError() << std::endl;
        }
        paddleBounce=Mix_LoadWAV("C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\paddle hit.wav");
        wallBounce=Mix_LoadWAV("C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\wall hit.wav");
        over=Mix_LoadWAV("C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\game over.wav");
        if (!paddleBounce || !wallBounce||!over) {
           cerr << "Failed to load sound! " << Mix_GetError() << std::endl;
        }
}
void Ball::reposition(){
    x=196;
    y=544;
    w=h=8;
    vx=1;
    vy=2;
}
void Ball::show(){
    SDL_Rect scr={x,y,w,h};
       SDL_RenderCopy(gfx.getRenderer(),texture,nullptr,&scr);

}
void Ball::redox(){
    Mix_PlayChannel(-1, paddleBounce, 0);
    if(vx<0){
        vx=rand()%3;
        vx=-vx;
    }
    else{
        vx=rand()%3;
    }
}
void Ball::reversey(){
    vy=-vy;
}
void Ball::reversex(){
    vx=-vx;
    if(vx==0)
        vx=2;
}
void Ball::updateMovement(){
    if(x+w>=380||x<=20){
        vx=-vx;
        Mix_PlayChannel(-1, wallBounce, 0);
    }

    if(y<=0){
        vy=-vy;
        Mix_PlayChannel(-1,wallBounce, 0);
    }
    if(y>=600){
        Mix_PlayChannel(-1, over, 0);
    }
    if(y<0)
        y=0;
    y+=vy;
    x+=vx;

}
Ball::~Ball(){
    Mix_FreeChunk(wallBounce);
    Mix_FreeChunk(paddleBounce);
    Mix_FreeChunk(over);
}

