#ifndef EVENTHANDLER_H
#define EVENTHANDLER_H
#include"Graphics.h"

class EventHandler
{
    public:
        virtual void HandleEvent(const SDL_Event &event)=0;

};

#endif // EVENTHANDLER_H
