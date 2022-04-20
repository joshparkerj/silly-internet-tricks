/* eslint-disable no-param-reassign */
const challenge = {
  init: (elevators, floors) => {
    const elevatorQueue = [];

    const setIndicator = {
      up: (e) => { e.goingUpIndicator(true); e.goingDownIndicator(false); },
      down: (e) => { e.goingUpIndicator(false); e.goingDownIndicator(true); },
    };

    const floorButton = (floorNum) => {
      const floor = floors.find(({ level }) => level === floorNum);
      const { buttonStates: { up, down } } = floor;
      if (up.length) {
        return 'up';
      }

      if (down.length) {
        return 'down';
      }

      return null;
    };

    const go = (elevator, n) => {
      const currentFloor = elevator.currentFloor();
      const button = floorButton(n);
      if (button) setIndicator[button](elevator);
      else if (n < currentFloor) setIndicator.down(elevator);
      else if (n > currentFloor) setIndicator.up(elevator);

      elevator.goToFloor(n);

      elevator.destinationQueue = [...(new Set(elevator.destinationQueue))]
        .sort((a, b) => (elevator.goingUpIndicator() ? a - b : b - a));

      elevator.checkDestinationQueue();
    };

    const isFull = (e) => Math.round(e.maxPassengerCount() * (1 - e.loadFactor())) <= 1;

    const handleFull = (e) => {
      if (isFull(e)) {
        e.destinationQueue = [];
        console.log(e.getPressedFloors());
        e.getPressedFloors().forEach((n) => go(e, n));

        return true;
      }

      return false;
    };

    const serve = (elevator, dir, comp, sorter) => {
      const filteredFloors = floors
        .filter(({ level }) => (
          comp(level, elevator.currentFloor())
          && (floorButton(level) === dir)))
        .sort(sorter);

      if (filteredFloors.length) {
        filteredFloors.forEach(({ level }) => go(elevator, level));

        return true;
      }

      return false;
    };

    const nextPickup = (e) => {
      const floorNum = e.currentFloor();
      const dist = (n) => Math.abs(floorNum - n);
      const filteredFloors = floors
        .filter(({ level }) => floorButton(level))
        .sort(({ level: a }, { level: b }) => dist(a) - dist(b));

      if (filteredFloors.length === 0) {
        return () => false;
      }

      const { level } = filteredFloors[0];
      const button = floorButton(level);

      if (level > floorNum) {
        return (elevator) => serve(
          elevator,
          button,
          (l, f) => l >= f,
          ({ level: a }, { level: b }) => (button === 'up' ? a - b : b - a),
        );
      }

      return (elevator) => serve(
        elevator,
        button,
        (l, f) => l <= f,
        ({ level: a }, { level: b }) => (button === 'up' ? a - b : b - a),
      );
    };

    if (elevators.length > 1) {
      elevators.forEach((elevator, i) => {
        const maxFloor = Math.max(...floors.map(({ level }) => level));
        elevator.goToFloor(Math.round(maxFloor * (i / (elevators.length - 1))));
      });
    }

    elevators.forEach((elevator) => {
      elevator.on('idle', () => {
        if (!nextPickup(elevator)(elevator)) {
          elevatorQueue.push(elevator);
        }
      });

      elevator.on('floor_button_pressed', (floorNum) => {
        if (!handleFull(elevator)) {
          go(elevator, floorNum);
        }
      });

      elevator.on('passing_floor', (floorNum, dir) => {
        if (
          (!handleFull(elevator))
          && (floors.find(({ level }) => level === floorNum).buttonStates[dir].length)
        ) {
          go(elevator, floorNum);
        }
      });

      elevator.on('stopped_at_floor', () => {
        handleFull(elevator);
      });
    });

    const handleButtonPressed = (n) => {
      if (elevatorQueue.length > 0) {
        go(elevatorQueue.shift(), n);
      }
    };

    floors.forEach((floor) => {
      floor.on('up_button_pressed', () => handleButtonPressed(floor.floorNum()));
      floor.on('down_button_pressed', () => handleButtonPressed(floor.floorNum()));
    });
  },
  update: () => { },
};

module.exports = challenge;
