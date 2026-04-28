#include "Manager.h"

Manager::Manager():volume(128),difficulty(1),score(0),state(LOAD)
{

    graphics = new Graphics();
    if (!graphics->init("SDL Graphic Console", 400, 600)) {
        cerr << "Graphics initialization failed!\n";
            exit(1);
    }
    ball = new Ball(*graphics);
    paddle = new Paddle(*graphics);
    background = new Background(20, 0, 360, 600, *graphics, "C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\background01.png");
    menuBackground= new Background(20, 0, 360, 600, *graphics, "C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\start background.png");
    LoadBackground= new Background(20, 0, 360, 600, *graphics, "C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\load background.png");
    start= new Botton(150, 300, 100, 50, *graphics, "C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\button01.png");
    play= new Botton(150, 100, 100, 50, *graphics, "C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\button04.png");
    highScore= new Botton(150, 200, 100, 50, *graphics, "C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\button03.png");
    about= new Botton(150, 300, 100, 50, *graphics, "C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\button05.png");
    setting= new Botton(150, 400, 100, 50, *graphics, "C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\button06.png");
    menu= new Botton(100, 300, 50, 50, *graphics, "C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\button02.png");
    back= new Botton(0, 0, 30, 30, *graphics, "C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\button08.png");
    exits= new Botton(150, 500, 100, 50, *graphics, "C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\button09.png");
    pause= new Botton(370, 0, 30, 50, *graphics, "C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\button07.png");
    resume= new Botton(200, 300, 50, 50, *graphics, "C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\button10.png");
    restart= new Botton(300, 300, 50, 50, *graphics, "C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\button11.png");
    gameOver= new Background(30, 0, 340, 250, *graphics, "C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\game over.png");
    congrats= new Background(20, 0, 360, 600, *graphics, "C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\congratulation.png");
    selectDifficulty= new Background(20, 100, 60, 30, *graphics, "C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\difficulty.png");
    easy= new Botton(100, 100, 50, 50, *graphics, "C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\easy.png");
    medium= new Botton(200, 100, 50, 50, *graphics, "C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\medium.png");
    hard= new Botton(300, 100, 50, 50, *graphics, "C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\hard.png");
    minus= new Botton(30, 300, 50, 50, *graphics, "C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\volume minus.png");
    plus= new Botton(330, 300, 50, 50, *graphics, "C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\volume plus.png");
    bar= new Background(100, 300, 210, 50, *graphics, "C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\bar.png");
    aboutpic = new Background(20, 0, 360, 600, *graphics, "C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\about.png");
    click=Mix_LoadWAV("C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\click.wav");
    rdy=Mix_LoadWAV("C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\ready.wav");
    mnn=Mix_LoadMUS("C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\menu.mp3");
    ply=Mix_LoadMUS("C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\play.mp3");

    if (!click||!mnn||!ply||!rdy) {
           cerr << "Failed to load sound! " << Mix_GetError() << std::endl;
    }
    Mix_PlayMusic(mnn, -1);
    graphics->AddHandler(this);
}
void Manager::clickSound(){
    Mix_PlayChannel(-1, click, 0);
}
void Manager::increaseVolume() {
    volume = min(volume + 6, 128);
    Mix_Volume(-1, volume);
}

void Manager::decreaseVolume() {
    volume = max(volume - 6, 0);
    Mix_Volume(-1, volume);
    Mix_VolumeMusic(volume);
}
void Manager::HandleEvent(const SDL_Event &event){
    int mouseX, mouseY;
    SDL_GetMouseState(&mouseX, &mouseY);
    if (state==LOAD) {
      if(event.type == SDL_KEYDOWN){
        state=START;
      }
    }
    else if (state==START) {
      if(start->isMouseOver(mouseX, mouseY)){
        start->contract();
         if (event.type == SDL_MOUSEBUTTONDOWN) {
                state=MENU;
                clickSound();
         }
      }else {
        start->relax();
      }
    }
    else if(state==READY){
        if(event.type == SDL_KEYDOWN){
           state=PLAY;
           Mix_PlayMusic(ply, -1);
        }
    }
    else if (state==MENU) {
      if(play->isMouseOver(mouseX, mouseY)){
        play->contract();
         if (event.type == SDL_MOUSEBUTTONDOWN) {
                reset();
                state=READY;
                clickSound();
                Mix_PlayChannel(-1, rdy, 0);
         }
      }else {
        play->relax();
      }
      if(highScore->isMouseOver(mouseX, mouseY)){
        highScore->contract();
         if (event.type == SDL_MOUSEBUTTONDOWN) {
                state=HIGHSCORE;
                clickSound();
         }
      }else {
        highScore->relax();
      }
      if(about->isMouseOver(mouseX, mouseY)){
        about->contract();
         if (event.type == SDL_MOUSEBUTTONDOWN) {
                state=ABOUT;
                clickSound();
         }
      }else {
        about->relax();
      }
      if(setting->isMouseOver(mouseX, mouseY)){
        setting->contract();
         if (event.type == SDL_MOUSEBUTTONDOWN) {
                state=SETTING;
                clickSound();
         }
      }else {
        setting->relax();
      }
      if(exits->isMouseOver(mouseX, mouseY)){
        exits->contract();
         if (event.type == SDL_MOUSEBUTTONDOWN) {
                clickSound();
                graphics->close();
         }
      }else {
        exits->relax();
      }
      if(back->isMouseOver(mouseX, mouseY)){
        back->contract();
         if (event.type == SDL_MOUSEBUTTONDOWN) {
                state=START;
                clickSound();
         }
      }else {
        back->relax();
      }
    }
    else if(state==ABOUT){
       if(back->isMouseOver(mouseX, mouseY)){
         back->contract();
         if (event.type == SDL_MOUSEBUTTONDOWN) {
                state=MENU;
                clickSound();
         }
      }else {
        back->relax();
      }
    }
    else if(state==SETTING){
       if(back->isMouseOver(mouseX, mouseY)){
         back->contract();
         if (event.type == SDL_MOUSEBUTTONDOWN) {
                state=MENU;
                clickSound();
         }
      }else {
        back->relax();
      }
      if(easy->isMouseOver(mouseX, mouseY)){
        easy->contract();
         if (event.type == SDL_MOUSEBUTTONDOWN) {
                difficulty=0;
                clickSound();
         }
      }else {
        easy->relax();
      }
      if(medium->isMouseOver(mouseX, mouseY)){
        medium->contract();
         if (event.type == SDL_MOUSEBUTTONDOWN) {
                difficulty=1;
                clickSound();
         }
      }else {
        medium->relax();
      }
      if(hard->isMouseOver(mouseX, mouseY)){
        hard->contract();
         if (event.type == SDL_MOUSEBUTTONDOWN) {
                difficulty=2;
                clickSound();
         }
      }else {
        hard->relax();
      }
      if(plus->isMouseOver(mouseX, mouseY)){
        plus->contract();
         if (event.type == SDL_MOUSEBUTTONDOWN) {
                bar->setWidth(bar->getRect().w+10);
                increaseVolume();
                clickSound();
         }
      }else {
        plus->relax();
      }
      if(minus->isMouseOver(mouseX, mouseY)){
        minus->contract();
         if (event.type == SDL_MOUSEBUTTONDOWN) {
                bar->setWidth(bar->getRect().w-10);
                decreaseVolume();
                clickSound();
         }
      }else {
        minus->relax();
      }
    }
    else if(state==HIGHSCORE){
       if(back->isMouseOver(mouseX, mouseY)){
         back->contract();
         if (event.type == SDL_MOUSEBUTTONDOWN) {
                state=MENU;
                clickSound();
         }
      }else {
        back->relax();
      }
    }
    else if(state==PAUSE){
       if(back->isMouseOver(mouseX, mouseY)){
         back->contract();
         if (event.type == SDL_MOUSEBUTTONDOWN) {
                state=PLAY;
                clickSound();
                Mix_PlayMusic(ply, -1);
         }
      }else {
        back->relax();
      }
      if(restart->isMouseOver(mouseX, mouseY)){
         restart->contract();
         if (event.type == SDL_MOUSEBUTTONDOWN) {
                state=READY;
                this->reset();
                clickSound();
                Mix_PlayChannel(-1, rdy, 0);
         }
      }else {
        restart->relax();
      }
      if(menu->isMouseOver(mouseX, mouseY)){
        menu->contract();
         if (event.type == SDL_MOUSEBUTTONDOWN) {
                state=MENU;
                clickSound();
                Mix_PlayMusic(mnn, -1);
         }
      }else {
        menu->relax();
      }
      if(resume->isMouseOver(mouseX, mouseY)){
        resume->contract();
         if (event.type == SDL_MOUSEBUTTONDOWN) {
                state=PLAY;
                clickSound();
                Mix_PlayMusic(ply, -1);
         }
      }else {
        resume->relax();
      }
    }
    else if(state==PLAY||state==READY){
       if(pause->isMouseOver(mouseX, mouseY)){
         pause->contract();
         if (event.type == SDL_MOUSEBUTTONDOWN) {
                state=PAUSE;
                clickSound();
         }
      }else {
        pause->relax();
      }
    }
    else if(state==GAMEOVER||state==WIN){
       if(menu->isMouseOver(mouseX, mouseY)){
         menu->contract();
         if (event.type == SDL_MOUSEBUTTONDOWN) {
                state=MENU;
                clickSound();
                Mix_PlayMusic(mnn, -1);
         }
      }else {
        menu->relax();
      }
      if(restart->isMouseOver(mouseX, mouseY)){
         restart->contract();
         if (event.type == SDL_MOUSEBUTTONDOWN) {
                reset();
                state=READY;
                clickSound();
                Mix_PlayChannel(-1, rdy, 0);
         }
      }else {
        restart->relax();
      }
    }

}
void Manager::reset(){
    ball->reposition();
    paddle->reposition();
    score=0;
    for(auto& it: brick)
        it.reform();
}
void Manager::processInput(){
    graphics->pollEvents();
}
bool Manager::gameIsRunning(){
    return graphics->running();
}
void Manager::setBlock(int lines){
    brick.clear();
    brick.reserve(lines*9);
    for(int j=0;j<lines;j++){
     for(int i=0;i<9;i++){
        brick.emplace_back(i*40+20,j*18,40,18,*graphics);
     }
    }
}

void Manager::update(){

    if(state==PLAY){
    bool finish=true;
    for(auto& it:brick){
        if(it.status()){
            finish=false;
        }
    }
    if(finish){
        state=WIN;
        highestScore=loadHighScore();
        if(score>highestScore)
            saveHighScore();
    }
    if(graphics->checkCollision(ball->getRect(),paddle->getRect())){
        ball->reversey();
        ball->redox();
    }
    int touch=0;
    string side;
    for(auto& it:brick){
        if(graphics->checkCollision(ball->getRect(),it.getRect(),side)){
            it.destroy();
            score+=difficulty+1;
            touch=1;
        }
    }
    if(touch&&side=="horizontal")
        ball->reversex();
    else if(touch&&side=="vertical")
        ball->reversey();

    ball->updateMovement();
    paddle->updateMovement();
    if(ball->getRect().y>600){
        state=GAMEOVER;
        highestScore=loadHighScore();
        if(score>highestScore)
            saveHighScore();
    }
    if(difficulty==1)
      SDL_Delay(5);
    else if(difficulty==0)
      SDL_Delay(8);
    else
      SDL_Delay(3);
    }
}
void Manager::render(){
    graphics->clear();
    if(state==PLAY||state==READY){
        background->show();
        paddle->show();
        ball->show();
        for(auto& it:brick){
            it.show();
        }
        pause->show();
        graphics->setColor(100, 100, 0, 255);
    }
    else if(state==START){
        LoadBackground->show();
        start->show();

    }
    else if(state==LOAD){
        LoadBackground->show();
    }
    else if(state==MENU){
        menuBackground->show();
        play->show();
        about->show();
        setting->show();
        highScore->show();
        back->show();
        exits->show();
    }
    else if(state==SETTING){
        menuBackground->show();
        selectDifficulty->show();
        bar->show();
        plus->show();
        minus->show();
        easy->show();
        medium->show();
        hard->show();
        back->show();
    }
    else if(state==HIGHSCORE){
        menuBackground->show();
        displayHighestScore();
        back->show();
    }
    else if(state==ABOUT){
        menuBackground->show();
        aboutpic->show();
        back->show();
    }
    else if(state==PAUSE){
        background->show();
        paddle->show();
        pause->show();
        ball->show();
        for(auto& it:brick){
            it.show();
        }
        resume->show();
        back->show();
        menu->show();
        restart->show();
        graphics->setColor(100, 100, 0, 255);
    }
    else if(state==GAMEOVER){
        background->show();
        paddle->show();
        ball->show();
        menu->show();
        restart->show();
        gameOver->show();
        displayScore();
        graphics->setColor(100, 100, 0, 255);
    }
    else if(state==WIN){
        congrats->show();
        menu->show();
        restart->show();
        displayScore();
    }
    graphics->render();
}
int Manager::loadHighScore() {
    ifstream file("highscore.txt");
    int highScore = 0;
    if (file >> highScore) {
        return highScore;
    }
    return 0;
}
void Manager::saveHighScore() {
    ofstream file("highscore.txt");
    if (file.is_open()) {
        file << score;
    }
}
void Manager::displayScore() {
    TTF_Font* font = TTF_OpenFont("C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\font2.ttf", 150);
    if (!font) {
        cout << "Failed to load font: " << TTF_GetError() << endl;
    }
    SDL_Color color = {255, 0, 0};
    string text = "Score: " + to_string(score);
    SDL_Surface* surface = TTF_RenderText_Solid(font, text.c_str(), color);
    TTF_CloseFont(font);
    SDL_Texture* texture = SDL_CreateTextureFromSurface(graphics->getRenderer(), surface);

    SDL_Rect destRect = {30, 350, surface->w, surface->h};
    SDL_FreeSurface(surface);
    SDL_RenderCopy(graphics->getRenderer(), texture, NULL, &destRect);
    SDL_DestroyTexture(texture);
}
void Manager::displayHighestScore() {
    TTF_Font* font = TTF_OpenFont("C:\\Users\\HP\\Desktop\\New folder\\brick breaker\\resources\\font2.ttf", 200);
    if (!font) {
        cout << "Failed to load font: " << TTF_GetError() << endl;
    }
    SDL_Color color = {255, 0, 0};
    highestScore=loadHighScore();
    string text = "Highest Score: " + to_string(highestScore);
    SDL_Surface* surface = TTF_RenderText_Solid(font, text.c_str(), color);
    TTF_CloseFont(font);
    SDL_Texture* texture = SDL_CreateTextureFromSurface(graphics->getRenderer(), surface);

    SDL_Rect destRect = {30, 200, 300, 300};
    SDL_FreeSurface(surface);
    SDL_RenderCopy(graphics->getRenderer(), texture, NULL, &destRect);
    SDL_DestroyTexture(texture);
}
Manager::~Manager()
{
    delete graphics;
    delete ball;
    delete paddle;
    delete background;
    delete start;
    delete LoadBackground;
    delete menuBackground;
    delete setting;
    delete about;
    delete back;
    delete play;
    delete highScore;
    delete pause;
    delete exits;
    delete menu;
    delete restart;
    delete resume;
    delete gameOver;
    delete congrats;
    delete easy;
    delete medium;
    delete hard;
    delete plus;
    delete minus;
    delete bar;
    delete aboutpic;
    delete selectDifficulty;
    Mix_FreeChunk(click);
    Mix_FreeChunk(rdy);
    Mix_FreeMusic(mnn);
    Mix_FreeMusic(ply);
}
