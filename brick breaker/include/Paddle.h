#ifndef PADDLE_H
#define PADDLE_H

#include"Object.h"
#include"EventHandler.h"

class Paddle : public Object
{
    public:
        Paddle(Graphics &gfx);
        void show();
        void HandleEvent(const SDL_Event &event);
        void updateMovement();
        void reposition();
    private:
        int vx;
};

#endif // PADDLE_H
