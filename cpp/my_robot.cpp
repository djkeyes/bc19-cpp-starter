#include "cpp_starter.h"

#include <cstdlib>
#include <memory>

using std::to_string;
using std::unique_ptr;
using std::make_unique;
using std::array;
using std::pair;

namespace bc19 {

class NativeRobot : public AbstractNativeRobot {
 public:
  explicit NativeRobot(const emscripten::val &jsAbstractRobot) : AbstractNativeRobot(jsAbstractRobot) {
  }

  emscripten::val turn() override {
    log("hello world!");
    auto unit = me().unit();
    if (unit == specs::Unit::CRUSADER) {
      log("Crusader health: " + to_string(me().health()));
      static const array<pair<int, int>, 8>
          choices = {{{0, -1}, {1, -1}, {1, 0}, {1, 1}, {0, 1}, {-1, 1}, {-1, 0}, {-1, -1}}};
      const auto &choice = choices[static_cast<int>(rand() % choices.size())];
      return move(choice.first, choice.second);
    } else if (unit == specs::Unit::CASTLE) {
      log("Castle health: " + to_string(me().health()));
      if (me().turnCount() % 10 == 0) {
        log("Building a crusader at " + to_string(me().x() + 1) + ", " + to_string(me().y() + 1));
        return buildUnit(specs::Unit::CRUSADER, 1, 1);
      } else {
        return nullAction();
      }
    }

    return nullAction();
  }
};

unique_ptr<AbstractNativeRobot> AbstractNativeRobot::createNativeRobotImpl(emscripten::val jsAbstractRobot) {
  return make_unique<NativeRobot>(jsAbstractRobot);
}

}