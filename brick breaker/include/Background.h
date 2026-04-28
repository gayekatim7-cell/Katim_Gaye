#ifndef BACKGROUND_H
#define BACKGROUND_H

#include <Object.h>


class Background : public Object
{
public:
    Background(int x, int y, int w, int h, Graphics& gfx,string str);
    void updateImg(string str);
    void setWidth(int t);
    void show();
};

#endif // BACKGROUND_H
