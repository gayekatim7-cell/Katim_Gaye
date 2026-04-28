#ifndef MANAGER_H
#define MANAGER_H
#include <SDL2/SDL.h>
#include <iostream>
#include<vector>
#include "Graphics.h"
#include"Background.h"
#include"Brick.h"
#include"Paddle.h"
#include"Ball.h"
#include"Botton.h"
using namespace std;

enum State{LOAD,START,READY,PLAY,MENU,PAUSE,SETTING,HIGHSCORE,ABOUT,GAMEOVER,WIN};
class Manager: public EventHandler
{

public:
    Manager();
    void setBlock(int lines);
    void processInput();
    void update();
    void render();
    void reset();
    void HandleEvent(const SDL_Event &event);
    bool gameIsRunning();
    void clickSound();
    void saveHighScore();
    void displayHighestScore();
    int loadHighScore();
    void increaseVolume();
    void decreaseVolume();
    void displayScore();
    virtual ~Manager();
private:
    int volume;
    int difficulty;
    int score;
    int highestScore;
    Graphics *graphics;
    Paddle *paddle;
    Ball *ball;
    Background *background;
    Botton *start;
    Botton *play;
    Botton *about;
    Botton *setting;
    Botton *highScore;
    Botton *pause;
    Botton *back;
    Botton *menu;
    Botton *exits;
    Botton *resume;
    Botton *restart;
    Botton *plus;
    Botton *minus;
    Botton *easy;
    Botton *medium;
    Botton *hard;
    Background *bar;
    Background *aboutpic;
    Background *selectDifficulty;
    Background *gameOver;
    Background *congrats;
    Background *menuBackground;
    Background *LoadBackground;
    Mix_Chunk* click;
    Mix_Chunk* rdy;
    Mix_Music* mnn;
    Mix_Music* ply;
    vector<Brick> brick;
    State state;
};

#endif // MANAGER_H
