#ifndef OBJECT_H
#define OBJECT_H
#include"Graphics.h"
using namespace std;
class Object {
protected:
    int x, y, w, h;
    Graphics &gfx;
    SDL_Texture* texture=nullptr;
public:
    Object(int x, int y, int w, int h, Graphics& gfx);
    virtual void show()=0;
    virtual SDL_Rect getRect();
    bool isMouseOver(int mouseX, int mouseY);
    virtual ~Object();
};

#endif // OBJECT_H
