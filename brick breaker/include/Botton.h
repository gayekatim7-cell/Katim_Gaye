#ifndef BOTTON_H
#define BOTTON_H
#include"Object.h"
#include"EventHandler.h"

class Botton :public Object
{
    public:
        Botton(int x, int y, int w, int h, Graphics& gfx,string str);
        void show();
        void contract();
        void relax();
    private:
        bool contracted;
};

#endif // BOTTON_H
