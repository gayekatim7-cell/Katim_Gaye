#include"Manager.h"
#include<ctime>
using namespace std;

int main(int argc,char* argv[]) {
    srand(time(0));
    Manager game;
    game.setBlock(8);
    while (game.gameIsRunning()) {
      game.processInput();
      game.update();
      game.render();
    }
    return 0;
}



