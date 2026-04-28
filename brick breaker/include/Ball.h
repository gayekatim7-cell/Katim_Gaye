#ifndef BALL_H
#define BALL_H

#include <Object.h>


class Ball : public Object
{
    public:
        Ball(Graphics &gfx);
        void show();
        void updateMovement();
        void redox();
        void reversey();
        void reversex();
        void reposition();
        ~Ball();
    private:
        int vx;
        int vy;
        Mix_Chunk* paddleBounce;
        Mix_Chunk* wallBounce;
        Mix_Chunk* over;
//Mix_Music* bgMusic = Mix_LoadMUS("resources/background.mp3");
};

#endif // BALL_H
