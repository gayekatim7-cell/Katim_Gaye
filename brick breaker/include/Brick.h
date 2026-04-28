#ifndef BRICK_H
#define BRICK_H

#include <Object.h>


class Brick : public Object
{
    public:
        Brick(int x, int y, int w, int h, Graphics& gfx,string str);
        Brick(int x, int y, int w, int h, Graphics& gfx);
        void destroy();
        void reform();
        bool status();
        SDL_Rect getRect();
        void show();
        ~Brick();

    private:
        int pow;
        Mix_Chunk* destr;
};

#endif // BRICK_H
