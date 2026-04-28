#include "Object.h"
using namespace std;

Object::Object(int x, int y, int w, int h, Graphics& gfx): x(x), y(y), w(w), h(h), gfx(gfx) {}
SDL_Rect Object::getRect(){
    SDL_Rect scr={x,y,w,h};
    return scr;
}
bool Object::isMouseOver(int mouseX, int mouseY) {
    return (mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h);
}

Object::~Object() {
    SDL_DestroyTexture(texture);
}



